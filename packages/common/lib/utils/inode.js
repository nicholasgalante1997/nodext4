import { ByteConstants } from '../constants/bytes.js';

const BYTES_PER_INODE_RATIO = 16 * ByteConstants.KB;

/**
 * Calculates the number of inodes based on the filesystem size and bytes per inode ratio
 * @param {number} filesystemSizeInBytes - The size of the filesystem in bytes
 * @param {number} bytesPerInodeRatio - The ratio of bytes per inode
 * 
 * Example
 * For a 1GB filesystem:
 *
 * Inode count: 1GB / 16KB = ~65,536 inodes
 * Space for inode table: 65,536 × 256 bytes = ~16MB total space allocated for storing all the inode structures
 * 
 * So the 16,384 is a planning ratio to decide density, 
 * while 256 is the actual storage footprint of each individual inode structure.
 */
export function calcInodeCount(filesystemSizeInBytes,  bytesPerInodeRatio = BYTES_PER_INODE_RATIO) {
    return Math.floor(filesystemSizeInBytes / bytesPerInodeRatio);
}