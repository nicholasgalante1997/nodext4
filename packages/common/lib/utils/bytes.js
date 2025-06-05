import bytes from 'bytes';

const bformat = bytes.format.bind(bytes);
const bparse = bytes.parse.bind(bytes);

export { bformat, bparse };