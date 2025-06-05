import type { PathLike } from "bun";

interface I_mkfs {
    (target: PathLike): void;
    (target: PathLike, fsType: string): void;
}

function mkfs(target: PathLike): void;
function mkfs(target: PathLike, fsType: string): void;
function mkfs(target: PathLike, fsType?: string): void {}

export default mkfs as I_mkfs;