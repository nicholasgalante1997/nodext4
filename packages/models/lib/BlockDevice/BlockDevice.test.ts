import { describe, it, expect, beforeEach, afterEach, mock, spyOn } from "bun:test";
import fs from "fs/promises";
import type { Stats } from "fs";

import BlockDevice from "./BlockDevice";

describe("BlockDevice", () => {
  let mockFileHandle: any;
  let mockStats: Stats;

  beforeEach(() => {

    // Create mock file handle
    mockFileHandle = {
      stat: mock(),
      close: mock(),
      [Symbol.asyncDispose]: mock(),
    };

    // Create mock stats object
    mockStats = {
      isBlockDevice: mock(() => true),
      size: 1024 * 1024 * 1024, // 1GB
      isFile: () => false,
      isDirectory: () => false,
      isCharacterDevice: () => false,
      isFIFO: () => false,
      isSocket: () => false,
      isSymbolicLink: () => false,
      dev: 123,
      ino: 456,
      mode: 0o660,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 789,
      blksize: 4096,
      blocks: 256,
      atimeMs: Date.now(),
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
      birthtimeMs: Date.now(),
      atime: new Date(),
      mtime: new Date(),
      ctime: new Date(),
      birthtime: new Date(),
    } as Stats;
  });

  afterEach(() => {
    // Clean up any remaining mocks
    mock.restore();
  });

  describe("isBlockDevice", () => {
    it("should return true for valid block device", async () => {
      const mockFsStat = spyOn(fs, "stat").mockResolvedValue(mockStats);
      
      const result = await BlockDevice.isBlockDevice("/dev/sda1");
      
      expect(result).toBe(true);
      expect(mockFsStat).toHaveBeenCalledWith("/dev/sda1");
    });

    it("should return false for non-block device", async () => {
      const nonBlockStats = { ...mockStats, isBlockDevice: () => false };
      const mockFsStat = spyOn(fs, "stat").mockResolvedValue(nonBlockStats);
      
      const result = await BlockDevice.isBlockDevice("/tmp/regular-file");
      
      expect(result).toBe(false);
      expect(mockFsStat).toHaveBeenCalledWith("/tmp/regular-file");
    });

    it("should return false and log error when stat fails", async () => {
      const testError = new Error("Permission denied");
      const mockFsStat = spyOn(fs, "stat").mockRejectedValue(testError);
      
      const result = await BlockDevice.isBlockDevice("/nonexistent/path");
      
      expect(result).toBe(false);
      expect(mockFsStat).toHaveBeenCalledWith("/nonexistent/path");
    });

    it("should handle different path types", async () => {
      const mockFsStat = spyOn(fs, "stat").mockResolvedValue(mockStats);
      
      // Test with Buffer path
      const bufferPath = Buffer.from("/dev/sdb1");
      await BlockDevice.isBlockDevice(bufferPath);
      
      expect(mockFsStat).toHaveBeenCalledWith(bufferPath);
    });
  });

  describe("constructor", () => {
    it("should create instance with path", () => {
      const device = new BlockDevice("/dev/sda1");
      
      expect(device.path).toBe("/dev/sda1");
      expect(device.device).toBeNull();
      expect(device.stats).toBeNull();
    });

    it("should accept different path types", () => {
      const stringPath = "/dev/sda1";
      const bufferPath = Buffer.from("/dev/sdb1");
      
      const device1 = new BlockDevice(stringPath);
      const device2 = new BlockDevice(bufferPath);
      
      expect(device1.path).toBe(stringPath);
      expect(device2.path).toBe(bufferPath);
    });
  });

  describe("init", () => {
    it("should initialize successfully for valid block device", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      // Mock the static method
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      
      // Mock fs.open and file handle methods
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(mockStats);
      
      await device.init();
      
      expect(mockIsBlockDevice).toHaveBeenCalledWith("/dev/sda1");
      expect(mockFsOpen).toHaveBeenCalledWith("/dev/sda1", "r+");
      expect(device.device).toBe(mockFileHandle);
      expect(device.stats).toBe(mockStats);
    });

    it("should throw error for non-block device", async () => {
      const device = new BlockDevice("/tmp/regular-file");
      
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(false);
      
      await expect(device.init()).rejects.toThrow(
        "Path /tmp/regular-file is not a block device."
      );
      
      expect(mockIsBlockDevice).toHaveBeenCalledWith("/tmp/regular-file");
      expect(device.device).toBeNull();
      expect(device.stats).toBeNull();
    });

    it("should handle fs.open returning null/undefined", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(null as any);
      
      await device.init();
      
      expect(device.device).toBeNull();
      expect(device.stats).toBeNull();
    });

    it("should handle stat error after successful open", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      
      const statError = new Error("Stat failed");
      mockFileHandle.stat.mockRejectedValue(statError);
      
      await expect(device.init()).rejects.toThrow("Stat failed");
    });
  });

  describe("getAbsoluteSizeOfBlockDevice", () => {
    it("should return size when device is initialized", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      // Initialize the device first
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(mockStats);
      
      await device.init();
      
      const size = device.getAbsoluteSizeOfBlockDevice();
      
      expect(size).toBe(1024 * 1024 * 1024); // 1GB
    });

    it("should throw error when device not initialized", () => {
      const device = new BlockDevice("/dev/sda1");
      
      expect(() => device.getAbsoluteSizeOfBlockDevice()).toThrow(
        "Block device not initialized."
      );
    });

    it("should return null and warn when size is 0", async () => {
      const device = new BlockDevice("/dev/sda1");
      const zeroSizeStats = { ...mockStats, size: 0 };
      
      // Initialize with zero-size stats
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(zeroSizeStats);
      
      await device.init();
      
      const size = device.getAbsoluteSizeOfBlockDevice();
      
      expect(size).toBeNull();
    });

    it("should handle large device sizes", async () => {
      const device = new BlockDevice("/dev/sda1");
      const largeSizeStats = { 
        ...mockStats, 
        size: Number.MAX_SAFE_INTEGER 
      };
      
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(largeSizeStats);
      
      await device.init();
      
      const size = device.getAbsoluteSizeOfBlockDevice();
      
      expect(size).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete workflow", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      // Mock all required calls
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValue(true);
      const mockFsStat = spyOn(fs, "stat").mockResolvedValue(mockStats);
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(mockStats);
      
      // Test static method
      const isBlock = await BlockDevice.isBlockDevice("/dev/sda1");
      expect(isBlock).toBe(true);
      
      // Test initialization
      await device.init();
      expect(device.device).toBe(mockFileHandle);
      expect(device.stats).toBe(mockStats);
      
      // Test size retrieval
      const size = device.getAbsoluteSizeOfBlockDevice();
      expect(size).toBe(1024 * 1024 * 1024);
    });

    it("should handle device that becomes unavailable", async () => {
      const device = new BlockDevice("/dev/sda1");
      
      // First call succeeds, second fails
      const mockIsBlockDevice = spyOn(BlockDevice, "isBlockDevice")
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      
      const mockFsOpen = spyOn(fs, "open").mockResolvedValue(mockFileHandle);
      mockFileHandle.stat.mockResolvedValue(mockStats);
      
      // First initialization succeeds
      await device.init();
      expect(device.device).toBe(mockFileHandle);
      
      // Verify isBlockDevice behavior changed
      const stillBlock = await BlockDevice.isBlockDevice("/dev/sda1");
      expect(stillBlock).toBe(false);
    });
  });
});