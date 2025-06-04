import chalk from 'chalk';
import { args } from '../lib/args';
import { TextGradient } from '../lib/gui';
import { prompt } from '../lib/prompt';
import { handleInput } from '../lib/input';

const helpMessage = `
  ${chalk.bold(chalk.cyan('What is this?'))}

  ${chalk.italic('This is an attempt to implement, in parts, the linux virtual file system in Bun.js.')}

  ${chalk.bold(chalk.cyan('What can I do with this?'))}

  ${chalk.italic(`You can
    
    - Mount and unmount filesystems
    - Read and Write Files
    - Copy files between other mounted filesystems
    - Probably more!
  `)}

    ${chalk.italic(chalk.underline('for help, type .help'))}

`;

async function loop() {
  while (true) {
    const input = await prompt(chalk.bold(chalk.blueBright('✨ (nodext4)> ')));
    const result = handleInput(input);
    if (result.shouldEnd) {
      /**
       * Close processes
       */
      console.log(chalk.bold(chalk.red('Exiting...')));

      await new Promise<void>((resolve, _reject) => {
        setTimeout(() => {
          console.clear();
          resolve();
        }, 1400);
      }).then(() => process.exit(0));
    }
  }
}

async function runSplash() {
  console.log(chalk.bold(new TextGradient().getTerminalGradientText()));
  console.log(helpMessage);
  await prompt(chalk.gray(chalk.bold('[Press Enter to Continue]')), { allowEmpty: true });
  console.clear();
}

function shouldRunSplash() {
  let $args = args();
  return !($args.includes('--no-splash') || $args.includes('-q'))
}

async function main() {
  console.clear();
  if (shouldRunSplash()) {
    await runSplash();
  }
  await loop();
}

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

main();
