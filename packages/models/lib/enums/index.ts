// ===== Feature flag constants =====

/**
 * Compatible feature flags
 * These features are backward compatible
 */
export enum Ext4CompatFeatures {
  DIR_PREALLOC = 0x0001, // Directory preallocation
  IMAGIC_INODES = 0x0002, // AFS magic inodes
  HAS_JOURNAL = 0x0004, // Has a journal
  EXT_ATTR = 0x0008, // Extended attributes
  RESIZE_INODE = 0x0010, // Reserved inode for expanding
  DIR_INDEX = 0x0020, // Directory indexing (HTree)
  SPARSE_SUPER2 = 0x0200 // Sparse superblock v2
}

/**
 * Incompatible feature flags
 * Filesystem cannot be mounted if it doesn't support these
 */
export enum Ext4IncompatFeatures {
  COMPRESSION = 0x0001, // Compression (not implemented)
  FILETYPE = 0x0002, // Directory entries have file type
  RECOVER = 0x0004, // Needs recovery
  JOURNAL_DEV = 0x0008, // Is a journal device
  META_BG = 0x0010, // Meta block groups
  EXTENTS = 0x0040, // Use extents for files
  _64BIT = 0x0080, // 64-bit support
  MMP = 0x0100, // Multi-mount protection
  FLEX_BG = 0x0200, // Flexible block groups
  EA_INODE = 0x0400, // EA in inode
  DIRDATA = 0x1000, // Data in directory entries
  CSUM_SEED = 0x2000, // Checksum seed in superblock
  LARGEDIR = 0x4000, // Large directory >2GB
  INLINE_DATA = 0x8000, // Data inline in inode
  ENCRYPT = 0x10000 // Encrypted inodes
}

/**
 * Read-only compatible feature flags
 * Can mount read-only if these aren't supported
 */
export enum Ext4RoCompatFeatures {
  SPARSE_SUPER = 0x0001, // Sparse superblock
  LARGE_FILE = 0x0002, // Large files >2GB
  BTREE_DIR = 0x0004, // Btree directories (not used)
  HUGE_FILE = 0x0008, // Files with size in blocks
  GDT_CSUM = 0x0010, // Group descriptor checksums
  DIR_NLINK = 0x0020, // >32k subdirectories
  EXTRA_ISIZE = 0x0040, // Extra inode size
  HAS_SNAPSHOT = 0x0080, // Has snapshot
  QUOTA = 0x0100, // Quota
  BIGALLOC = 0x0200, // Cluster allocation
  METADATA_CSUM = 0x0400, // Metadata checksums
  REPLICA = 0x0800, // Replica support
  READONLY = 0x1000, // Read-only filesystem
  PROJECT = 0x2000, // Project quotas
  VERITY = 0x8000, // fs-verity
  ORPHAN_FILE = 0x10000 // Orphan file allocated
}

/**
 * Filesystem states
 */
export enum Ext4State {
  VALID_FS = 0x0001, // Unmounted cleanly
  ERROR_FS = 0x0002, // Errors detected
  ORPHAN_FS = 0x0004 // Orphans being recovered
}

/**
 * Error handling behaviors
 */
export enum Ext4Errors {
  CONTINUE = 1, // Continue on errors
  RO = 2, // Remount read-only on errors
  PANIC = 3 // Kernel panic on errors
}

/**
 * Creator OS IDs
 */
export enum Ext4Os {
  LINUX = 0,
  HURD = 1,
  MASIX = 2,
  FREEBSD = 3,
  LITES = 4
}

/**
 * Hash algorithms for directory indexing
 */
export enum Ext4HashAlgorithm {
  LEGACY = 0,
  HALF_MD4 = 1,
  TEA = 2,
  LEGACY_UNSIGNED = 3,
  HALF_MD4_UNSIGNED = 4,
  TEA_UNSIGNED = 5
}
