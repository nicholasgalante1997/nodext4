import { describe, expect, test } from 'bun:test';
import { SuperBlock } from './SuperBlock';

describe('SuperBlock', () => {
  describe('Byte Configuration', () => {
    test('A SuperBlock can be instantiated without a provided buffer', () => {
      const sb = new SuperBlock();
      const size = sb.size;
      expect(size).toBe(SuperBlock.SUPERBLOCK_SIZE);
      expect(size).toBe(1024);
    });

    test('A SuperBlock can be instantiated with a provided buffer', () => {
      const sb = new SuperBlock(new ArrayBuffer(SuperBlock.SUPERBLOCK_SIZE));
      const size = sb.size;
      expect(size).toBe(SuperBlock.SUPERBLOCK_SIZE);
      expect(size).toBe(1024);
    });

    test('A SuperBlock should contain the inode count in the first 4 bytes', () => {
      const buffer = new ArrayBuffer(SuperBlock.SUPERBLOCK_SIZE);
      const dataview = new DataView(buffer);
      const sb = new SuperBlock(buffer);
      sb.inodesCount = 22;
      expect(sb.inodesCount).toBe(22);
      expect(dataview.getUint32(0x00, true)).toBe(22);
    });

    test('A SuperBlock should contain the block count lo in the second 4 bytes', () => {
      const buffer = new ArrayBuffer(SuperBlock.SUPERBLOCK_SIZE);
      const dataview = new DataView(buffer);
      const sb = new SuperBlock(buffer);
      sb.blocksCountLo = 22 * 4;
      expect(sb.blocksCountLo).toBe(22 * 4);
      expect(dataview.getUint32(0x04, true)).toBe(22 * 4);
    });
  });
});
