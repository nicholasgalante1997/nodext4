import { spawn } from 'child_process';

export function cmd(command, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, {
      ...options,
      shell: true
    });

    let stdout = '';
    let stderr = '';
    let code = 0;

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (error) => {
      reject(error);
    });

    proc.on('close', (exitCode) => {
      code = exitCode;
      resolve({ stdout, stderr, code });
    });
  });
}
