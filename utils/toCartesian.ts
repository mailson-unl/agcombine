
const EARTH_RADIUS = 6371000; // in meters

/**
 * Converts latitude and longitude arrays to Cartesian coordinates (x, y) in meters
 * using an equirectangular projection. This is suitable for small areas.
 * @param lat - Array of latitudes in degrees.
 * @param lon - Array of longitudes in degrees.
 * @returns An object containing x and y coordinates as Float64Arrays.
 */
export function toCartesian(
  lat: number[],
  lon: number[]
): { x: Float64Array; y: Float64Array } {
  if (lat.length !== lon.length) {
    throw new Error('Latitude and longitude arrays must have the same length.');
  }

  const n = lat.length;
  if (n === 0) {
    return { x: new Float64Array(), y: new Float64Array() };
  }

  const x = new Float64Array(n);
  const y = new Float64Array(n);

  // Calculate mean latitude for the projection
  const meanLat = lat.reduce((sum, val) => sum + val, 0) / n;
  const cosMeanLat = Math.cos(meanLat * (Math.PI / 180));

  for (let i = 0; i < n; i++) {
    const latRad = lat[i] * (Math.PI / 180);
    const lonRad = lon[i] * (Math.PI / 180);

    x[i] = EARTH_RADIUS * lonRad * cosMeanLat;
    y[i] = EARTH_RADIUS * latRad;
  }

  return { x, y };
}
