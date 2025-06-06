// https://origin.kernel.org/doc/html/latest/filesystems/ext4/globals.html#super-block

export interface SuperblockMetadata {
  /**
   * The total number of inodes in the filesystem.
   * This is the total number of files and directories that can be created in the filesystem.
   *
   * In 32 bit systems, this value can be (at most) 2^32
   * In 64 bit systems, this value can be (at most) 2^64
   *
   * Location: offset 0x00, size 4 bytes (___le32)
   */
  s_inodes_count: number | bigint;

  /**
   * The total number of blocks in the filesystem.
   *
   * Location: offset 0x04, size 4 bytes (___le32)
   */
  s_blocks_count_lo: number | bigint;

  /**
   * The number of reserved blocks in the filesystem.
   * These blocks are reserved for the superuser and are not available for general use.
   * Location: offset 0x08, size 4 bytes (___le32)
   */
  s_r_blocks_count_lo: number | bigint;

  /**
   * The number of free blocks in the filesystem.
   * This is the number of blocks that are currently available for use.
   * Location: offset 0x0C, size 4 bytes (___le32)
   */
  s_free_blocks_count_lo: number | bigint;

  /**
   * The number of free inodes in the filesystem.
   * This is the number of inodes that are currently available for use.
   * Location: offset 0x10, size 4 bytes (___le32)
   */
  s_free_inodes_count: number | bigint;

  
}

export enum SuperBlockErrorPolicy {
  CONTINUE = 0x01,
  REMOUNT_RO = 0x02,
  PANIC = 0x03
}

export enum SuperBlockSuperState {
  CLEANLY_UNMOUNTED = 0x0001,
  ERROR_FS = 0x0002,
  ORPHAN_FS = 0x0004
}

export enum SuperBlockCreatorOS {
  LINUX = 0,
  HURD = 1,
  MASIX = 2,
  FREEBSD = 3,
  LITES = 4
}

export enum SuperBlockExt4RevisionLevel {
  ORIGINAL = 0,
  DYN_INODES_REVISION = 1
}