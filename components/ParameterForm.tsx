
import React from 'react';
import type { FilterParams, FilterMode } from '../types';

interface ParameterFormProps {
  params: FilterParams;
  onChange: (newParams: FilterParams) => void;
  csvHeaders: string[];
}

const ParameterForm: React.FC<ParameterFormProps> = ({ params, onChange, csvHeaders }) => {

  const handleInputChange = <T extends keyof FilterParams,>(
    name: T,
    value: FilterParams[T]
  ) => {
    onChange({ ...params, [name]: value });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      handleInputChange(name as keyof FilterParams, numValue);
    }
  };
  
  const handleModeChange = (mode: FilterMode) => {
    handleInputChange('mode', mode);
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="valueColumn" className="block text-sm font-semibold text-slate-700 mb-3">
          Value Column Name
        </label>
        {csvHeaders && csvHeaders.length > 0 ? (
          <select
            id="valueColumn"
            name="valueColumn"
            value={params.valueColumn}
            onChange={(e) => handleInputChange('valueColumn', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer text-slate-700"
          >
            {csvHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="valueColumn"
            name="valueColumn"
            value={params.valueColumn}
            onChange={(e) => handleInputChange('valueColumn', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
            placeholder="e.g., Yield, Moisture, Protein"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="globalV" className="block text-sm font-semibold text-slate-700 mb-3">
            Global Variation
          </label>
          <div className="relative">
            <input
              type="number"
              id="globalV"
              name="globalV"
              value={params.globalV}
              onChange={handleNumberChange}
              step="1"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 pr-10"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">%</span>
          </div>
        </div>
        <div>
          <label htmlFor="localV" className="block text-sm font-semibold text-slate-700 mb-3">
            Local Variation
          </label>
          <div className="relative">
            <input
              type="number"
              id="localV"
              name="localV"
              value={params.localV}
              onChange={handleNumberChange}
              step="1"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 pr-10"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="radius" className="block text-sm font-semibold text-slate-700 mb-3">
            Search Radius
          </label>
          <div className="relative">
            <input
              type="number"
              id="radius"
              name="radius"
              value={params.radius}
              onChange={handleNumberChange}
              step="1"
              min="0"
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 pr-10"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">m</span>
          </div>
        </div>
        <div>
          <label htmlFor="minNeighbours" className="block text-sm font-semibold text-slate-700 mb-3">
            Min. Neighbors
          </label>
          <input
            type="number"
            id="minNeighbours"
            name="minNeighbours"
            value={params.minNeighbours}
            onChange={handleNumberChange}
            step="1"
            min="1"
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-4">
          Filtering Algorithm
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/50 rounded-2xl backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleModeChange('isotropic')}
            className={`relative flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
              params.mode === 'isotropic'
                ? 'bg-white text-slate-800 shadow-lg transform scale-[1.02]'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 rounded-full border-2 ${
                params.mode === 'isotropic' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              } flex items-center justify-center`}>
                <div className={`w-3 h-3 rounded-full ${
                  params.mode === 'isotropic' ? 'bg-blue-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <span>Isotropic</span>
              <span className="text-xs text-slate-500">Circular</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('anisotropic')}
            className={`relative flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
              params.mode === 'anisotropic'
                ? 'bg-white text-slate-800 shadow-lg transform scale-[1.02]'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 rounded-lg border-2 ${
                params.mode === 'anisotropic' ? 'border-purple-500 bg-purple-50' : 'border-slate-300'
              } flex items-center justify-center`}>
                <div className={`w-4 h-1 rounded ${
                  params.mode === 'anisotropic' ? 'bg-purple-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <span>Anisotropic</span>
              <span className="text-xs text-slate-500">Directional</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ParameterForm;