import type { IFileStats } from './IFileStats';

/**
 * Super operations - equivalent to Linux kernel's super_operations struct
 * These are filesystem-wide operations
 */
interface ISuperOperations {
  readInode: (ino: number) => Promise<IFileStats>;
  writeInode: (ino: number, stats: Partial<IFileStats>) => Promise<void>;
  deleteInode: (ino: number) => Promise<void>;
  allocInode: () => Promise<number>;
  statfs: () => Promise<{
    type: number;        // File system type
    bsize: number;       // Block size
    blocks: number;      // Total blocks
    bfree: number;       // Free blocks
    bavail: number;      // Available blocks for non-root
    files: number;       // Total inodes
    ffree: number;       // Free inodes
  }>;
  sync: () => Promise<void>;
  remount?: (options: Record<string, any>) => Promise<void>;
}

export type { ISuperOperations };
