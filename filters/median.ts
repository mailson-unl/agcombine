
/**
 * Calculates the median of an array of numbers.
 * @param values - An array of numbers.
 * @returns The median value.
 */
export function median(values: number[] | Float64Array): number {
  if (values.length === 0) {
    return 0;
  }

  // Create a copy to avoid modifying the original array
  const sorted = Array.from(values).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    // Even number of elements
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    // Odd number of elements
    return sorted[mid];
  }
}
