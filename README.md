# AgCombine Filter

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue)](https://your-username.github.io/agcombine)

A browser-native tool for cleaning agricultural yield data using advanced spatial filtering algorithms. Remove outliers from precision agriculture datasets with sophisticated anisotropic and isotropic filtering techniques.

## 🌾 Features

- **Advanced Spatial Filtering**: Anisotropic and isotropic outlier detection algorithms
- **Browser-Native**: No installation required - runs entirely in your browser
- **Privacy-First**: All data processing happens locally on your machine
- **Interactive Visualization**: Real-time maps showing filtered results with yield gradients
- **CSV Import/Export**: Easy data handling with drag-and-drop interface
- **Statistical Analysis**: Detailed before/after statistics and histograms
- **Agricultural Optimized**: Algorithms tuned for field pattern recognition

## 🚀 Quick Start

### Online Use (Recommended)
Visit the live demo: **[AgCombine Filter](https://your-username.github.io/agcombine)**

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/agcombine.git
cd agcombine

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 📊 How to Use

1. **Upload CSV Data**: Drag and drop your agricultural yield CSV file
   - Required columns: Latitude/Longitude (or X/Y coordinates) + Yield values
   - Supported formats: Any CSV with spatial coordinates and numeric yield data

2. **Configure Parameters**:
   - **Algorithm**: Choose between Anisotropic (directional) or Isotropic (uniform) filtering
   - **Global Variation**: Overall tolerance for outliers (default: 20%)
   - **Local Variation**: Neighborhood-specific tolerance (default: 15%)
   - **Search Radius**: Distance for neighbor search (default: 30 units)
   - **Min Neighbors**: Minimum neighbors required for filtering (default: 2)

3. **Run Filter**: Click the blue "Run Filter" button to process your data

4. **Review Results**: 
   - Interactive map shows kept points in yield colors (yellow→green→blue)
   - Red points indicate detected outliers
   - Statistics panel shows filtering effectiveness
   - Histograms compare before/after distributions

5. **Export Clean Data**: Download the filtered CSV file

## 🧮 Algorithms

### Anisotropic Filter (Recommended for Agricultural Data)
Uses **directional wedge analysis** to respect field patterns:
- Identifies dominant local directions (crop rows, equipment paths)
- Applies filtering within directional wedges (±45° default)
- Handles curved field boundaries and varying row directions
- Falls back to isotropic filtering when directional analysis is inconclusive

**Technical Details**:
- Spatial indexing with Flatbush for O(log n) neighbor queries
- Histogram-based direction finding with 12 angular bins (30° each)
- Bidirectional wedge filtering (considers opposite directions)
- Adaptive neighbor thresholds with fallback mechanisms

### Isotropic Filter
Traditional uniform spatial filtering:
- Considers all neighbors within search radius equally
- Median-based outlier detection
- Suitable for uniform data distributions

## 📁 CSV Format Requirements

Your CSV file should include:

### Required Columns
- **Coordinates**: Either `Lat`/`Lon` OR `X`/`Y`
- **Values**: Numeric column (e.g., `Yield`, `Bushels`, `Tons`)

### Example CSV Structure
```csv
Lat,Lon,Yield,Field_ID
40.123,-96.456,180.5,Field_A
40.124,-96.457,175.2,Field_A
40.125,-96.458,210.8,Field_A
```

## 🎯 Parameter Tuning Guide

### For Different Crop Types

**Row Crops (Corn, Soybeans)**:
- Algorithm: Anisotropic
- Global Variation: 15-25%
- Local Variation: 10-20%
- Search Radius: 20-40 units

**Small Grains (Wheat, Barley)**:
- Algorithm: Anisotropic or Isotropic
- Global Variation: 20-30%
- Local Variation: 15-25%
- Search Radius: 30-50 units

## 🔧 Technical Architecture

### Frontend Stack
- **React 19** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Leaflet** for interactive mapping

### Spatial Processing
- **Flatbush**: R-tree spatial indexing for efficient neighbor queries
- **Custom Algorithms**: Anisotropic wedge analysis and direction finding

### Data Privacy
- **Local Processing**: All computations happen in your browser
- **No Server Communication**: Data never leaves your machine
- **No Tracking**: No analytics or user data collection

## 🛠️ Development

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏫 Acknowledgments

- **University of Nebraska-Lincoln** for agricultural research support
- **Flatbush** library for efficient spatial indexing
- **Leaflet** community for mapping capabilities
