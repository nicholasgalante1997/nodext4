import type { PathLike, Stats } from "fs";
import fs from "fs/promises";

import { error, warn } from '@nodext4/common-modules';

export class BlockDevice {

    device: fs.FileHandle | null = null;
    stats: Stats | null = null;

    public static async isBlockDevice(path: PathLike) {
        try {
            return (await fs.stat(path)).isBlockDevice();
        } catch (e) {
            error(e);
            return false;
        }
    }

    constructor(public readonly path: PathLike) {}

    async init() {
        if (!(await BlockDevice.isBlockDevice(this.path))) {
            throw new Error(`Path ${this.path} is not a block device.`);
        }

        const dev = await fs.open(this.path, "r+");
        if (dev) {
            this.device = dev;

            const stats = await dev.stat();
            this.stats = stats;
        }
    }

    getAbsoluteSizeOfBlockDevice() {
        if (!this.stats) {
            throw new Error("Block device not initialized.");
        }

        if (this.stats.size === 0) {
            warn(`Block device ${this.path} has a size of 0 bytes.`);
            return null;
        }

        return this.stats.size;
    }
}

export default BlockDevice;
