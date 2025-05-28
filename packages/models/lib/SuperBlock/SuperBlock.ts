/**
 * @abstract
 * @class AbstractSuperBlock
 *
 * Abstract base class for ext4 filesystem Superblock
 *
 * The superblock is the most critical data structure in the ext4 filesystem.
 * It contains essential metadata about the entire filesystem including:
 * - Filesystem dimensions (block count, inode count, etc.)
 * - Block and fragment sizes
 * - Filesystem state and feature flags
 * - UUID and volume name
 * - Mount information and statistics
 *
 * In ext4, the primary superblock is located at byte offset 1024 from the
 * beginning of the filesystem. Backup copies exist in block group descriptors
 * depending on filesystem features.
 *
 * Total size: 1024 bytes (with reserved space for future expansion)
 */
abstract class AbstractSuperBlock {
  /**
   * The raw buffer containing the superblock data
   * This should be exactly 1024 bytes in size
   */
  protected buffer: ArrayBuffer;

  /**
   * DataView for easier access to multi-byte values with endianness control
   * ext4 uses little-endian byte ordering
   */
  protected dataview: DataView;

  /**
   * Uint8Array view for byte-level access and manipulation
   */
  protected bytes: Uint8Array;

  /**
   * Magic number identifying this as an ext2/3/4 filesystem
   * Should always be 0xEF53
   */
  static readonly EXT4_SUPER_MAGIC = 0xef53;

  /**
   * Superblock size in bytes
   */
  static readonly SUPERBLOCK_SIZE = 1024;

  /**
   * Offset from the beginning of the filesystem where the superblock starts
   * Always at 1024 bytes (to skip boot sector)
   */
  static readonly SUPERBLOCK_OFFSET = 1024;

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      if (buffer.byteLength !== AbstractSuperBlock.SUPERBLOCK_SIZE) {
        throw new Error(`Superblock buffer must be exactly ${AbstractSuperBlock.SUPERBLOCK_SIZE} bytes`);
      }
      this.buffer = buffer;
    } else {
      // Create a new empty superblock buffer
      this.buffer = new ArrayBuffer(AbstractSuperBlock.SUPERBLOCK_SIZE);
    }

    this.dataview = new DataView(this.buffer);
    this.bytes = new Uint8Array(this.buffer);
  }

  /**
   * Parse raw buffer data into structured superblock fields
   * This method should be implemented by concrete classes to handle
   * version-specific parsing logic
   */
  abstract parse(): void;

  /**
   * Serialize the current superblock state back to the buffer
   * This method should be implemented by concrete classes to handle
   * version-specific serialization logic
   */
  abstract serialize(): void;

  /**
   * Validate the superblock for consistency and correctness
   * Should check magic number, checksums, and sanity of values
   * @returns true if valid, false otherwise
   */
  abstract validate(): boolean;

  // ===== Core filesystem parameters (offsets 0x00 - 0x5F) =====

  /**
   * Total number of inodes in the filesystem
   * Offset: 0x00, Size: 4 bytes
   * 
   * Sidenote: In ext4, non journal byte ordering is LITTLE_ENDIAN.
   * 
   * We can index 4 bytes from the offset (0x00) by using getUint32
   * with little-endian flag set to true.
   * 
   * which will give us a 32 bit unsigned integer,
   * or 4 bytes of data.
   */
  get inodesCount(): number {
    return this.dataview.getUint32(0x00, true);
  }

  set inodesCount(value: number) {
    this.dataview.setUint32(0x00, value, true);
  }

  /**
   * Total number of blocks in the filesystem (low 32 bits)
   * For filesystems > 2^32 blocks, see blocksCountHi
   * Offset: 0x04, Size: 4 bytes
   */
  get blocksCountLo(): number {
    return this.dataview.getUint32(0x04, true);
  }
  set blocksCountLo(value: number) {
    this.dataview.setUint32(0x04, value, true);
  }

  /**
   * Number of blocks reserved for superuser
   * Regular users cannot allocate these blocks
   * Offset: 0x08, Size: 4 bytes
   */
  get reservedBlocksCount(): number {
    return this.dataview.getUint32(0x08, true);
  }
  set reservedBlocksCount(value: number) {
    this.dataview.setUint32(0x08, value, true);
  }

  /**
   * Number of unallocated blocks in the filesystem
   * This is a cached value and may not be perfectly accurate
   * Offset: 0x0C, Size: 4 bytes
   */
  get freeBlocksCount(): number {
    return this.dataview.getUint32(0x0c, true);
  }
  set freeBlocksCount(value: number) {
    this.dataview.setUint32(0x0c, value, true);
  }

  /**
   * Number of unallocated inodes in the filesystem
   * This is a cached value and may not be perfectly accurate
   * Offset: 0x10, Size: 4 bytes
   */
  get freeInodesCount(): number {
    return this.dataview.getUint32(0x10, true);
  }
  set freeInodesCount(value: number) {
    this.dataview.setUint32(0x10, value, true);
  }

  /**
   * First data block number
   * For filesystems with 1KB blocks, this is 1. For larger blocks, it's 0.
   * Offset: 0x14, Size: 4 bytes
   */
  get firstDataBlock(): number {
    return this.dataview.getUint32(0x14, true);
  }
  set firstDataBlock(value: number) {
    this.dataview.setUint32(0x14, value, true);
  }

  /**
   * Block size as a power of 2, relative to 1024 bytes
   * Actual block size = 1024 << logBlockSize
   * Valid values: 0 (1KB), 1 (2KB), 2 (4KB), 3 (8KB), 4 (16KB), 5 (32KB), 6 (64KB)
   * Offset: 0x18, Size: 4 bytes
   */
  get logBlockSize(): number {
    return this.dataview.getUint32(0x18, true);
  }
  set logBlockSize(value: number) {
    this.dataview.setUint32(0x18, value, true);
  }

  /**
   * Fragment size as a power of 2, relative to 1024 bytes
   * Note: Fragments are not implemented in ext4, so this should equal logBlockSize
   * Offset: 0x1C, Size: 4 bytes
   */
  get logFragSize(): number {
    return this.dataview.getUint32(0x1c, true);
  }
  set logFragSize(value: number) {
    this.dataview.setUint32(0x1c, value, true);
  }

  /**
   * Number of blocks per block group
   * Must be a multiple of 8 and cannot exceed 8 * blockSize
   * Offset: 0x20, Size: 4 bytes
   */
  get blocksPerGroup(): number {
    return this.dataview.getUint32(0x20, true);
  }
  set blocksPerGroup(value: number) {
    this.dataview.setUint32(0x20, value, true);
  }

  /**
   * Number of fragments per block group
   * Note: Should equal blocksPerGroup since fragments are not implemented
   * Offset: 0x24, Size: 4 bytes
   */
  get fragsPerGroup(): number {
    return this.dataview.getUint32(0x24, true);
  }
  set fragsPerGroup(value: number) {
    this.dataview.setUint32(0x24, value, true);
  }

  /**
   * Number of inodes per block group
   * Must be a multiple of inodesPerBlock
   * Offset: 0x28, Size: 4 bytes
   */
  get inodesPerGroup(): number {
    return this.dataview.getUint32(0x28, true);
  }
  set inodesPerGroup(value: number) {
    this.dataview.setUint32(0x28, value, true);
  }

  /**
   * Last mount time (Unix timestamp)
   * 0 if the filesystem has never been mounted
   * Offset: 0x2C, Size: 4 bytes
   */
  get mountTime(): number {
    return this.dataview.getUint32(0x2c, true);
  }
  set mountTime(value: number) {
    this.dataview.setUint32(0x2c, value, true);
  }

  /**
   * Last write time (Unix timestamp)
   * Updated whenever the filesystem is modified
   * Offset: 0x30, Size: 4 bytes
   */
  get writeTime(): number {
    return this.dataview.getUint32(0x30, true);
  }
  set writeTime(value: number) {
    this.dataview.setUint32(0x30, value, true);
  }

  /**
   * Number of times the filesystem has been mounted since last fsck
   * Reset to 0 after a full filesystem check
   * Offset: 0x34, Size: 2 bytes
   */
  get mountCount(): number {
    return this.dataview.getUint16(0x34, true);
  }
  set mountCount(value: number) {
    this.dataview.setUint16(0x34, value, true);
  }

  /**
   * Maximum mount count before forcing a filesystem check
   * -1 disables mount-count-based checks
   * Offset: 0x36, Size: 2 bytes
   */
  get maxMountCount(): number {
    return this.dataview.getInt16(0x36, true);
  }
  set maxMountCount(value: number) {
    this.dataview.setInt16(0x36, value, true);
  }

  /**
   * Magic signature (should be 0xEF53)
   * Used to identify ext2/3/4 filesystems
   * Offset: 0x38, Size: 2 bytes
   */
  get magic(): number {
    return this.dataview.getUint16(0x38, true);
  }
  set magic(value: number) {
    this.dataview.setUint16(0x38, value, true);
  }

  /**
   * Filesystem state
   * 1 = clean, 2 = errors detected, 4 = orphans being recovered
   * Offset: 0x3A, Size: 2 bytes
   */
  get state(): number {
    return this.dataview.getUint16(0x3a, true);
  }
  set state(value: number) {
    this.dataview.setUint16(0x3a, value, true);
  }

  /**
   * Behavior when errors are detected
   * 1 = continue, 2 = remount read-only, 3 = panic
   * Offset: 0x3C, Size: 2 bytes
   */
  get errors(): number {
    return this.dataview.getUint16(0x3c, true);
  }
  set errors(value: number) {
    this.dataview.setUint16(0x3c, value, true);
  }

  /**
   * Minor revision level
   * Offset: 0x3E, Size: 2 bytes
   */
  get minorRevLevel(): number {
    return this.dataview.getUint16(0x3e, true);
  }
  set minorRevLevel(value: number) {
    this.dataview.setUint16(0x3e, value, true);
  }

  /**
   * Time of last filesystem check (Unix timestamp)
   * Offset: 0x40, Size: 4 bytes
   */
  get lastCheck(): number {
    return this.dataview.getUint32(0x40, true);
  }
  set lastCheck(value: number) {
    this.dataview.setUint32(0x40, value, true);
  }

  /**
   * Maximum time between filesystem checks (in seconds)
   * 0 disables time-based checks
   * Offset: 0x44, Size: 4 bytes
   */
  get checkInterval(): number {
    return this.dataview.getUint32(0x44, true);
  }
  set checkInterval(value: number) {
    this.dataview.setUint32(0x44, value, true);
  }

  /**
   * Creator OS
   * 0 = Linux, 1 = GNU/Hurd, 2 = Masix, 3 = FreeBSD, 4 = Lites
   * Offset: 0x48, Size: 4 bytes
   */
  get creatorOs(): number {
    return this.dataview.getUint32(0x48, true);
  }
  set creatorOs(value: number) {
    this.dataview.setUint32(0x48, value, true);
  }

  /**
   * Revision level
   * 0 = original ext2, 1 = dynamic inode sizes
   * Offset: 0x4C, Size: 4 bytes
   */
  get revLevel(): number {
    return this.dataview.getUint32(0x4c, true);
  }
  set revLevel(value: number) {
    this.dataview.setUint32(0x4c, value, true);
  }

  /**
   * Default UID for reserved blocks
   * Offset: 0x50, Size: 2 bytes
   */
  get defaultReservedUid(): number {
    return this.dataview.getUint16(0x50, true);
  }
  set defaultReservedUid(value: number) {
    this.dataview.setUint16(0x50, value, true);
  }

  /**
   * Default GID for reserved blocks
   * Offset: 0x52, Size: 2 bytes
   */
  get defaultReservedGid(): number {
    return this.dataview.getUint16(0x52, true);
  }
  set defaultReservedGid(value: number) {
    this.dataview.setUint16(0x52, value, true);
  }

  // ===== Dynamic revision fields (only valid if revLevel >= 1) =====

  /**
   * First non-reserved inode
   * In revision 0, this is fixed at 11. In revision 1+, it's typically 11 but can vary
   * Offset: 0x54, Size: 4 bytes
   */
  get firstInode(): number {
    return this.dataview.getUint32(0x54, true);
  }
  set firstInode(value: number) {
    this.dataview.setUint32(0x54, value, true);
  }

  /**
   * Size of inode structure in bytes
   * In revision 0, this is fixed at 128. In revision 1+, it's typically 256
   * Must be a power of 2 and >= 128
   * Offset: 0x58, Size: 2 bytes
   */
  get inodeSize(): number {
    return this.dataview.getUint16(0x58, true);
  }
  set inodeSize(value: number) {
    this.dataview.setUint16(0x58, value, true);
  }

  /**
   * Block group number of this superblock
   * Used for backup superblocks to identify which block group they belong to
   * Offset: 0x5A, Size: 2 bytes
   */
  get blockGroupNr(): number {
    return this.dataview.getUint16(0x5a, true);
  }
  set blockGroupNr(value: number) {
    this.dataview.setUint16(0x5a, value, true);
  }

  /**
   * Compatible feature flags
   * Filesystem can be mounted even if it doesn't understand these features
   * Offset: 0x5C, Size: 4 bytes
   */
  get featureCompat(): number {
    return this.dataview.getUint32(0x5c, true);
  }
  set featureCompat(value: number) {
    this.dataview.setUint32(0x5c, value, true);
  }

  /**
   * Incompatible feature flags
   * Filesystem cannot be mounted if it doesn't understand these features
   * Offset: 0x60, Size: 4 bytes
   */
  get featureIncompat(): number {
    return this.dataview.getUint32(0x60, true);
  }
  set featureIncompat(value: number) {
    this.dataview.setUint32(0x60, value, true);
  }

  /**
   * Read-only compatible feature flags
   * Filesystem can be mounted read-only if it doesn't understand these features
   * Offset: 0x64, Size: 4 bytes
   */
  get featureRoCompat(): number {
    return this.dataview.getUint32(0x64, true);
  }
  set featureRoCompat(value: number) {
    this.dataview.setUint32(0x64, value, true);
  }

  /**
   * 128-bit UUID for the filesystem
   * Used to uniquely identify the filesystem
   * Offset: 0x68, Size: 16 bytes
   */
  get uuid(): Uint8Array {
    return new Uint8Array(this.buffer, 0x68, 16);
  }
  set uuid(value: Uint8Array) {
    if (value.length !== 16) {
      throw new Error('UUID must be exactly 16 bytes');
    }
    this.bytes.set(value, 0x68);
  }

  /**
   * Volume name (C-style string, null-terminated)
   * Maximum 16 characters including null terminator
   * Offset: 0x78, Size: 16 bytes
   */
  get volumeName(): string {
    const nameBytes = new Uint8Array(this.buffer, 0x78, 16);
    let length = 0;
    while (length < 16 && nameBytes[length] !== 0) {
      length++;
    }
    return new TextDecoder('utf-8').decode(nameBytes.slice(0, length));
  }
  set volumeName(value: string) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(value);
    if (encoded.length >= 16) {
      throw new Error('Volume name too long (max 15 characters + null terminator)');
    }
    // Clear the field first
    this.bytes.fill(0, 0x78, 0x78 + 16);
    // Write the new name
    this.bytes.set(encoded, 0x78);
  }

  /**
   * Directory where filesystem was last mounted (C-style string)
   * Maximum 64 characters including null terminator
   * Offset: 0x88, Size: 64 bytes
   */
  get lastMounted(): string {
    const pathBytes = new Uint8Array(this.buffer, 0x88, 64);
    let length = 0;
    while (length < 64 && pathBytes[length] !== 0) {
      length++;
    }
    return new TextDecoder('utf-8').decode(pathBytes.slice(0, length));
  }
  set lastMounted(value: string) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(value);
    if (encoded.length >= 64) {
      throw new Error('Last mounted path too long (max 63 characters + null terminator)');
    }
    // Clear the field first
    this.bytes.fill(0, 0x88, 0x88 + 64);
    // Write the new path
    this.bytes.set(encoded, 0x88);
  }

  /**
   * Algorithm usage bitmap for compression
   * Not used in standard ext4
   * Offset: 0xC8, Size: 4 bytes
   */
  get algorithmUsageBitmap(): number {
    return this.dataview.getUint32(0xc8, true);
  }
  set algorithmUsageBitmap(value: number) {
    this.dataview.setUint32(0xc8, value, true);
  }

  // ===== Performance hints =====

  /**
   * Number of blocks to preallocate for regular files
   * Offset: 0xCC, Size: 1 byte
   */
  get preallocBlocks(): number {
    return this.bytes[0xcc];
  }
  set preallocBlocks(value: number) {
    this.bytes[0xcc] = value;
  }

  /**
   * Number of blocks to preallocate for directories
   * Offset: 0xCD, Size: 1 byte
   */
  get preallocDirBlocks(): number {
    return this.bytes[0xcd];
  }
  set preallocDirBlocks(value: number) {
    this.bytes[0xcd] = value;
  }

  /**
   * Number of reserved GDT entries for future expansion
   * Offset: 0xCE, Size: 2 bytes
   */
  get reservedGdtBlocks(): number {
    return this.dataview.getUint16(0xce, true);
  }
  set reservedGdtBlocks(value: number) {
    this.dataview.setUint16(0xce, value, true);
  }

  // ===== Journaling support =====

  /**
   * UUID of journal superblock
   * All zeros if using internal journal (inode specified in journalInum)
   * Offset: 0xD0, Size: 16 bytes
   */
  get journalUuid(): Uint8Array {
    return new Uint8Array(this.buffer, 0xd0, 16);
  }
  set journalUuid(value: Uint8Array) {
    if (value.length !== 16) {
      throw new Error('Journal UUID must be exactly 16 bytes');
    }
    this.bytes.set(value, 0xd0);
  }

  /**
   * Inode number of journal file
   * 0 if using external journal (device specified in journalDev)
   * Offset: 0xE0, Size: 4 bytes
   */
  get journalInum(): number {
    return this.dataview.getUint32(0xe0, true);
  }
  set journalInum(value: number) {
    this.dataview.setUint32(0xe0, value, true);
  }

  /**
   * Device number of external journal
   * 0 if using internal journal
   * Offset: 0xE4, Size: 4 bytes
   */
  get journalDev(): number {
    return this.dataview.getUint32(0xe4, true);
  }
  set journalDev(value: number) {
    this.dataview.setUint32(0xe4, value, true);
  }

  /**
   * Start of list of orphaned inodes to delete
   * Offset: 0xE8, Size: 4 bytes
   */
  get lastOrphan(): number {
    return this.dataview.getUint32(0xe8, true);
  }
  set lastOrphan(value: number) {
    this.dataview.setUint32(0xe8, value, true);
  }

  /**
   * HTREE hash seed (4 32-bit values)
   * Used for directory indexing
   * Offset: 0xEC, Size: 16 bytes
   */
  get hashSeed(): Uint32Array {
    return new Uint32Array(this.buffer, 0xec, 4);
  }
  set hashSeed(value: Uint32Array) {
    if (value.length !== 4) {
      throw new Error('Hash seed must be exactly 4 32-bit values');
    }
    new Uint32Array(this.buffer, 0xec, 4).set(value);
  }

  /**
   * Default hash algorithm for directory indexing
   * 0 = legacy, 1 = half MD4, 2 = tea, 3 = legacy unsigned, 4 = half MD4 unsigned, 5 = tea unsigned
   * Offset: 0xFC, Size: 1 byte
   */
  get defHashVersion(): number {
    return this.bytes[0xfc];
  }
  set defHashVersion(value: number) {
    this.bytes[0xfc] = value;
  }

  /**
   * Journal backup type
   * Offset: 0xFD, Size: 1 byte
   */
  get jnlBackupType(): number {
    return this.bytes[0xfd];
  }
  set jnlBackupType(value: number) {
    this.bytes[0xfd] = value;
  }

  /**
   * Size of group descriptors (if 64-bit feature enabled)
   * Offset: 0xFE, Size: 2 bytes
   */
  get descSize(): number {
    return this.dataview.getUint16(0xfe, true);
  }
  set descSize(value: number) {
    this.dataview.setUint16(0xfe, value, true);
  }

  /**
   * Default mount options
   * Bitmap of mount options that are enabled by default
   * Offset: 0x100, Size: 4 bytes
   */
  get defaultMountOpts(): number {
    return this.dataview.getUint32(0x100, true);
  }
  set defaultMountOpts(value: number) {
    this.dataview.setUint32(0x100, value, true);
  }

  /**
   * First metablock group
   * Used with the meta_bg feature
   * Offset: 0x104, Size: 4 bytes
   */
  get firstMetaBg(): number {
    return this.dataview.getUint32(0x104, true);
  }
  set firstMetaBg(value: number) {
    this.dataview.setUint32(0x104, value, true);
  }

  /**
   * Filesystem creation time (Unix timestamp)
   * Offset: 0x108, Size: 4 bytes
   */
  get mkfsTime(): number {
    return this.dataview.getUint32(0x108, true);
  }
  set mkfsTime(value: number) {
    this.dataview.setUint32(0x108, value, true);
  }

  /**
   * Backup of journal inodes for the first 15 block groups
   * Used for journal recovery
   * Offset: 0x10C, Size: 60 bytes (15 * 4 bytes)
   */
  get jnlBlocks(): Uint32Array {
    return new Uint32Array(this.buffer, 0x10c, 15);
  }
  set jnlBlocks(value: Uint32Array) {
    if (value.length !== 15) {
      throw new Error('Journal blocks array must be exactly 15 elements');
    }
    new Uint32Array(this.buffer, 0x10c, 15).set(value);
  }

  // ===== 64-bit support =====

  /**
   * High 32 bits of total block count (for > 2^32 blocks)
   * Combined with blocksCountLo for full 64-bit count
   * Offset: 0x150, Size: 4 bytes
   */
  get blocksCountHi(): number {
    return this.dataview.getUint32(0x150, true);
  }
  set blocksCountHi(value: number) {
    this.dataview.setUint32(0x150, value, true);
  }

  /**
   * High 32 bits of reserved block count
   * Offset: 0x154, Size: 4 bytes
   */
  get reservedBlocksCountHi(): number {
    return this.dataview.getUint32(0x154, true);
  }
  set reservedBlocksCountHi(value: number) {
    this.dataview.setUint32(0x154, value, true);
  }

  /**
   * High 32 bits of free block count
   * Offset: 0x158, Size: 4 bytes
   */
  get freeBlocksCountHi(): number {
    return this.dataview.getUint32(0x158, true);
  }
  set freeBlocksCountHi(value: number) {
    this.dataview.setUint32(0x158, value, true);
  }

  /**
   * Minimum inode size that can be allocated
   * Offset: 0x15C, Size: 2 bytes
   */
  get minInodeSize(): number {
    return this.dataview.getUint16(0x15c, true);
  }
  set minInodeSize(value: number) {
    this.dataview.setUint16(0x15c, value, true);
  }

  /**
   * Size that must be reserved in each inode
   * New inodes will have at least this much space
   * Offset: 0x15E, Size: 2 bytes
   */
  get wantInodeSize(): number {
    return this.dataview.getUint16(0x15e, true);
  }
  set wantInodeSize(value: number) {
    this.dataview.setUint16(0x15e, value, true);
  }

  /**
   * Miscellaneous flags
   * Bit 0: signed directory hash, Bit 1: unsigned directory hash
   * Offset: 0x160, Size: 4 bytes
   */
  get flags(): number {
    return this.dataview.getUint32(0x160, true);
  }
  set flags(value: number) {
    this.dataview.setUint32(0x160, value, true);
  }

  /**
   * RAID stride (number of logical blocks read before moving to next disk)
   * Used for performance optimization on RAID arrays
   * Offset: 0x164, Size: 2 bytes
   */
  get raidStride(): number {
    return this.dataview.getUint16(0x164, true);
  }
  set raidStride(value: number) {
    this.dataview.setUint16(0x164, value, true);
  }

  /**
   * Number of seconds to wait in multi-mount prevention (MMP)
   * Offset: 0x166, Size: 2 bytes
   */
  get mmpInterval(): number {
    return this.dataview.getUint16(0x166, true);
  }
  set mmpInterval(value: number) {
    this.dataview.setUint16(0x166, value, true);
  }

  /**
   * Block number for multi-mount protection data
   * Offset: 0x168, Size: 8 bytes
   */
  get mmpBlock(): bigint {
    return this.dataview.getBigUint64(0x168, true);
  }
  set mmpBlock(value: bigint) {
    this.dataview.setBigUint64(0x168, value, true);
  }
}
