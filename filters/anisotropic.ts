
import { median } from './median';

declare var Flatbush: any;

interface AnisotropicFilterParams {
  x: Float64Array;
  y: Float64Array;
  values: Float64Array;
  variationPercent: number; // Percentage (e.g., 10 for 10%)
  radius: number;
  minNeighbours: number;
  wedgeAngle?: number; // Optional wedge angle in degrees (default: 45°)
}

/**
 * Applies an anisotropic local filter using directional wedges.
 * For each point, finds the dominant local direction and only considers
 * neighbors within a wedge around that direction (±wedgeAngle).
 * This approach is order-independent and based on true spatial geometry.
 * @returns A boolean array (keep-mask).
 */
export function anisotropicFilter({
  x,
  y,
  values,
  variationPercent,
  radius,
  minNeighbours,
  wedgeAngle = 45, // Increased to 45° wedge for agricultural data (±45° = 90° total)
}: AnisotropicFilterParams): boolean[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }

  // Convert percentage to decimal coefficient
  const variation = variationPercent / 100;

  // Build spatial index for efficient neighbor search
  const index = new Flatbush(n);
  for (let i = 0; i < n; i++) {
    index.add(x[i], y[i], x[i], y[i]);
  }
  index.finish();

  const keepMask = new Array(n).fill(false);
  const radiusSq = radius * radius;
  const wedgeRadians = (wedgeAngle * Math.PI) / 180; // Convert to radians

  for (let i = 0; i < n; i++) {
    // Get all spatial neighbors within radius
    const candidateIndices = index.search(
      x[i] - radius,
      y[i] - radius,
      x[i] + radius,
      y[i] + radius
    );

    // Filter by actual distance and collect neighbor info
    const spatialNeighbors: Array<{
      idx: number;
      dx: number;
      dy: number;
      angle: number;
      value: number;
    }> = [];

    for (const j of candidateIndices) {
      if (i === j) continue; // Exclude self

      const dx = x[j] - x[i];
      const dy = y[j] - y[i];
      const distSq = dx * dx + dy * dy;

      if (distSq <= radiusSq) {
        spatialNeighbors.push({
          idx: j,
          dx,
          dy,
          angle: Math.atan2(dy, dx),
          value: values[j],
        });
      }
    }

    // More lenient neighbor requirement for agricultural data
    if (spatialNeighbors.length < Math.min(minNeighbours, 2)) {
      keepMask[i] = true; // Keep point if too few neighbors to evaluate
      continue;
    }

    // Find dominant direction (direction with most neighbors)
    const dominantDirection = findDominantDirection(spatialNeighbors);

    // Filter neighbors to only those within the directional wedge
    const wedgeNeighbors = spatialNeighbors.filter((neighbor) => {
      const angleDiff = Math.abs(angleDifference(neighbor.angle, dominantDirection));
      const oppositeAngleDiff = Math.abs(angleDifference(neighbor.angle, dominantDirection + Math.PI));
      
      // Accept if within wedge of dominant direction OR its opposite (bidirectional)
      return angleDiff <= wedgeRadians || oppositeAngleDiff <= wedgeRadians;
    });

    // Use more flexible neighbor count - if we have some directional neighbors or fall back to all neighbors
    let neighborsToUse = wedgeNeighbors;
    if (wedgeNeighbors.length < Math.min(minNeighbours, 2)) {
      // Fall back to using all spatial neighbors if directional filtering is too restrictive
      neighborsToUse = spatialNeighbors;
    }

    if (neighborsToUse.length === 0) {
      keepMask[i] = true; // Keep point if no neighbors available
      continue;
    }

    // Apply median-based filtering using selected neighbors
    const localNeighborsValues = neighborsToUse.map((n) => n.value);
    const localMedian = median(localNeighborsValues);
    
    // Use absolute variation limits to handle low-value scenarios better
    const absoluteVariation = Math.max(localMedian * variation, localMedian * 0.01); // At least 1% variation
    const limitSuperior = localMedian + absoluteVariation;
    const limitInferior = localMedian - absoluteVariation;

    if (values[i] >= limitInferior && values[i] <= limitSuperior) {
      keepMask[i] = true;
    }
  }

  return keepMask;
}

/**
 * Finds the dominant direction by analyzing neighbor distribution
 * Uses histogram binning optimized for agricultural field patterns
 */
function findDominantDirection(neighbors: Array<{ angle: number }>): number {
  if (neighbors.length === 0) return 0;
  if (neighbors.length === 1) return neighbors[0].angle;

  // Create histogram of directions (12 bins = 30° each for agricultural patterns)
  const numBins = 12;
  const binSize = (2 * Math.PI) / numBins;
  const bins = new Array(numBins).fill(0);

  // Count neighbors in each directional bin with smoothing
  for (const neighbor of neighbors) {
    let normalizedAngle = neighbor.angle;
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
    
    const binIndex = Math.floor(normalizedAngle / binSize) % numBins;
    bins[binIndex]++;
    
    // Add smoothing to adjacent bins for more robust direction finding
    const leftBin = (binIndex - 1 + numBins) % numBins;
    const rightBin = (binIndex + 1) % numBins;
    bins[leftBin] += 0.3;
    bins[rightBin] += 0.3;
  }

  // Find bin with maximum count
  let maxCount = 0;
  let dominantBin = 0;
  for (let i = 0; i < numBins; i++) {
    if (bins[i] > maxCount) {
      maxCount = bins[i];
      dominantBin = i;
    }
  }

  // Return center angle of dominant bin
  return (dominantBin + 0.5) * binSize;
}

/**
 * Calculates the absolute difference between two angles, handling wraparound
 */
function angleDifference(angle1: number, angle2: number): number {
  let diff = angle1 - angle2;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return diff;
}
