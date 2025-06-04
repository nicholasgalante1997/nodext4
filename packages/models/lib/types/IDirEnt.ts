interface IDirectoryEntry {
  name: string;
  type: 'file' | 'directory' | 'symlink' | 'block' | 'char' | 'fifo' | 'socket';
  ino: number;         // Inode number
}

export type { IDirectoryEntry };