export default class TextGradient {
    palette;
    text;
  constructor() {
    this.palette = [
      { name: 'amber', hex: '#ffbe0b', rgb: [255, 190, 11] },
      { name: 'orange-pantone', hex: '#fb5607', rgb: [251, 86, 7] },
      { name: 'rose', hex: '#ff006e', rgb: [255, 0, 110] },
      { name: 'blue-violet', hex: '#8338ec', rgb: [131, 56, 236] },
      { name: 'azure', hex: '#3a86ff', rgb: [58, 134, 255] }
    ];
    
    this.text = "Nodext4 - A Linux ext4 Filesystem Implementation in Bun";
  }

  // Linear interpolation between two RGB colors
  lerp(start, end, factor) {
    return start.map((startVal, i) => 
      Math.round(startVal + factor * (end[i] - startVal))
    );
  }

  // Convert RGB to ANSI escape sequence
  rgbToAnsi(rgb) {
    return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  }

  // Generate gradient for terminal output
  generateTerminalGradient() {
    const chars = this.text.split('');
    const totalChars = chars.length;
    const totalColors = this.palette.length;
    let result = '';
    
    chars.forEach((char, index) => {
      // Calculate position in gradient (0 to 1)
      const position = index / (totalChars - 1);
      
      // Find which color segment we're in
      const segmentSize = 1 / (totalColors - 1);
      const segment = Math.min(Math.floor(position / segmentSize), totalColors - 2);
      const localPosition = (position - segment * segmentSize) / segmentSize;
      
      // Interpolate between current and next color
      const currentColor = this.palette[segment].rgb;
      const nextColor = this.palette[segment + 1].rgb;
      const interpolatedColor = this.lerp(currentColor, nextColor, localPosition);
      
      // Add colored character to result
      result += this.rgbToAnsi(interpolatedColor) + char;
    });
    
    return result + '\x1b[0m'; // Reset color at end
  }

  // Generate character-by-character breakdown
  generateCharacterBreakdown() {
    const chars = this.text.split('');
    const totalChars = chars.length;
    const totalColors = this.palette.length;
    const breakdown = [];
    
    chars.forEach((char, index) => {
      const position = index / (totalChars - 1);
      const segmentSize = 1 / (totalColors - 1);
      const segment = Math.min(Math.floor(position / segmentSize), totalColors - 2);
      const localPosition = (position - segment * segmentSize) / segmentSize;
      
      const currentColor = this.palette[segment].rgb;
      const nextColor = this.palette[segment + 1].rgb;
      const interpolatedColor = this.lerp(currentColor, nextColor, localPosition);
      const hex = `#${interpolatedColor.map(c => c.toString(16).padStart(2, '0')).join('')}`;
      
      breakdown.push({
        char,
        index,
        position: Math.round(position * 100) / 100,
        hex,
        rgb: interpolatedColor,
        ansi: this.rgbToAnsi(interpolatedColor)
      });
    });
    
    return breakdown;
  }

  // Get just the terminal gradient string
  getTerminalGradientText() {
    return this.generateTerminalGradient();
  }

}
