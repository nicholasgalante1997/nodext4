import chalk from 'chalk';
import { TextGradient } from '../lib/gui';
import { prompt } from '../lib/prompt';
import { handleInput } from '../lib/input';

const helpMessage = `

    Nodext4 is an ext4 compliant filesystem for linux based machines and arbitrary block devices.
    You can do things with it that you can normally do with filesystems, such as create them, mount them to block devices, add files, create directories, the whole shablagoo.
    If you're wondering why someone would do this, so am I.

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
      setTimeout(() => {
        console.clear();
        process.exit(0);
      }, 1400);
    }
  }
}

async function main() {
  console.clear();

  console.log(chalk.bold(new TextGradient().getTerminalGradientText()));

  console.log(helpMessage);

  await prompt(chalk.gray(chalk.bold('[Press Enter to Continue]')), { allowEmpty: true });

  console.clear();

  await loop();
}

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

main();
