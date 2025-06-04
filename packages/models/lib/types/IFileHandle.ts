
interface IFileHandle {
  fd: number;          // File descriptor
  flags: number;       // Open flags (O_RDONLY, O_WRONLY, etc.)
  offset: number;      // Current file position
}

export type { IFileHandle };
