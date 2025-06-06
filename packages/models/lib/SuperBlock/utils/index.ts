import { randomUUID } from 'node:crypto';
import {
    BlockSizeInBytes as DefaultBlockSizeInBytes,
    BYTES_PER_INODE_RATIO,
    bparse,
    calcInodeCount,
    calcRootReservedBlocks,
    calcTotalBlocks,
    calcLogicalBlockSize,
    calcBlocksPerBlockGroup,
    calcNumOfBlockGroups,
    calcInodesPerGroup,
    ByteConstants
} from '@nodext4/common-modules';
import { AbstractSuperBlock, SuperBlock } from "../SuperBlock";
import { SuperBlockErrorPolicy, SuperBlockSuperState, SuperBlockCreatorOS, SuperBlockExt4RevisionLevel } from '../types';

interface CreateSuperBlockOptions {
    filesystemSize: number | string;
    targetMountPath: string;
    lastMountPath?: string;
    blockGroupNumber?: number;
    blockSize?: number | string;
    bytesPerInode?: number;
    totalInodes?: number | string;
    uuid?: string;
    volumeName?: string;
    fsck?: {
        forceMountCount?: number;
        forceInodeCount?: number;
        forceBlockCount?: number;
        forceLastCheck?: number;
        forceCheckInterval?: number; // Seconds
    }
}

function getFilesystemSizeFromOptions(options: CreateSuperBlockOptions): number {
    const { filesystemSize } = options;
    if (typeof filesystemSize === 'number') {
        return filesystemSize;
    }
    
    if (typeof filesystemSize === 'string') {
        const bytes = bparse(filesystemSize);
        if (bytes) {
            return bytes;
        }
    }
    
    throw new Error('Invalid filesystem size');
}

function getBlockSizeFromOptions(options: CreateSuperBlockOptions): number {
    const { blockSize } = options;
    if (typeof blockSize === 'number') {
        return blockSize;
    }
    
    if (typeof blockSize === 'string') {
        const bytes = bparse(blockSize);
        if (bytes) {
            return bytes;
        }
    }
    
    return DefaultBlockSizeInBytes;
}

function getBytesPerInodeFromOptions(options: CreateSuperBlockOptions): number {
    const { bytesPerInode } = options;
    if (typeof bytesPerInode === 'number') {
        return bytesPerInode;
    }
    
    if (typeof bytesPerInode === 'string') {
        const bytes = bparse(bytesPerInode);
        if (bytes) {
            return bytes;
        }
    }
    
    return BYTES_PER_INODE_RATIO;
}

function getTotalInodesFromOptions(options: CreateSuperBlockOptions): number | null {
    const { totalInodes } = options;
    if (typeof totalInodes === 'number') {
        return totalInodes;
    }
    
    if (typeof totalInodes === 'string') {
        const bytes = bparse(totalInodes);
        if (bytes) {
            return bytes;
        }
    }
    
    return null;
}

function getMountCountFromOptions(options: CreateSuperBlockOptions) {
    const { fsck } = options;
    if (fsck && fsck.forceMountCount) {
        return fsck.forceMountCount;
    }
    return null;
}

function getCheckIntervalFromOptions(options: CreateSuperBlockOptions) {
    const { fsck } = options;
    if (fsck && fsck.forceCheckInterval) {
        return fsck.forceCheckInterval;
    }
    return null;
}

function getLastCheckFromOptions(options: CreateSuperBlockOptions) {
    const { fsck } = options;
    if (fsck && fsck.forceLastCheck) {
        return fsck.forceLastCheck;
    }
    return null;
}

function getBlockGroupNumberFromOptions(options: CreateSuperBlockOptions) {
    const { blockGroupNumber } = options;
    if (blockGroupNumber) {
        return blockGroupNumber;
    }
    return null;
}

const uuidToBytes = (uuid: string): Uint8Array => 
  new Uint8Array(Buffer.from(uuid.replace(/-/g, ''), 'hex'));

export function createSuperblock(options: CreateSuperBlockOptions): SuperBlock {

    const _fs_size = getFilesystemSizeFromOptions(options);
    const _fs_block_size = getBlockSizeFromOptions(options);
    const _fs_logical_block_size = calcLogicalBlockSize(_fs_block_size);
    const _fs_block_group_size = calcBlocksPerBlockGroup(_fs_block_size);
    const _fs_num_of_block_groups = calcNumOfBlockGroups(_fs_size, _fs_block_size);
    const _fs_bytes_per_inode = getBytesPerInodeFromOptions(options);
    const _fs_inodes_per_group = calcInodesPerGroup(_fs_size, _fs_num_of_block_groups);
    const _fs_sb_block_group_number = getBlockGroupNumberFromOptions(options) || 0;

    const _fsck_prov_force_mount_count = getMountCountFromOptions(options) || 0;
    const _fsck_prov_force_last_check = getLastCheckFromOptions(options) || Date.now();
    const _fsck_prov_force_check_interval = getCheckIntervalFromOptions(options) || (60 * 60 * 24 * 7 * 12); // 3mos in seconds

    const sb = new SuperBlock();

    sb.inodesCount = getTotalInodesFromOptions(options) || calcInodeCount(_fs_size, _fs_bytes_per_inode);
    sb.blocksCountLo = calcTotalBlocks(_fs_size, _fs_block_size);
    sb.reservedBlocksCount = calcRootReservedBlocks(sb.blocksCountLo);
    
    /** TODO This is incorrect, and needs to be adjusted + */
    sb.freeBlocksCount = sb.blocksCountLo - sb.reservedBlocksCount;
    /** TODO This is incorrect, and needs to be adjusted */
    sb.freeInodesCount = sb.inodesCount;

    sb.firstDataBlock = _fs_block_size > ByteConstants.KB ? 0 : 1;
    sb.logBlockSize = _fs_logical_block_size;

    /** TODO look into bigalloc; Cluster size is 2 ^ (10 + s_log_cluster_size) blocks if bigalloc is enabled. Otherwise s_log_cluster_size must equal s_log_block_size. */
    sb.logFragSize = sb.logBlockSize;
    
    sb.blocksPerGroup = _fs_block_group_size;

    /** Clusters per group, if bigalloc is enabled. Otherwise s_clusters_per_group must equal s_blocks_per_group. */
    sb.fragsPerGroup = sb.blocksPerGroup;
    
    sb.inodesPerGroup = _fs_inodes_per_group;

    sb.mountTime = 0;
    sb.writeTime = 0;

    sb.mountCount = _fsck_prov_force_mount_count;

    /** 
     * TODO determine if this is correct
     * Number of mounts beyond which a fsck is needed. 
     * */
    sb.maxMountCount = 20;

    sb.magic = AbstractSuperBlock.EXT4_SUPER_MAGIC;

    /**
     * TODO get this from fsck
     */
    sb.state = SuperBlockSuperState.CLEANLY_UNMOUNTED;

    /**
     * TODO get this from fsck
     */
    sb.errors = SuperBlockErrorPolicy.CONTINUE;

    /**
     * Look into what features we want to support
     */
    sb.minorRevLevel = 0;

    sb.lastCheck = _fsck_prov_force_last_check;

    sb.checkInterval = _fsck_prov_force_check_interval;

    sb.creatorOs = SuperBlockCreatorOS.LINUX;

    sb.revLevel = SuperBlockExt4RevisionLevel.DYN_INODES_REVISION;

    sb.defaultReservedUid = 0;
    sb.defaultReservedGid = 0;

    sb.firstInode; // TODO figure out how we determine the first non reserved inode

    sb.inodeSize = 256;

    sb.featureCompat = 0x0002 | 0x0040;
    sb.featureIncompat = 0x0000;
    sb.featureRoCompat  = 0x0000;

    sb.blockGroupNr = _fs_sb_block_group_number;

    sb.uuid = uuidToBytes(options?.uuid || randomUUID());
    sb.volumeName = options?.volumeName || 'JohtoFS';

    sb.lastMounted = options.lastMountPath || options.targetMountPath;

    sb.algorithmUsageBitmap = 0x00;

    sb.preallocBlocks = 0;
    sb.preallocDirBlocks = 0;

    sb.reservedGdtBlocks = 0; // Figure out if we do want to reserve GDT Blocks for future expansion

    
    return sb;
}