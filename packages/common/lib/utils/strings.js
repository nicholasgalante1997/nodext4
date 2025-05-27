function toUint8Array(str) {
  return new TextEncoder().encode(str);
}

function toString(uint8Array) {
  return new TextDecoder().decode(uint8Array);
}

export { toUint8Array, toString };
