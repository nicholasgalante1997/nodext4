import type { FileMode } from "./IFile";
import type { IFileStats } from "./IFileStats";

/**
 * Inode operations - equivalent to Linux kernel's inode_operations struct
 * These are operations on filesystem objects (files, directories, etc.)
 */
interface InodeOperations {
  lookup: (parentIno: number, name: string) => Promise<number | null>;
  create: (parentIno: number, name: string, mode: FileMode) => Promise<number>;
  unlink: (parentIno: number, name: string) => Promise<void>;
  mkdir: (parentIno: number, name: string, mode: FileMode) => Promise<number>;
  rmdir: (parentIno: number, name: string) => Promise<void>;
  rename: (oldParentIno: number, oldName: string, newParentIno: number, newName: string) => Promise<void>;
  symlink: (parentIno: number, name: string, target: string) => Promise<number>;
  readlink: (ino: number) => Promise<string>;
  link: (oldIno: number, parentIno: number, name: string) => Promise<void>;
  chmod: (ino: number, mode: FileMode) => Promise<void>;
  chown: (ino: number, uid: number, gid: number) => Promise<void>;
  utime: (ino: number, atime: Date, mtime: Date) => Promise<void>;
  getattr: (ino: number) => Promise<IFileStats>;
  setxattr?: (ino: number, name: string, value: Buffer, flags: number) => Promise<void>;
  getxattr?: (ino: number, name: string) => Promise<Buffer>;
  listxattr?: (ino: number) => Promise<string[]>;
  removexattr?: (ino: number, name: string) => Promise<void>;
}

export type { InodeOperations };