import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import fs from 'fs/promises';
import { cmd } from './system.js';

describe('system', () => {
  beforeAll(async () => {
    await fs.mkdir('/tmp/nodext4-test', { recursive: true });
    await fs.writeFile('/tmp/nodext4-test/test.txt', 'test');
  });

  afterAll(async () => {
    await fs.rm('/tmp/nodext4-test', { recursive: true, force: true });
  });

  test('cmd - ls', async () => {
    const data = await cmd('ls /tmp/nodext4-test');
    expect(data.stdout).toContain('test.txt');
  });
});
