import { createInterface } from 'node:readline/promises';
import chalk from 'chalk';

export interface PromptOptions {
  allowEmpty?: boolean;
}

export async function prompt(message: string, options: PromptOptions = {}): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line: string) => {
      const completions = '.help .quit .q'.split(' ');
      const hits = completions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : completions, line] as [string[], string];
    }
  });

  const response = await rl.question(chalk.blue(message));

  if (response.trim() === '' && !options.allowEmpty) {
    console.log(chalk.red('Input cannot be empty. Please try again.'));
    return prompt(message);
  }

  rl.close();

  return response;
}
