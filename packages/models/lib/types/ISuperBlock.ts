interface ISuperBlock {
  blockSize: number;
  maxFileSize: number;
  maxPathLength: number;
  fsType: string;
  totalBlocks: number;
  freeBlocks: number;
  totalInodes: number;
  freeInodes: number;
}

export type { ISuperBlock };
