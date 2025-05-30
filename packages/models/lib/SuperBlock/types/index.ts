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
    s_inodes_count: number | BigInt;

    /**
     * The total number of blocks in the filesystem.
     * 
     * Location: offset 0x04, size 4 bytes (___le32)
     */
    s_blocks_count_lo: number | BigInt;


}