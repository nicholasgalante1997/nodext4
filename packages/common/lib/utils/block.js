import { BlockSizeInBytes } from '../constants/block.js';

/**
 * Calculates the total number of blocks in the filesystem.
 *
 * @param {number} filesystemSizeInBytes - The size of the filesystem in bytes.
 * @param {number} [blockSizeInBytes] - The size of each block in bytes. Defaults to {@link BlockSizeInBytes}.
 * @returns {number} The total number of blocks in the filesystem.
 */
export function calcTotalBlocks(filesystemSizeInBytes, blockSizeInBytes = BlockSizeInBytes) {
    return Math.floor(filesystemSizeInBytes / blockSizeInBytes);
}

/**
 * Calculates the number of blocks reserved for root.
 *
 * The default is 5% of the total blocks.
 *
 * @param {number} totalBlocks - The total number of blocks in the filesystem.
 * @returns {number} The number of blocks reserved for root.
 */
export function calcRootReservedBlocks(totalBlocks) {
    return Math.floor(totalBlocks * 0.05);
}

/**
 * Calculates the logical block size from the physical block size.
 *
 * The block size is determined by the value of the s_log_block_size field in
 * the superblock. The formula is as follows: block_size = 2^(10 + s_log_block_size)
 *
 * @param {number} physicalBlockSize - The physical size of the block in bytes.
 * @returns {number} The logical block size.
 */
export function calcLogicalBlockSize(physicalBlockSize) {
    // Block size = 2^(10 + s_log_block_size)
    // So: s_log_block_size = log2(block_size) - 10
    return Math.log2(physicalBlockSize) - 10;
}

/**
 * Calculates the number of blocks per block group.
 *
 * The number of blocks per block group is a multiple of 8 and cannot
 * exceed 8 times the block size.
 *
 * @param {number} blockSizeInBytes - The size of each block in bytes.
 * @returns {number} The number of blocks per block group.
 */
export function calcBlocksPerBlockGroup(blockSizeInBytes) {
    return Math.floor(8 * blockSizeInBytes);
}

export function calcNumOfBlockGroups(totalFileSystemSize, blockGroupSize) {
    /**
     * 1. Step 1: Calculate block group size Block group size = Blocks per group × Block size
     * 2. Step 2: Calculate number of block groups Number of groups = Total filesystem size ÷ Block group size
     */

    return Math.floor(totalFileSystemSize / blockGroupSize);
}