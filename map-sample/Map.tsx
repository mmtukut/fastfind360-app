'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, LngLatLike, Popup } from 'mapbox-gl';
import { Building } from '@/types';
import { useStore } from '@/store/buildingStore';
import { useFilters } from '@/hooks/useFilters';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  buildings: Building[];
  onBuildingClick: (buildingId: string) => void;
  selectedBuildingId: string | null;
}

export const classificationColors: Record<string, string> = {
  residential: '#3B82F6', // Blue
  commercial: '#F59E0B', // Amber
  industrial: '#8B5CF6', // Purple
  institutional: '#10B981', // Emerald
  mixed: '#6B7280', // Gray
  default: '#9CA3AF',
};

export default function Map({ buildings, onBuildingClick, selectedBuildingId }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { filteredBuildings } = useFilters(buildings);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("Mapbox Access Token is not set!");
      return;
    }
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [11.1672, 10.2897],
        zoom: 12,
        pitch: 45,
        antialias: true,
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);

        // Add 3D terrain
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      });
      
      map.current.on('click', 'buildings-fill', (e) => {
        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            if(feature.properties?.id) {
                onBuildingClick(feature.properties.id);
            }
        }
      });
      
      // Change cursor to pointer on hover
      map.current.on('mouseenter', 'buildings-fill', () => {
        if(map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'buildings-fill', () => {
        if(map.current) map.current.getCanvas().style.cursor = '';
      });

    }
  }, [onBuildingClick]);

  useEffect(() => {
    if (!map.current || !isMapLoaded || !filteredBuildings) return;

    const mapInstance = map.current;

    const source = mapInstance.getSource('buildings') as mapboxgl.GeoJSONSource;

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredBuildings.map(b => ({
        type: 'Feature',
        id: b.id, // Use the building ID for feature state
        geometry: b.geometry,
        properties: b.properties,
      })),
    };

    if (source) {
      source.setData(geojsonData);
    } else {
      mapInstance.addSource('buildings', {
        type: 'geojson',
        data: geojsonData,
      });

      mapInstance.addLayer({
        id: 'buildings-fill',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': [
            'match',
            ['get', 'classification'],
            'residential', classificationColors.residential,
            'commercial', classificationColors.commercial,
            'industrial', classificationColors.industrial,
            'institutional', classificationColors.institutional,
            'mixed', classificationColors.mixed,
            classificationColors.default,
          ],
          'fill-opacity': 0.7,
        },
      });

      mapInstance.addLayer({
        id: 'buildings-outline',
        type: 'line',
        source: 'buildings',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });
    }
  }, [isMapLoaded, filteredBuildings]);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    const mapInstance = map.current;

    if (mapInstance.getLayer('selected-building-outline')) {
      mapInstance.removeLayer('selected-building-outline');
    }

    if (selectedBuildingId) {
      mapInstance.addLayer({
        id: 'selected-building-outline',
        type: 'line',
        source: 'buildings',
        paint: {
          'line-color': '#FFFF00', // Bright yellow for selection
          'line-width': 3,
          'line-opacity': 1,
        },
        filter: ['==', ['id'], selectedBuildingId],
      });
      
      // Fly to selected building
      const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
      if(selectedBuilding) {
        const coordinates = selectedBuilding.geometry.coordinates[0];
        const center = coordinates.reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
        center[0] /= coordinates.length;
        center[1] /= coordinates.length;

        mapInstance.flyTo({
            center: center as LngLatLike,
            zoom: 18,
            pitch: 60,
        });
      }

    }
  }, [selectedBuildingId, isMapLoaded, buildings]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
