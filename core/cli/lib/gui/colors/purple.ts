/**
 * Purple Color Palette - Hex Codes
 * Various purple shades that work well in terminals and applications
 */

const purpleColors = {
  // Basic ANSI equivalent colors
  magenta: '#FF00FF', // Standard magenta
  brightMagenta: '#FF55FF', // Bright magenta

  // 256-color palette purples
  deepPurple: '#5F005F', // Deep purple - rich and dark
  royalPurple: '#5F0087', // Royal purple - classic tone
  mediumPurple: '#875FD7', // Medium purple - balanced
  lightPurple: '#AF87FF', // Light purple - softer tone
  lavender: '#D7AFD7', // Lavender - gentle and soft
  plum: '#875F87', // Plum - earthy purple
  violet: '#8700D7', // Violet - classic violet
  orchid: '#D75FD7', // Orchid - bright and vibrant
  amethyst: '#875FAF', // Amethyst - gem-like
  grape: '#5F005F', // Grape - dark wine purple

  // True color RGB purples
  neonPurple: '#8A2BE2', // Electric neon purple
  pastelPurple: '#B39EB5', // Soft pastel purple
  hotPurple: '#FF00FF', // Hot magenta/purple
  darkViolet: '#9400D3', // Deep dark violet
  blueViolet: '#8A2BE2', // Blue-tinted violet

  // Additional popular purples
  indigo: '#4B0082', // Deep indigo
  rebecca: '#663399', // Rebecca purple (CSS)
  purple: '#800080', // Web standard purple
  mediumOrchid: '#BA55D3', // Medium orchid
  darkOrchid: '#9932CC', // Dark orchid
  slateBlue: '#6A5ACD', // Slate blue purple
  mediumSlateBlue: '#7B68EE', // Medium slate blue
  thistle: '#D8BFD8', // Light thistle
  wisteria: '#C9A0DC', // Wisteria purple
  byzantium: '#702963' // Byzantium purple
};

// Organized by intensity/darkness
const purplesByIntensity = {
  veryDark: [
    { name: 'indigo', hex: '#4B0082' },
    { name: 'deepPurple', hex: '#5F005F' },
    { name: 'byzantium', hex: '#702963' }
  ],

  dark: [
    { name: 'purple', hex: '#800080' },
    { name: 'plum', hex: '#875F87' },
    { name: 'amethyst', hex: '#875FAF' },
    { name: 'darkViolet', hex: '#9400D3' },
    { name: 'darkOrchid', hex: '#9932CC' }
  ],

  medium: [
    { name: 'rebecca', hex: '#663399' },
    { name: 'royalPurple', hex: '#5F0087' },
    { name: 'violet', hex: '#8700D7' },
    { name: 'neonPurple', hex: '#8A2BE2' },
    { name: 'slateBlue', hex: '#6A5ACD' }
  ],

  bright: [
    { name: 'mediumPurple', hex: '#875FD7' },
    { name: 'mediumSlateBlue', hex: '#7B68EE' },
    { name: 'lightPurple', hex: '#AF87FF' },
    { name: 'mediumOrchid', hex: '#BA55D3' },
    { name: 'orchid', hex: '#D75FD7' }
  ],

  light: [
    { name: 'wisteria', hex: '#C9A0DC' },
    { name: 'lavender', hex: '#D7AFD7' },
    { name: 'thistle', hex: '#D8BFD8' },
    { name: 'pastelPurple', hex: '#B39EB5' }
  ],

  vivid: [
    { name: 'magenta', hex: '#FF00FF' },
    { name: 'brightMagenta', hex: '#FF55FF' },
    { name: 'hotPurple', hex: '#FF00FF' }
  ]
};

// Best combinations for terminal UIs
const terminalRecommended = {
  // High contrast pairs
  darkBackground: [
    { name: 'neonPurple', hex: '#8A2BE2', usage: 'primary accent' },
    { name: 'lightPurple', hex: '#AF87FF', usage: 'secondary text' },
    { name: 'orchid', hex: '#D75FD7', usage: 'highlights' }
  ],

  lightBackground: [
    { name: 'deepPurple', hex: '#5F005F', usage: 'primary text' },
    { name: 'royalPurple', hex: '#5F0087', usage: 'accent' },
    { name: 'byzantium', hex: '#702963', usage: 'subtle emphasis' }
  ],

  // Single color schemes (monochromatic)
  professional: [
    { name: 'rebecca', hex: '#663399', usage: 'professional, modern' },
    { name: 'slateBlue', hex: '#6A5ACD', usage: 'balanced, readable' },
    { name: 'mediumPurple', hex: '#875FD7', usage: 'vibrant but not harsh' }
  ]
};
export { purpleColors, purplesByIntensity, terminalRecommended as purpleTerminalRecommended };
