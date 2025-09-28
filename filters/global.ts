
import { median } from './median';

/**
 * Applies a global filter to an array of values based on the median.
 * @param values - The array of numbers to filter.
 * @param variationPercent - The variation percentage (e.g., 10 for 10%).
 * @returns A boolean array (keep-mask) where `true` indicates the value should be kept.
 */
export function globalFilter(values: Float64Array, variationPercent: number): boolean[] {
  if (values.length === 0) {
    return [];
  }
  
  // Convert percentage to decimal coefficient
  const v = variationPercent / 100;
  
  const mk = median(values);
  const limitSuperior = mk + mk * v;
  const limitInferior = mk - mk * v;

  const keepMask = new Array(values.length).fill(false);
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value >= limitInferior && value <= limitSuperior) {
      keepMask[i] = true;
    }
  }

  return keepMask;
}
