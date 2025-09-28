
import { median } from './median';

declare var Flatbush: any;

interface IsotropicFilterParams {
  x: Float64Array;
  y: Float64Array;
  values: Float64Array;
  variationPercent: number; // Percentage (e.g., 10 for 10%)
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
  variationPercent,
  radius,
  minNeighbours,
}: IsotropicFilterParams): boolean[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }

  // Convert percentage to decimal coefficient
  const variation = variationPercent / 100;

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
