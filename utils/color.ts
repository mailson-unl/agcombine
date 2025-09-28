/**
 * Simple linear interpolation for a single channel (e.g., red, green, or blue).
 * @param start - Start value (0-255).
 * @param end - End value (0-255).
 * @param t - Interpolation factor (0-1).
 * @returns The interpolated value.
 */
function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Converts a hex color string to an [r, g, b] array.
 * @param hex - The hex color string (e.g., '#ff0000').
 * @returns An array of [r, g, b] values.
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Converts an [r, g, b] array to a hex color string.
 * @param rgb - An array of [r, g, b] values.
 * @returns The hex color string.
 */
function rgbToHex(rgb: [number, number, number]): string {
  return (
    '#' +
    rgb.map(c => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

/**
 * Gets a color from a gradient based on a value's position within a range.
 * @param value - The current value.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @param colorStops - An array of hex color strings representing the gradient.
 * @returns A hex color string for the given value.
 */
export function getColorFromRamp(
  value: number,
  min: number,
  max: number,
  colorStops: string[]
): string {
  if (min >= max || value <= min) {
    return colorStops[0];
  }
  if (value >= max) {
    return colorStops[colorStops.length - 1];
  }

  const t = (value - min) / (max - min); // Normalize value to 0-1
  const stopIndex = Math.floor(t * (colorStops.length - 1));
  
  // Ensure we don't go out of bounds
  const safeStopIndex = Math.min(stopIndex, colorStops.length - 2);

  const startColor = hexToRgb(colorStops[safeStopIndex]);
  const endColor = hexToRgb(colorStops[safeStopIndex + 1]);
  
  const segmentT = (t - (safeStopIndex / (colorStops.length - 1))) * (colorStops.length - 1);

  const interpolatedRgb: [number, number, number] = [
    lerp(startColor[0], endColor[0], segmentT),
    lerp(startColor[1], endColor[1], segmentT),
    lerp(startColor[2], endColor[2], segmentT),
  ];

  return rgbToHex(interpolatedRgb);
}
