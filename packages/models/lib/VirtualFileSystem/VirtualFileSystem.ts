import type { IDirectoryEntry, IDirectoryOperations, IFileHandle, IFileOperations, IFileStats, ISuperBlock, ISuperOperations, InodeOperations, FileDescriptor, FileMode, FileSystemInstance, IFileSystemType } from '../types';
/**
 * VFS Layer - manages registered file systems and provides the unified interface
 * This is similar to the Linux kernel's VFS layer
 */
class LinuxVFS {
  private registeredFileSystems = new Map<string, IFileSystemType>();
  private mountedFileSystems = new Map<string, FileSystemInstance>();
  private openFiles = new Map<number, { instance: FileSystemInstance; handle: IFileHandle }>();
  private nextFd = 3; // Start after stdin, stdout, stderr

  // === File System Registration ===

  /**
   * Register a file system type (like register_filesystem() in Linux)
   */
  registerFileSystem(fsType: IFileSystemType): void {
    this.registeredFileSystems.set(fsType.name, fsType);
  }

  /**
   * Unregister a file system type
   */
  unregisterFileSystem(name: string): boolean {
    return this.registeredFileSystems.delete(name);
  }

  /**
   * Get registered file system types
   */
  getRegisteredFileSystems(): string[] {
    return Array.from(this.registeredFileSystems.keys());
  }

  // === Mount/Unmount Operations ===

  /**
   * Mount a file system
   */
  async mount(fsType: string, source: string, target: string, options?: Record<string, any>): Promise<void> {
    const fs = this.registeredFileSystems.get(fsType);
    if (!fs) {
      throw new Error(`File system type '${fsType}' not registered`);
    }

    if (this.mountedFileSystems.has(target)) {
      throw new Error(`Target '${target}' already mounted`);
    }

    const instance = await fs.mount(source, target, options);
    this.mountedFileSystems.set(target, instance);
  }

  /**
   * Unmount a file system
   */
  async umount(target: string, force = false): Promise<void> {
    const instance = this.mountedFileSystems.get(target);
    if (!instance) {
      throw new Error(`No file system mounted at '${target}'`);
    }

    // Close any open files from this filesystem
    for (const [fd, fileInfo] of this.openFiles.entries()) {
      if (fileInfo.instance === instance) {
        await fileInfo.instance.fileOps.close(fileInfo.handle);
        this.openFiles.delete(fd);
      }
    }

    // Call filesystem-specific cleanup
    const fsType = this.registeredFileSystems.get(instance.superBlock.fsType);
    if (fsType?.killSuperblock) {
      await fsType.killSuperblock(instance);
    }

    this.mountedFileSystems.delete(target);
  }

  // === Path Resolution ===

  /**
   * Find which filesystem instance handles a given path
   */
  private findFileSystemForPath(path: string): FileSystemInstance {
    // Find the longest matching mount point
    let bestMatch = '';
    let bestInstance: FileSystemInstance | null = null;

    for (const [mountPoint, instance] of this.mountedFileSystems.entries()) {
      if (path.startsWith(mountPoint) && mountPoint.length > bestMatch.length) {
        bestMatch = mountPoint;
        bestInstance = instance;
      }
    }

    if (!bestInstance) {
      throw new Error(`No file system mounted for path: ${path}`);
    }

    return bestInstance;
  }

  /**
   * Convert absolute path to relative path within filesystem
   */
  private getRelativePath(path: string, instance: FileSystemInstance): string {
    return path.substring(instance.mountPoint.length) || '/';
  }

  /**
   * Resolve path to inode number
   */
  private async pathToInode(path: string): Promise<{ instance: FileSystemInstance; ino: number }> {
    const instance = this.findFileSystemForPath(path);
    const relativePath = this.getRelativePath(path, instance);

    // Start from root inode (typically inode 2 in Unix filesystems)
    let currentIno = 2;

    if (relativePath === '/') {
      return { instance, ino: currentIno };
    }

    // Walk the path components
    const components = relativePath.split('/').filter((c) => c.length > 0);
    for (const component of components) {
      const nextIno = await instance.inodeOps.lookup(currentIno, component);
      if (nextIno === null) {
        throw new Error(`Path not found: ${path}`);
      }
      currentIno = nextIno;
    }

    return { instance, ino: currentIno };
  }

  // === VFS Interface Methods ===

  /**
   * Open a file and return a file descriptor
   */
  async open(path: string, flags: number, mode?: FileMode): Promise<number> {
    const { instance, ino } = await this.pathToInode(path);

    const handle: IFileHandle = {
      fd: this.nextFd++,
      flags,
      offset: 0
    };

    this.openFiles.set(handle.fd, { instance, handle });
    return handle.fd;
  }

  /**
   * Close a file descriptor
   */
  async close(fd: number): Promise<void> {
    const fileInfo = this.openFiles.get(fd);
    if (!fileInfo) {
      throw new Error(`Invalid file descriptor: ${fd}`);
    }

    await fileInfo.instance.fileOps.close(fileInfo.handle);
    this.openFiles.delete(fd);
  }

  /**
   * Read from a file descriptor
   */
  async read(fd: number, buffer: Buffer, offset: number, length: number): Promise<number> {
    const fileInfo = this.openFiles.get(fd);
    if (!fileInfo) {
      throw new Error(`Invalid file descriptor: ${fd}`);
    }

    return fileInfo.instance.fileOps.read(fileInfo.handle, buffer, offset, length);
  }

  /**
   * Write to a file descriptor
   */
  async write(fd: number, buffer: Buffer, offset: number, length: number): Promise<number> {
    const fileInfo = this.openFiles.get(fd);
    if (!fileInfo) {
      throw new Error(`Invalid file descriptor: ${fd}`);
    }

    return fileInfo.instance.fileOps.write(fileInfo.handle, buffer, offset, length);
  }

  /**
   * Get file statistics
   */
  async stat(path: string): Promise<IFileStats> {
    const { instance, ino } = await this.pathToInode(path);
    return instance.inodeOps.getattr(ino);
  }

  /**
   * Create a new file
   */
  async create(path: string, mode: FileMode): Promise<void> {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    const filename = path.substring(path.lastIndexOf('/') + 1);

    const { instance, ino: parentIno } = await this.pathToInode(parentPath);
    await instance.inodeOps.create(parentIno, filename, mode);
  }

  /**
   * Remove a file
   */
  async unlink(path: string): Promise<void> {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    const filename = path.substring(path.lastIndexOf('/') + 1);

    const { instance, ino: parentIno } = await this.pathToInode(parentPath);
    await instance.inodeOps.unlink(parentIno, filename);
  }

  /**
   * Create a directory
   */
  async mkdir(path: string, mode: FileMode): Promise<void> {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    const dirname = path.substring(path.lastIndexOf('/') + 1);

    const { instance, ino: parentIno } = await this.pathToInode(parentPath);
    await instance.inodeOps.mkdir(parentIno, dirname, mode);
  }

  /**
   * Read directory contents
   */
  async readdir(path: string): Promise<IDirectoryEntry[]> {
    const { instance, ino } = await this.pathToInode(path);
    return instance.dirOps.readdir(ino);
  }

  /**
   * Get mounted filesystems info
   */
  getMounts(): Array<{ mountPoint: string; fsType: string; source: string; options: Record<string, any> }> {
    return Array.from(this.mountedFileSystems.entries()).map(([mountPoint, instance]) => ({
      mountPoint,
      fsType: instance.superBlock.fsType,
      source: instance.source,
      options: instance.options
    }));
  }

  // Add other VFS operations following the same pattern...
  // chmod, chown, rename, symlink, etc. would all follow this same pattern
  // of resolving paths to inodes and delegating to the appropriate filesystem operations
}
