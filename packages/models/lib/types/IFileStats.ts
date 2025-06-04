interface IFileStats {
  size: number;
  mode: number;        // File permissions and type
  uid: number;         // User ID
  gid: number;         // Group ID
  atime: Date;         // Access time
  mtime: Date;         // Modification time
  ctime: Date;         // Change time
  dev: number;         // Device ID
  ino: number;         // Inode number
  nlink: number;       // Number of hard links
  blocks: number;      // Number of 512-byte blocks allocated
  blksize: number;     // Preferred block size for I/O
}

export type { IFileStats };
