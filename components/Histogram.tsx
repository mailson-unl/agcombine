import React, { useMemo } from 'react';

interface HistogramProps {
  data: number[];
  width?: number;
  height?: number;
  barColor?: string;
  title: string;
}

const Histogram: React.FC<HistogramProps> = ({
  data,
  width = 300,
  height = 150,
  barColor = '#60a5fa', // tailwindcss blue-400
  title,
}) => {
  const { bins, dataMin, dataMax } = useMemo(() => {
    if (data.length === 0) return { bins: [], dataMin: 0, dataMax: 0 };

    const numBins = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    if (min === max) {
        const singleBin = [{ x0: min, x1: max, length: data.length }];
        return { bins: singleBin, dataMin: min, dataMax: max };
    }

    const binWidth = (max - min) / numBins;
    const createdBins = Array.from({ length: numBins }, (_, i) => ({
      x0: min + i * binWidth,
      x1: min + (i + 1) * binWidth,
      length: 0,
    }));

    for (const value of data) {
      // Ensure the max value goes into the last bin
      const binIndex = value === max ? numBins - 1 : Math.floor((value - min) / binWidth);
       if (createdBins[binIndex]) {
        createdBins[binIndex].length++;
      }
    }
    return { bins: createdBins, dataMin: min, dataMax: max };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h4 className="text-center font-semibold text-slate-700">{title}</h4>
        <div style={{ width, height }} className="flex items-center justify-center bg-slate-50 rounded-md border mt-2">
            <p className="text-sm text-slate-500">No data to display.</p>
        </div>
      </div>
    );
  }

  const maxBinCount = Math.max(...bins.map(b => b.length), 0);
  
  // Guard against division by zero if all bins are empty
  const yScale = (count: number) => maxBinCount > 0 ? (count / maxBinCount) * height : 0;
  
  const barWidth = width / bins.length;

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-center font-semibold text-slate-700">{title}</h4>
      <svg width={width} height={height} className="bg-slate-50 rounded-md border mt-2">
        <g>
          {bins.map((bin, i) => {
            const barHeight = yScale(bin.length);
            return (
              <rect
                key={i}
                x={i * barWidth}
                y={height - barHeight}
                width={Math.max(0, barWidth - 1)} // Ensure width is not negative, add gap
                height={barHeight}
                fill={barColor}
              >
                <title>{`Range: ${bin.x0.toFixed(2)} - ${bin.x1.toFixed(2)}\nCount: ${bin.length}`}</title>
              </rect>
            );
          })}
        </g>
      </svg>
      <div className="flex justify-between text-xs text-slate-500 mt-1 w-full" style={{maxWidth: `${width}px`}}>
          <span>{dataMin.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          <span>{dataMax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
      </div>
    </div>
  );
};

export default Histogram;