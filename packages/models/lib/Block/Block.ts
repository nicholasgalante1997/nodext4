import { BlockSize } from '@nodext4/common-modules';

/**
 * @class Block
 * Represents a block in the filesystem.
 * Each block has a unique identifier and a data buffer.
 * The identifier is a Symbol to ensure uniqueness.
 * The data buffer is an ArrayBuffer of size BlockSize.
 * The default block size is 4KB
 *
 * Each block is intended to hold file content or metadata.
 */
class Block {
  id: Symbol;
  data: ArrayBuffer;

  constructor() {
    this.id = Symbol('BlockID');
    this.data = new ArrayBuffer(BlockSize);
  }

  readFromBlock(offset: number = 0, length: number = BlockSize): Uint8Array {
    if (offset < 0 || length <= 0 || offset + length > this.data.byteLength) {
      throw new RangeError('Invalid offset or length for reading from block');
    }
    return new Uint8Array(this.data, offset, length);
  }

  writeToBlock(data: Uint8Array, offset: number = 0): void {
    if (offset < 0 || offset + data.length > this.data.byteLength) {
      throw new RangeError('Invalid offset for writing to block');
    }
    const view = new Uint8Array(this.data);
    view.set(data, offset);
  }

  clearBlock(): void {
    const view = new Uint8Array(this.data);
    view.fill(0);
  }

  getBlockSize(): number {
    return this.data.byteLength;
  }

  getBlockId(): Symbol {
    return this.id;
  }

  isEmpty(): boolean {
    const view = new Uint8Array(this.data);
    return view.every((byte) => byte === 0);
  }

  toString(): string {
    return `Block ID: ${this.id.toString()}, Size: ${this.getBlockSize()} bytes, Empty: ${this.isEmpty()}`;
  }

  equals(other: Block): boolean {
    if (!(other instanceof Block)) {
      return false;
    }
    return (
      this.id === other.id &&
      this.data.byteLength === other.data.byteLength &&
      new Uint8Array(this.data).every((byte, index) => byte === new Uint8Array(other.data)[index])
    );
  }
}

export default Block;
