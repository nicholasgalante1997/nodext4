import type { IDirectoryOperations } from "./IDirOps";
import type { IFileOperations } from "./IFileOps";
import type { InodeOperations } from "./InodeOps";
import type { ISuperBlock } from "./ISuperBlock";
import type { ISuperOperations } from "./ISuperOps";

type InitFsContext = Record<string, any>;
type FsContext = Record<string, any>;
type FsParametersSpec = Record<string, any>;

/**
 * File system type definition - similar to Linux kernel's file_system_type struct
 */
interface IFileSystemType {
  /**
   * the name of the filesystem type, such as “ext2”, “iso9660”, “msdos” and so on
   */
  name: string;

  /** 
   * various flags (i.e. FS_REQUIRES_DEV, FS_NO_DCACHE, etc.) 
   * */
  fs_flags?: number;

  /**
   * Initializes ‘struct fs_context’ ->ops and ->fs_private fields with filesystem-specific data.
   */
  init_fs_context?: (context?: InitFsContext, parameters?: FsParametersSpec) => FsContext | void;

  parameters?: FsParametersSpec;
}

/**
 * A mounted file system instance
 */
interface FileSystemInstance {
  superBlock: ISuperBlock;
  superOps: ISuperOperations;
  fileOps: IFileOperations;
  inodeOps: InodeOperations;
  dirOps: IDirectoryOperations;
  mountPoint: string;
  source: string;
  options: Record<string, any>;
}

export type { IFileSystemType, FileSystemInstance };
