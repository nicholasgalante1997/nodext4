import { ByteConstants } from './bytes.js';

/**
 * 4KiB
 * @type {number}
 * */
export const BlockSizeInBytes = 4 * ByteConstants.KB;

/**
 * 128 MiB (32,768 Blocks)
 * @type {number}
 * */
export const BlocksPerGroup = 8 * BlockSizeInBytes;
