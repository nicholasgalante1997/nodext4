import { SuperBlock } from "../SuperBlock";


export function createValidSuperblock(options: any = {}): SuperBlock {
    const sb = new SuperBlock();

    sb.inodesCount = options.inodesCount ||= 1_000_000;

    return sb;
}