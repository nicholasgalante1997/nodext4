class Bitmap {
  /** The size of the bitmap in bits
   * @type {number}
   * @memberof Bitmap
   */
  size: number;

  /** The data of the bitmap, stored as a Uint8Array
   * @type {Uint8Array}
   * @memberof Bitmap
   */
  data: Uint8Array;

  /**
   * Creates a bitmap of the specified size.
   * @param {number} size - The size of the bitmap in bits.
   */
  constructor(size: number) {
    this.data = new Uint8Array(Math.ceil(size / 8));
    this.size = size;
  }

  /**
   * Set a bit at the specified index to 1.
   * @param index - The index of the bit to set to 1.
   * @returns {Bitmap} - The Bitmap instance.
   * @throws {Error} - Throws an error if the index is out of bounds.
   */
  setBit(index: number) {
    if (index > this.size) throw new Error('Out of Bounds Error');
    let byteIndex = Math.floor(index / 8);
    let bitIndex = index % 8;

    // Elements within a Uint8Array are initalized to 0,
    // so if our index is defined, as a valid u8,
    // we can perform a bitwise OR operation to set the bit.
    if (typeof this.data[byteIndex] !== 'undefined') {
      this.data[byteIndex] |= 1 << bitIndex;
    }

    return this;
  }

  /**
   * Checks if a bit is set to 1 at the specified index.
   * @throws {Error} - Throws an error if the index is out of bounds.
   * @param index - The index of the bit to check
   * @returns {Bitmap} - The Bitmap instance.
   */
  getBit(index: number) {
    if (index > this.size) throw new Error('Out of Bounds Error');
    let byteIndex = Math.floor(index / 8);
    let bitIndex = index % 8;

    if (typeof this.data[byteIndex] !== 'undefined') {
      return (this.data[byteIndex] & (1 << bitIndex)) !== 0;
    }

    throw new Error('Out of Bounds Error');
  }

  toggle(index: number) {
    if (index > this.size) throw new Error('Out of Bounds Error');
    let byteIndex = Math.floor(index / 8);
    let bitIndex = index % 8;

    // Elements within a Uint8Array are initalized to 0,
    // so if our index is defined, as a valid u8,
    // we can perform a bitwise XOR operation to toggle the bit.
    if (typeof this.data[byteIndex] !== 'undefined') {
      this.data[byteIndex] ^= 1 << bitIndex;
    }

    return this;
  }

  toString() {
    return Array.from(this.data)
      .map((byte) => byte.toString(2).padStart(8, '0'))
      .join('\n');
  }
}

export default Bitmap;
export { Bitmap };
