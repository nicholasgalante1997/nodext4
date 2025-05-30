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
  });
});
