'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';
import '@/styles/leaflet-custom.css';

// Define the type for the points prop
type HeatmapLayerProps = {
  points: [number, number, number][];
};

export function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Create the heat layer with the provided points
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
    });

    // Add the layer to the map
    map.addLayer(heatLayer);

    // Cleanup function to remove the layer when the component unmounts or points change
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]); // Rerun effect if map instance or points change

  return null; // This component does not render anything itself
}
