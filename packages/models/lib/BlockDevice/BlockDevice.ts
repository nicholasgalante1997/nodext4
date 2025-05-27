import type { PathLike } from "fs";
import { stat } from "fs/promises";

export class BlockDevice {
    public static async isBlockDevice(path: PathLike) {
        try {
            return (await stat(path)).isBlockDevice();
        } catch (error) {
            
            return false;
        }
    }
}