
export type FilterMode = 'isotropic' | 'anisotropic';

export interface FilterParams {
  valueColumn: string;
  globalV: number; // Percentage (e.g., 15 for 15%)
  localV: number; // Percentage (e.g., 10 for 10%)
  radius: number;
  mode: FilterMode;
  minNeighbours: number;
}

export type RowData = Record<string, any>;
