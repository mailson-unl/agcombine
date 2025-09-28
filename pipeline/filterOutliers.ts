
import type { FilterParams, RowData } from '../types';
import { globalFilter } from '../filters/global';
import { isotropicFilter } from '../filters/isotropic';
import { anisotropicFilter } from '../filters/anisotropic';

interface PipelineInput {
  data: RowData[];
  x: Float64Array;
  y: Float64Array;
  values: Float64Array;
}

/**
 * Orchestrates the outlier filtering pipeline.
 * Runs global filter, then the selected local filter.
 * @param input - The data and coordinates.
 * @param params - The filtering parameters.
 * @returns An array of the rows that were kept.
 */
export function filterOutliers(
  input: PipelineInput,
  params: FilterParams
): RowData[] {
  const { data, x, y, values } = input;

  // 1. Apply global filter
  const globalKeepMask = globalFilter(values, params.globalV);
  
  const globallyFiltered = {
    data: [] as RowData[],
    indices: [] as number[],
  };

  for (let i = 0; i < data.length; i++) {
    if (globalKeepMask[i]) {
      globallyFiltered.data.push(data[i]);
      globallyFiltered.indices.push(i);
    }
  }

  if (globallyFiltered.data.length === 0) {
    return [];
  }
  
  // 2. Prepare data for local filter
  const localFilterInput = {
    x: new Float64Array(globallyFiltered.indices.map(idx => x[idx])),
    y: new Float64Array(globallyFiltered.indices.map(idx => y[idx])),
    values: new Float64Array(globallyFiltered.indices.map(idx => values[idx])),
    variationPercent: params.localV,
    radius: params.radius,
    minNeighbours: params.minNeighbours,
  };

  // 3. Apply chosen local filter
  let localKeepMask: boolean[];
  if (params.mode === 'isotropic') {
    localKeepMask = isotropicFilter(localFilterInput);
  } else {
    localKeepMask = anisotropicFilter(localFilterInput);
  }
  
  // 4. Combine results and return final rows
  const finalKeptRows: RowData[] = [];
  for (let i = 0; i < globallyFiltered.data.length; i++) {
    if (localKeepMask[i]) {
      finalKeptRows.push(globallyFiltered.data[i]);
    }
  }

  return finalKeptRows;
}
