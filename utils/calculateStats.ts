export interface StatValues {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  cv: number;
  count: number;
}

export function calculateStats(values: number[] | Float64Array): StatValues {
  const n = values.length;
  if (n === 0) {
    return { min: 0, max: 0, mean: 0, stdDev: 0, cv: 0, count: 0 };
  }

  let sum = 0;
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < n; i++) {
    const value = values[i];
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const mean = sum / n;

  let sumOfSquares = 0;
  for (let i = 0; i < n; i++) {
    sumOfSquares += Math.pow(values[i] - mean, 2);
  }

  // Sample standard deviation
  const stdDev = n > 1 ? Math.sqrt(sumOfSquares / (n - 1)) : 0;
  const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

  return {
    min,
    max,
    mean,
    stdDev,
    cv,
    count: n,
  };
}
