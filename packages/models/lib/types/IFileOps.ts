import type { IFileHandle } from "./IFileHandle";

type Bytes = ArrayBufferLike | Uint8Array | Uint16Array | Uint32Array | DataView<ArrayBufferLike> | Buffer<ArrayBufferLike>;

/**
 * File operations - equivalent to Linux kernel's file_operations struct
 * These are the operations that can be performed on open files
 */
interface IFileOperations {
  /** TODO: P1 */
  read: <B = Bytes>(handle: IFileHandle, buffer: B, offset: number, length: number) => Promise<number>;
  /** TODO: P1 */
  write: <B = Bytes>(handle: IFileHandle, buffer: B, offset: number, length: number) => Promise<number>;
  seek: (handle: IFileHandle, offset: number, whence: number) => Promise<number>;
  fsync: (handle: IFileHandle) => Promise<void>;
  close: (handle: IFileHandle) => Promise<void>;
  ioctl?: (handle: IFileHandle, cmd: number, arg: any) => Promise<any>;
  mmap?: (handle: IFileHandle, offset: number, length: number, prot: number) => Promise<Buffer>;
}

export type { IFileOperations };