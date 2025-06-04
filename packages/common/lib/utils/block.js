import { BlockSizeInBytes } from '../constants/block.js';

export function calcTotalBlocks(filesystemSizeInBytes, blockSizeInBytes = BlockSizeInBytes) {
    return Math.floor(filesystemSizeInBytes / blockSizeInBytes);
}