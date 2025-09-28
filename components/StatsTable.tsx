import React from 'react';
import type { StatValues } from '../utils/calculateStats';
import { ChartBarIcon } from './icons';

interface StatsTableProps {
  before: StatValues;
  after: StatValues;
}

const StatsTable: React.FC<StatsTableProps> = ({ before, after }) => {
  const formatNumber = (num: number) => {
    if (num % 1 !== 0) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toLocaleString();
  };

  const statsRows = [
    { label: 'Count', before: before.count, after: after.count },
    { label: 'Min', before: before.min, after: after.min },
    { label: 'Max', before: before.max, after: after.max },
    { label: 'Std. Deviation', before: before.stdDev, after: after.stdDev },
    { label: 'Coeff. of Variation (%)', before: before.cv, after: after.cv },
  ];

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <ChartBarIcon className="h-6 w-6 text-slate-500" />
        Data Statistics
      </h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left font-medium text-slate-600 tracking-wider">Statistic</th>
              <th scope="col" className="px-4 py-2 text-right font-medium text-slate-600 tracking-wider">Before Filtering</th>
              <th scope="col" className="px-4 py-2 text-right font-medium text-slate-600 tracking-wider">After Filtering</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {statsRows.map((row) => (
              <tr key={row.label} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{row.label}</td>
                <td className="px-4 py-2 text-right text-slate-700 font-mono">{formatNumber(row.before)}</td>
                <td className="px-4 py-2 text-right text-slate-700 font-mono">{formatNumber(row.after)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
