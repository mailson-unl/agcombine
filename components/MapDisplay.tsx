import React, { useEffect, useRef, useMemo } from 'react';
import type { RowData } from '../types';
import { getColorFromRamp } from '../utils/color';

declare var L: any;

interface MapDisplayProps {
  originalData: RowData[];
  keptData: RowData[];
  coords: {
    latField: string;
    lonField: string;
    valueField: string;
  };
}

// Define the color ramp for "kept" points and a static style for "removed"
const colorRamp = ['#fee08b', '#abdda4', '#3288bd']; // Yellow -> Green -> Blue
const removedPointStyle = {
  color: '#f87171', // Same as fill color for seamless appearance
  fillColor: '#f87171', // red-400
  fillOpacity: 0.8,
  radius: 5,
  weight: 0, // Remove border
};

const MapDisplay: React.FC<MapDisplayProps> = ({ originalData, keptData, coords }) => {
  const mapRef = useRef<any | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const legendRef = useRef<any | null>(null);
  const layersControlRef = useRef<any | null>(null);
  const baseLayersRef = useRef<any | null>(null);

  const { keptPoints, removedPoints, valueRange } = useMemo(() => {
    const keptIdSet = new Set(keptData.map(row => row.__id));
    const kept: RowData[] = [];
    const removed: RowData[] = [];

    originalData.forEach(row => {
      if (keptIdSet.has(row.__id)) {
        kept.push(row);
      } else {
        removed.push(row);
      }
    });
    
    let min = Infinity;
    let max = -Infinity;
    if (kept.length > 0) {
        kept.forEach(row => {
            const value = row[coords.valueField];
            if (typeof value === 'number') {
                if (value < min) min = value;
                if (value > max) max = value;
            }
        });
    }
    // Handle case where all points have same value or no points
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 0;

    return { 
        keptPoints: kept, 
        removedPoints: removed,
        valueRange: { min, max }
    };
  }, [originalData, keptData, coords.valueField]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Define base layers once
      const baseLayers = {
        'Standard': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
        'Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
      };
      baseLayersRef.current = baseLayers;
      
      // Initialize map with a default base layer
      const map = L.map(mapContainerRef.current, {
          layers: [baseLayers['Standard']] // Set default layer
      }).setView([40, -95], 4);
      
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || originalData.length === 0) return;

    // Clear previous controls and data layers
    if (legendRef.current) {
        map.removeControl(legendRef.current);
        legendRef.current = null;
    }
    if (layersControlRef.current) {
        map.removeControl(layersControlRef.current);
        layersControlRef.current = null;
    }
    map.eachLayer((layer: any) => {
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    });

    const createKeptPointLayer = () => {
      const layer = L.layerGroup();
      const { min, max } = valueRange;

      keptPoints.forEach(row => {
        const lat = row[coords.latField];
        const lon = row[coords.lonField];
        const value = row[coords.valueField];

        if (typeof lat === 'number' && typeof lon === 'number' && typeof value === 'number') {
          const fillColor = getColorFromRamp(value, min, max, colorRamp);
          const style = {
            color: fillColor, // Same as fill color for seamless appearance
            fillColor,
            fillOpacity: 0.9,
            radius: 5,
            weight: 0, // Remove border
          };
          L.circleMarker([lat, lon], style)
            .bindPopup(`<b>${coords.valueField}:</b> ${value.toLocaleString()}`)
            .addTo(layer);
        }
      });
      return layer;
    };
    
    const createRemovedPointLayer = () => {
      const layer = L.layerGroup();
      removedPoints.forEach(row => {
        const lat = row[coords.latField];
        const lon = row[coords.lonField];
        if (typeof lat === 'number' && typeof lon === 'number') {
          L.circleMarker([lat, lon], removedPointStyle)
            .bindPopup(`<b>${coords.valueField}:</b> ${row[coords.valueField]} (Removed)`)
            .addTo(layer);
        }
      });
      return layer;
    };


    const keptLayer = createKeptPointLayer();
    const removedLayer = createRemovedPointLayer();

    keptLayer.addTo(map);
    removedLayer.addTo(map);

    const overlayMaps = {
        "Kept": keptLayer,
        "Removed": removedLayer
    };

    layersControlRef.current = L.control.layers(baseLayersRef.current, overlayMaps).addTo(map);

    const allPoints = originalData.map(row => {
        const lat = row[coords.latField];
        const lon = row[coords.lonField];
        if (typeof lat === 'number' && typeof lon === 'number') {
            return [lat, lon];
        }
        return null;
    }).filter((p): p is [number, number] => p !== null);

    if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [20, 20] });
    }
    
    // Add new legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend bg-white p-3 rounded-md shadow-lg text-xs w-32');
      const gradient = colorRamp.join(', ');
      const { min, max } = valueRange;

      let legendHtml = `<h4 class="font-bold mb-2 text-sm">${coords.valueField}</h4>`;

      legendHtml += `
        <div class="flex items-center gap-2 mb-2">
            <div class="w-4 h-4 rounded-full" style="background-color: ${removedPointStyle.fillColor}"></div>
            <span>Removed</span>
        </div>`;

      if (min !== max && keptPoints.length > 0) {
           legendHtml += `
              <div class="font-semibold mb-1">Kept</div>
              <div class="flex items-start">
                  <div class="w-4 h-16 mr-2 border border-slate-300" style="background: linear-gradient(to top, ${gradient});"></div>
                  <div class="flex flex-col justify-between h-16 text-slate-600">
                      <span>${max.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                      <span>${min.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  </div>
              </div>
          `;
      } else if (keptPoints.length > 0) {
           legendHtml += `
               <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full" style="background-color: ${colorRamp[0]}"></div>
                  <span>Kept (${min.toLocaleString()})</span>
              </div>
          `;
      }
     
      div.innerHTML = legendHtml;
      return div;
    };
    legend.addTo(map);
    legendRef.current = legend;

  }, [originalData, keptData, keptPoints, removedPoints, coords, valueRange]);

  return <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapDisplay;