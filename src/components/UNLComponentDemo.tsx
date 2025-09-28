import React from 'react';

/**
 * UNL Component Demo - Showcases all UNL-branded components
 * This component demonstrates proper usage of UNL branding elements
 */
const UNLComponentDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-unl-cream-light p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="header-unl">
          <h1 className="text-2xl font-bold font-condensed">
            UNL Component Demo
          </h1>
          <p className="text-red-100 mt-1">
            University of Nebraska-Lincoln Brand Standards
          </p>
        </div>
        
        {/* Color Palette */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-unl-scarlet rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Scarlet</p>
              <p className="text-xs text-gray-600">#D00000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-unl-cream rounded-lg mx-auto mb-2 border border-gray-300"></div>
              <p className="text-sm font-semibold">Cream</p>
              <p className="text-xs text-gray-600">#F5F1E7</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-unl-cream-light rounded-lg mx-auto mb-2 border border-gray-300"></div>
              <p className="text-sm font-semibold">Cream Light</p>
              <p className="text-xs text-gray-600">#FEFDFA</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-unl-gray rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Gray</p>
              <p className="text-xs text-gray-600">#C7C8CA</p>
            </div>
          </div>
        </div>
        
        {/* Typography */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Typography</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Primary Sans (Work Sans)</p>
              <p className="text-lg font-sans">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Primary Serif (Source Serif 4)</p>
              <p className="text-lg font-serif">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Condensed (Oswald)</p>
              <p className="text-lg font-condensed">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Buttons</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Primary Button</p>
              <button className="btn-unl-primary">
                Process Data
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Secondary Button</p>
              <button className="btn-unl-secondary">
                Download Results
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Elements */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Form Elements</h2>
          <div className="space-y-4">
            <div>
              <label className="label-unl">
                Sample Input Field
              </label>
              <input 
                type="text" 
                className="input-unl" 
                placeholder="Enter your data..."
                defaultValue="Sample text"
              />
            </div>
            <div>
              <label className="label-unl">
                Sample Select
              </label>
              <select className="input-unl">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Alerts</h2>
          <div className="space-y-4">
            <div className="alert-unl-success">
              <p className="font-semibold">Success!</p>
              <p>Your data has been processed successfully.</p>
            </div>
            <div className="alert-unl-info">
              <p className="font-semibold">Information</p>
              <p>This tool processes agricultural field data.</p>
            </div>
            <div className="alert-unl-warning">
              <p className="font-semibold">Warning</p>
              <p>Large datasets may take longer to process.</p>
            </div>
            <div className="alert-unl-error">
              <p className="font-semibold">Error</p>
              <p>Unable to process the uploaded file.</p>
            </div>
          </div>
        </div>
        
        {/* Links */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">Links</h2>
          <div className="space-y-2">
            <p>
              Visit the <a href="#" className="link-unl">University of Nebraska-Lincoln</a> website.
            </p>
            <p>
              Learn more about <a href="#" className="link-unl">precision agriculture</a> research.
            </p>
          </div>
        </div>
        
        {/* Accent Colors (Chart Use Only) */}
        <div className="card-unl">
          <h2 className="text-xl font-bold mb-4 font-condensed">
            Accent Colors <span className="text-sm font-normal text-gray-600">(Charts/Infographics Only)</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-navy rounded mx-auto mb-1"></div>
              <p className="text-xs">Navy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-cerulean rounded mx-auto mb-1"></div>
              <p className="text-xs">Cerulean</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-green rounded mx-auto mb-1"></div>
              <p className="text-xs">Green</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-orange rounded mx-auto mb-1"></div>
              <p className="text-xs">Orange</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-lapis rounded mx-auto mb-1"></div>
              <p className="text-xs">Lapis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-yellow rounded mx-auto mb-1"></div>
              <p className="text-xs">Yellow</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-unl-purple rounded mx-auto mb-1"></div>
              <p className="text-xs">Purple</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UNLComponentDemo;