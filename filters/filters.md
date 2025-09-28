import { median } from './median';

interface AnisotropicFilterParams {
  x: Float64Array;
  y: Float64Array;
  values: Float64Array;
  variation: number;
  radius: number;
  minNeighbours: number;
}

/**
 * Applies an anisotropic local filter by scanning backward and forward along the data path.
 * @returns A boolean array (keep-mask).
 */
export function anisotropicFilter({
  x,
  y,
  values,
  variation,
  radius,
  minNeighbours,
}: AnisotropicFilterParams): boolean[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }

  const keepMask = new Array(n).fill(false);
  const radiusSq = radius * radius;

  for (let i = 0; i < n; i++) {
    const localNeighborsValues: number[] = [];

    // Scan backwards
    for (let j = i - 1; j >= 0; j--) {
      const dx = x[i] - x[j];
      const dy = y[i] - y[j];
      const distSq = dx * dx + dy * dy;
      if (distSq > radiusSq) break;
      localNeighborsValues.push(values[j]);
    }

    // Scan forwards
    for (let j = i + 1; j < n; j++) {
      const dx = x[i] - x[j];
      const dy = y[i] - y[j];
      const distSq = dx * dx + dy * dy;
      if (distSq > radiusSq) break;
      localNeighborsValues.push(values[j]);
    }

    if (localNeighborsValues.length < minNeighbours) {
      keepMask[i] = true; // Keep point if it has too few neighbours
      continue;
    }
    
    const localMedian = median(localNeighborsValues);
    const limitSuperior = localMedian + localMedian * variation;
    const limitInferior = localMedian - localMedian * variation;

    if (values[i] >= limitInferior && values[i] <= limitSuperior) {
      keepMask[i] = true;
    }
  }

  return keepMask;
}

import { median } from './median';

declare var Flatbush: any;

interface IsotropicFilterParams {
  x: Float64Array;
  y: Float64Array;
  values: Float64Array;
  variation: number;
  radius: number;
  minNeighbours: number;
}

/**
 * Applies an isotropic local filter using a spatial index (Flatbush).
 * @returns A boolean array (keep-mask).
 */
export function isotropicFilter({
  x,
  y,
  values,
  variation,
  radius,
  minNeighbours,
}: IsotropicFilterParams): boolean[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }

  const index = new Flatbush(n);
  for (let i = 0; i < n; i++) {
    index.add(x[i], y[i], x[i], y[i]);
  }
  index.finish();

  const keepMask = new Array(n).fill(false);
  const radiusSq = radius * radius;

  for (let i = 0; i < n; i++) {
    const neighborIndices = index.search(
      x[i] - radius,
      y[i] - radius,
      x[i] + radius,
      y[i] + radius
    );

    const localNeighborsValues: number[] = [];
    for (const j of neighborIndices) {
      if (i === j) continue; // Exclude self

      const dx = x[i] - x[j];
      const dy = y[i] - y[j];
      const distSq = dx * dx + dy * dy;

      if (distSq <= radiusSq) {
        localNeighborsValues.push(values[j]);
      }
    }
    
    if (localNeighborsValues.length < minNeighbours) {
      keepMask[i] = true; // Keep point if it has too few neighbours to evaluate
      continue;
    }

    const localMedian = median(localNeighborsValues);
    const limitSuperior = localMedian + localMedian * variation;
    const limitInferior = localMedian - localMedian * variation;

    if (values[i] >= limitInferior && values[i] <= limitSuperior) {
      keepMask[i] = true;
    }
  }

  return keepMask;
}

import { median } from './median';

/**
 * Applies a global filter to an array of values based on the median.
 * @param values - The array of numbers to filter.
 * @param v - The variation coefficient (e.g., 0.1 for 10%).
 * @returns A boolean array (keep-mask) where `true` indicates the value should be kept.
 */
export function globalFilter(values: Float64Array, v: number): boolean[] {
  if (values.length === 0) {
    return [];
  }
  
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
