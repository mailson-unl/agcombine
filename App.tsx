
import React, { useState } from 'react';
import { FilterParams } from './types';
import ParameterForm from './components/ParameterForm';
import FileUpload from './components/FileUpload';

export default function App() {
  const [params, setParams] = useState<FilterParams>({
    valueColumn: 'Yield',
    globalV: 20, // Increased global variation tolerance for yield data
    localV: 15,  // Increased local variation tolerance
    radius: 30,
    mode: 'anisotropic', // Default to anisotropic for agricultural data
    minNeighbours: 2, // Reduced minimum neighbors for more lenient filtering
  });
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const handleHeadersRead = (headers: string[]) => {
    setCsvHeaders(headers);
    if (headers.length > 0) {
      // If the current valueColumn is not in the new headers, update it to the first header.
      if (!headers.includes(params.valueColumn)) {
        setParams(p => ({ ...p, valueColumn: headers[0] }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50">
        <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Nebraska Logo with Modern Styling */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg flex items-center justify-center p-2 border border-white/20">
                  <img 
                    src="./Nebraska_N_RGB.png" 
                    alt="Nebraska Logo" 
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  AgCombine Filter
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  Advanced Agricultural Data Processing
                </p>
              </div>
              
              {/* Status Badge */}
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-200/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-700">Browser Native</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section with Modern Typography */}
        <section className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-semibold text-blue-700">Advanced Spatial Analysis</span>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
            Clean Your Field Data
            <br />
            <span className="text-3xl font-normal text-slate-600">with Advanced Spatial Algorithms</span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Remove outliers from precision agriculture datasets using sophisticated anisotropic and isotropic filtering algorithms. 
            <span className="font-semibold text-slate-800">No installation required</span> — everything runs securely in your browser.
          </p>
        </section>
        
        {/* Main Content Grid with Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Parameters Panel */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Filter Parameters
                </h3>
              </div>
              <ParameterForm params={params} onChange={setParams} csvHeaders={csvHeaders} />
            </div>
          </div>

          {/* Data Processing Panel */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Data Processing
                </h3>
              </div>
              <FileUpload params={params} onHeadersRead={handleHeadersRead} />
            </div>
          </div>
        </div>

        {/* Information Section with Modern Cards */}
        <section className="mt-16 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Lightning Fast</h4>
              <p className="text-slate-600 text-sm">
                Process thousands of data points in seconds with optimized spatial algorithms.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Secure & Private</h4>
              <p className="text-slate-600 text-sm">
                Your data never leaves your browser. Complete privacy and security guaranteed.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Visual Analytics</h4>
              <p className="text-slate-600 text-sm">
                Interactive maps and charts help you understand your data transformations.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="mt-24 border-t border-white/20 backdrop-blur-sm bg-white/30">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <img 
                  src="./Nebraska_N_RGB.png" 
                  alt="Nebraska Logo" 
                  className="w-4 h-4 object-contain filter brightness-0 invert"
                />
              </div>
              <span className="text-slate-700 font-semibold">University of Nebraska-Lincoln</span>
            </div>
            <p className="text-slate-600 mb-6">
              Advancing precision agriculture through innovative data analysis tools
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <span>React + TypeScript</span>
              <span>•</span>
              <span>Spatial Computing</span>
              <span>•</span>
              <span>Browser-Native</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}