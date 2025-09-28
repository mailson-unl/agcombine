import React, { useState, useCallback } from 'react';
import type { FilterParams, RowData } from '../types';
import { toCartesian } from '../utils/toCartesian';
import { filterOutliers } from '../pipeline/filterOutliers';
import { UploadIcon, CheckCircleIcon, XCircleIcon, DownloadIcon, CogIcon, MapPinIcon, ChartBarIcon } from './icons';
import MapDisplay from './MapDisplay';
import { calculateStats, StatValues } from '../utils/calculateStats';
import StatsTable from './StatsTable';
import Histogram from './Histogram';

declare var Papa: any;
declare var saveAs: any;

interface FileUploadProps {
  params: FilterParams;
  onHeadersRead: (headers: string[]) => void;
}

interface MapConfig {
    latField: string;
    lonField: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ params, onHeadersRead }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalData, setOriginalData] = useState<RowData[]>([]);
  const [filteredData, setFilteredData] = useState<RowData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<{ original: number; kept: number } | null>(null);
  const [detailedStats, setDetailedStats] = useState<{ before: StatValues; after: StatValues } | null>(null);
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);

  const handleFileClear = () => {
    setFile(null);
    setFilteredData(null);
    setError(null);
    setStats(null);
    setDetailedStats(null);
    setOriginalData([]);
    setMapConfig(null);
    onHeadersRead([]); // Clear headers in parent
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilteredData(null);
      setError(null);
      setStats(null);
      setDetailedStats(null);
      setOriginalData([]);
      setMapConfig(null);
      
      // Pre-parse to get headers
      Papa.parse(selectedFile, {
        preview: 1,
        header: true,
        skipEmptyLines: true,
        complete: (results: { meta: { fields: string[] }}) => {
          onHeadersRead(results.meta.fields);
        },
        error: (err: Error) => {
          setError(`Could not read file headers: ${err.message}`);
          onHeadersRead([]);
        }
      });
    }
  };

  const processFile = useCallback(() => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!params.valueColumn) {
        setError('Please specify a value column name in the parameters.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setStats(null);
    setFilteredData(null);
    setDetailedStats(null);
    setMapConfig(null);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: { data: RowData[], meta: { fields: string[] }}) => {
        const { data, meta } = results;

        if (!meta.fields.includes(params.valueColumn)) {
          setError(`Value column '${params.valueColumn}' not found in the CSV header.`);
          setIsLoading(false);
          return;
        }

        const numericData = data.filter(row => row[params.valueColumn] !== null && row[params.valueColumn] !== undefined && typeof row[params.valueColumn] === 'number');
        if (numericData.length !== data.length) {
            console.warn(`Filtered out ${data.length - numericData.length} rows with non-numeric or missing values in '${params.valueColumn}'.`);
        }
        
        if (numericData.length === 0) {
             setError(`No numeric values found in column '${params.valueColumn}'.`);
             setIsLoading(false);
             return;
        }
        
        // Add a unique ID to each row for reliable tracking
        const dataWithIds = numericData.map((row, index) => ({...row, __id: index}));

        const latField = meta.fields.find(f => f.toLowerCase().startsWith('lat'));
        const lonField = meta.fields.find(f => f.toLowerCase().startsWith('lon') || f.toLowerCase().startsWith('long'));
        const xField = meta.fields.find(f => f.toUpperCase() === 'X');
        const yField = meta.fields.find(f => f.toUpperCase() === 'Y');

        let x: Float64Array;
        let y: Float64Array;

        try {
            if (latField && lonField) {
                setMapConfig({ latField, lonField });
                const lats = dataWithIds.map(row => row[latField]);
                const lons = dataWithIds.map(row => row[lonField]);
                const cartesian = toCartesian(lats, lons);
                x = cartesian.x;
                y = cartesian.y;
            } else if (xField && yField) {
                x = new Float64Array(dataWithIds.map(row => row[xField]));
                y = new Float64Array(dataWithIds.map(row => row[yField]));
            } else {
                throw new Error('Coordinate columns (Lat/Lon or X/Y) not found in CSV.');
            }

            const values = new Float64Array(dataWithIds.map(row => row[params.valueColumn]));
            
            const beforeStats = calculateStats(values);
            const keptRows = filterOutliers({ data: dataWithIds, x, y, values }, params);
            const afterValues = keptRows.map(row => row[params.valueColumn]);
            const afterStats = calculateStats(afterValues);

            setOriginalData(dataWithIds);
            setFilteredData(keptRows);
            setStats({ original: dataWithIds.length, kept: keptRows.length });
            setDetailedStats({ before: beforeStats, after: afterStats });

        } catch(e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
      },
      error: (err: Error) => {
        setError(`CSV Parsing Error: ${err.message}`);
        setIsLoading(false);
      }
    });
  }, [file, params]);

  const downloadCSV = () => {
    if (!filteredData) return;
    const csvText = Papa.unparse(filteredData);
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cleaned_data.csv');
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="file-upload" className="block text-lg font-semibold text-slate-800 mb-2">
          Upload CSV File
        </label>
        <div className="mt-2 flex items-center justify-center px-6 pt-6 pb-6 border-2 border-unl-gray border-dashed rounded-lg min-h-[160px] bg-white hover:bg-unl-cream transition-colors duration-200">
          {file ? (
             <div className="space-y-2 text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-sm font-semibold text-gray-900 font-sans">{file.name}</p>
                <p className="text-xs text-gray-600">File is ready for processing.</p>
                <button 
                  onClick={handleFileClear} 
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Choose a different file
                </button>
              </div>
          ) : (
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">CSV up to 50MB</p>
            </div>
          )}
        </div>
      </div>

       <button
          onClick={processFile}
          disabled={!file || isLoading}
          className="w-full flex justify-center items-center gap-2 text-base px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
        >
          {isLoading ? (
            <>
              <CogIcon className="animate-spin h-5 w-5" />
              Processing...
            </>
          ) : (
            'Run Filter'
          )}
        </button>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {stats && (
         <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Processing Complete</p>
              <p className="text-sm text-green-700 mt-1">
                Kept {stats.kept.toLocaleString()} out of {stats.original.toLocaleString()} rows ({((stats.kept / stats.original) * 100).toFixed(1)}%).
              </p>
            </div>
          </div>
        </div>
      )}

      {detailedStats && <StatsTable before={detailedStats.before} after={detailedStats.after} />}

      {detailedStats && (
        <div className="my-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-slate-500" />
                Value Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg border border-slate-200 shadow-sm bg-white">
                <Histogram
                    title="Before Filtering"
                    data={originalData.map(row => row[params.valueColumn])}
                    barColor="#94a3b8"
                />
                <Histogram
                    title="After Filtering"
                    data={filteredData ? filteredData.map(row => row[params.valueColumn]) : []}
                    barColor="#38bdf8"
                />
            </div>
        </div>
      )}

      {filteredData && (
        <button
          onClick={downloadCSV}
          className="w-full flex justify-center items-center gap-2 text-base px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <DownloadIcon className="h-5 w-5" />
          Download Cleaned CSV
        </button>
      )}

      {filteredData && mapConfig && (
        <div className="space-y-4 pt-4 mt-4 border-t">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-slate-500"/>
                Data Visualization
            </h3>
            <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                 <MapDisplay 
                    originalData={originalData}
                    keptData={filteredData}
                    coords={{...mapConfig, valueField: params.valueColumn}}
                 />
            </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;