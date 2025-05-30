/**
 * Terminal Plasma Morphing Splash Animation
 * Minimalistic shapes morphing through plasma states with nodext4 branding
 */

export default class PlasmaSplashAnimation {
  private frames: string[];
  private currentFrame: number;
  private isRunning: boolean;
  private intervalId: NodeJS.Timeout | null;
  private colors: { [key: string]: string };
  constructor() {
    this.frames = [];
    this.currentFrame = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      gray: '\x1b[90m',
      brightRed: '\x1b[91m',
      brightGreen: '\x1b[92m',
      brightYellow: '\x1b[93m',
      brightBlue: '\x1b[94m',
      brightMagenta: '\x1b[95m',
      brightCyan: '\x1b[96m'
    };

    this.initFrames();
  }

  initFrames() {
    const {
      reset,
      bright,
      dim,
      red,
      green,
      yellow,
      blue,
      magenta,
      cyan,
      white,
      gray,
      brightRed,
      brightGreen,
      brightYellow,
      brightBlue,
      brightMagenta,
      brightCyan
    } = this.colors;

    // Frame 1: Circle formation
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

              ${brightBlue}●${reset}
           ${blue}●${reset}     ${brightBlue}●${reset}
        ${blue}●${reset}           ${brightBlue}●${reset}
       ${cyan}●${reset}             ${brightCyan}●${reset}
        ${blue}●${reset}           ${brightBlue}●${reset}
           ${blue}●${reset}     ${brightBlue}●${reset}
              ${brightBlue}●${reset}

        ${dim}${gray}morphing...${reset}
`);

    // Frame 2: Circle expanding
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

            ${brightCyan}◉${reset}
        ${cyan}◉${reset}       ${brightCyan}◉${reset}
      ${blue}◉${reset}           ${brightBlue}◉${reset}
    ${magenta}◉${reset}               ${brightMagenta}◉${reset}
      ${blue}◉${reset}           ${brightBlue}◉${reset}
        ${cyan}◉${reset}       ${brightCyan}◉${reset}
            ${brightCyan}◉${reset}

        ${dim}${yellow}expanding...${reset}
`);

    // Frame 3: Plasma state
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

          ${brightRed}▓${brightYellow}▒${brightGreen}░${brightCyan}▓${reset}
      ${brightMagenta}▓${brightRed}▒${reset}   ${brightYellow}░${brightBlue}▓${brightCyan}▒${reset}   ${brightGreen}░${brightMagenta}▓${reset}
    ${brightBlue}▒${brightCyan}░${reset}     ${brightRed}▓${brightYellow}▒${brightGreen}░${reset}     ${brightBlue}▓${brightMagenta}▒${reset}
  ${brightYellow}░${brightGreen}▓${reset}       ${brightCyan}▒${brightRed}░${brightYellow}▓${reset}       ${brightBlue}▒${brightCyan}░${reset}
    ${brightMagenta}▓${brightRed}▒${reset}     ${brightGreen}░${brightBlue}▓${brightMagenta}▒${reset}     ${brightYellow}▓${brightCyan}░${reset}
      ${brightCyan}░${brightBlue}▓${reset}   ${brightRed}▒${brightYellow}░${brightGreen}▓${reset}   ${brightMagenta}▒${brightBlue}░${reset}
          ${brightYellow}▓${brightGreen}░${brightCyan}▒${brightRed}▓${reset}

        ${bright}${brightRed}plasma!${reset}
`);

    // Frame 4: Plasma swirling
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

          ${brightYellow}▒${brightCyan}▓${brightRed}░${brightGreen}▒${reset}
      ${brightBlue}░${brightMagenta}▓${reset}   ${brightRed}▒${brightYellow}░${brightCyan}▓${reset}   ${brightGreen}▒${brightBlue}░${reset}
    ${brightCyan}▓${brightRed}▒${reset}     ${brightGreen}░${brightMagenta}▓${brightBlue}▒${reset}     ${brightYellow}░${brightCyan}▓${reset}
  ${brightGreen}▒${brightYellow}░${reset}       ${brightBlue}▓${brightCyan}▒${brightRed}░${reset}       ${brightMagenta}▓${brightGreen}▒${reset}
    ${brightRed}░${brightBlue}▓${reset}     ${brightCyan}▒${brightYellow}░${brightGreen}▓${reset}     ${brightMagenta}▒${brightRed}░${reset}
      ${brightMagenta}▓${brightCyan}▒${reset}   ${brightGreen}░${brightBlue}▓${brightYellow}▒${reset}   ${brightRed}▓${brightCyan}░${reset}
          ${brightBlue}░${brightGreen}▓${brightMagenta}▒${brightYellow}░${reset}

        ${bright}${brightMagenta}swirling...${reset}
`);

    // Frame 5: Triangle formation
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

            ${brightYellow}▲${reset}
           ${yellow}▲${reset} ${brightYellow}▲${reset}
          ${brightGreen}▲${reset}   ${brightYellow}▲${reset}
         ${green}▲${reset}     ${brightGreen}▲${reset}
        ${brightCyan}▲${reset}       ${brightGreen}▲${reset}
       ${cyan}▲${reset}         ${brightCyan}▲${reset}
      ${brightBlue}▲${brightMagenta}▲${brightRed}▲${brightYellow}▲${brightGreen}▲${brightCyan}▲${brightBlue}▲${brightMagenta}▲${brightRed}▲${reset}

        ${dim}${green}triangle${reset}
`);

    // Frame 6: Diamond formation
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

            ${brightRed}◆${reset}
          ${red}◆${reset}   ${brightRed}◆${reset}
        ${brightYellow}◆${reset}       ${brightRed}◆${reset}
      ${yellow}◆${reset}           ${brightYellow}◆${reset}
        ${brightGreen}◆${reset}       ${brightYellow}◆${reset}
          ${green}◆${reset}   ${brightGreen}◆${reset}
            ${brightCyan}◆${reset}

        ${dim}${brightRed}diamond${reset}
`);

    // Frame 7: Square formation
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

      ${brightMagenta}■${brightRed}■${brightYellow}■${brightGreen}■${brightCyan}■${brightBlue}■${brightMagenta}■${reset}
      ${brightRed}■${reset}                 ${brightMagenta}■${reset}
      ${brightYellow}■${reset}                 ${brightRed}■${reset}
      ${brightGreen}■${reset}                 ${brightYellow}■${reset}
      ${brightCyan}■${reset}                 ${brightGreen}■${reset}
      ${brightBlue}■${reset}                 ${brightCyan}■${reset}
      ${brightMagenta}■${brightBlue}■${brightCyan}■${brightGreen}■${brightYellow}■${brightRed}■${brightMagenta}■${reset}

        ${dim}${brightBlue}square${reset}
`);

    // Frame 8: Hexagon formation
    this.frames.push(`
${brightCyan}${bright}    ╔═══════════════════════════╗${reset}
${brightCyan}${bright}    ║${reset}      ${brightMagenta}N O D E X T 4${reset}       ${brightCyan}${bright}║${reset}
${brightCyan}${bright}    ╚═══════════════════════════╝${reset}

          ${brightCyan}⬢${brightBlue}⬢${brightMagenta}⬢${reset}
        ${brightGreen}⬢${reset}         ${brightRed}⬢${reset}
      ${brightYellow}⬢${reset}             ${brightCyan}⬢${reset}
      ${brightRed}⬢${reset}             ${brightGreen}⬢${reset}
        ${brightMagenta}⬢${reset}         ${brightYellow}⬢${reset}
          ${brightBlue}⬢${brightCyan}⬢${brightRed}⬢${reset}

        ${dim}${brightCyan}hexagon${reset}
`);

    // Frame 9: Final brand showcase
    this.frames.push(`
${brightMagenta}${bright}    ╔═══════════════════════════╗${reset}
${brightMagenta}${bright}    ║${reset}      ${brightCyan}N O D E X T 4${reset}       ${brightMagenta}${bright}║${reset}
${brightMagenta}${bright}    ║${reset}   ${dim}fast • modern • elegant${reset}  ${brightMagenta}${bright}║${reset}
${brightMagenta}${bright}    ╚═══════════════════════════╝${reset}

         ${brightRed}◉${reset} ${brightYellow}▲${reset} ${brightGreen}◆${reset} ${brightBlue}■${reset} ${brightMagenta}⬢${reset}
       ${brightCyan}◉${reset}   ${brightRed}▲${reset}   ${brightYellow}◆${reset}   ${brightGreen}■${reset}   ${brightBlue}⬢${reset}
     ${brightYellow}◉${reset}     ${brightCyan}▲${reset}     ${brightRed}◆${reset}     ${brightMagenta}■${reset}
       ${brightGreen}◉${reset}   ${brightBlue}▲${reset}   ${brightCyan}◆${reset}   ${brightYellow}■${reset}   ${brightRed}⬢${reset}
         ${brightBlue}◉${reset} ${brightMagenta}▲${reset} ${brightCyan}◆${reset} ${brightRed}■${reset} ${brightYellow}⬢${reset}

        ${bright}${brightGreen}ready to build!${reset}
`);
  }

  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[H');
  }

  showFrame() {
    this.clearScreen();
    console.log(this.frames[this.currentFrame]);
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
  }

  start(duration = null) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.showFrame(); // Show first frame immediately

    this.intervalId = setInterval(() => {
      this.showFrame();
    }, 400); // Show each frame for 0.4 seconds (~3.6s total cycle)

    // Auto-stop after duration if specified
    if (duration) {
      setTimeout(() => {
        this.stop();
      }, duration);
    }

    return this;
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Show a clean final frame
    this.clearScreen();
    console.log(`
${this.colors.brightCyan}${this.colors.bright}    ╔═══════════════════════════╗${this.colors.reset}
${this.colors.brightCyan}${this.colors.bright}    ║${this.colors.reset}      ${this.colors.brightMagenta}N O D E X T 4${this.colors.reset}       ${this.colors.brightCyan}${this.colors.bright}║${this.colors.reset}
${this.colors.brightCyan}${this.colors.bright}    ║${this.colors.reset}     ${this.colors.brightGreen}ready to code!${this.colors.reset}     ${this.colors.brightCyan}${this.colors.bright}║${this.colors.reset}
${this.colors.brightCyan}${this.colors.bright}    ╚═══════════════════════════╝${this.colors.reset}
`);

    return this;
  }

  // Utility method to show a single quick splash
  static quickSplash(duration = 3000) {
    const splash = new PlasmaSplashAnimation();
    splash.start(duration);
    return splash;
  }
}
