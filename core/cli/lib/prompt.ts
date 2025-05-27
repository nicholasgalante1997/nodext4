import { createInterface } from 'node:readline/promises';

export async function prompt(message: string): Promise<string> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt
}