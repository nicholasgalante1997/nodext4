import type { IDirectoryEntry } from './IDirEnt';

/**
 * Directory operations - for reading directory contents
 */
interface IDirectoryOperations {
  readdir: (ino: number, offset?: number) => Promise<IDirectoryEntry[]>;
  finddir: (ino: number, name: string) => Promise<IDirectoryEntry | null>;
}

export type { IDirectoryOperations };
