import { describe, expect, test } from 'bun:test';
import Bitmap from '../lib';

describe('Bitmap', () => {
    test('should create a bitmap of the specified size', () => {
        const bitmap = new Bitmap(16);
        expect(bitmap.size).toBe(16);
        expect(bitmap.data.length).toBe(2);
    });

    test('should set a bit at the specified index', () => {
        const bitmap = new Bitmap(16);
        bitmap.setBit(3);
        expect(bitmap.getBit(3)).toBe(true);
        expect(bitmap.data[0]).toBe(8); // 00001000 in binary
    });

    test('should throw an error when setting a bit out of bounds', () => {
        const bitmap = new Bitmap(16);
        expect(() => bitmap.setBit(20)).toThrow('Out of Bounds Error');
    });

    test('should get a bit at the specified index', () => {
        const bitmap = new Bitmap(16);
        bitmap.setBit(5);
        expect(bitmap.getBit(5)).toBe(true);
        expect(bitmap.getBit(3)).toBe(false);
    });

    test('should throw an error when getting a bit out of bounds', () => {
        const bitmap = new Bitmap(16);
        expect(() => bitmap.getBit(20)).toThrow('Out of Bounds Error');
    });

    test('should toggle a bit at the specified index', () => {
        const bitmap = new Bitmap(16);
        bitmap.setBit(7);
        expect(bitmap.getBit(7)).toBe(true);
        bitmap.toggle(7);
        expect(bitmap.getBit(7)).toBe(false);
        bitmap.toggle(7);
        expect(bitmap.getBit(7)).toBe(true);
    });

    test('should throw an error when toggling a bit out of bounds', () => {
        const bitmap = new Bitmap(16);
        expect(() => bitmap.toggle(20)).toThrow('Out of Bounds Error');
    });
});