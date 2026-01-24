"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import type { Building, FilterState } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Layers, Locate, ZoomIn, ZoomOut } from "lucide-react"
import * as mapboxgl from "mapbox-gl"
import { GeoJSON } from "geojson"

const MAPBOX_TOKEN = "pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q"
const GOMBE_CENTER: [number, number] = [11.1672, 10.2897] // [lng, lat]

export const CLASSIFICATION_COLORS: Record<string, string> = {
  Residential: "#3B82F6", // Blue
  Commercial: "#F59E0B", // Amber
  Industrial: "#8B5CF6", // Purple
  default: "#9CA3AF",
}

// Declare mapboxgl globally for dynamic loading
declare global {
  interface Window {
    mapboxgl: any
  }
}

interface MapboxMapProps {
  buildings: Building[]
  filters: FilterState
  onBuildingClick: (building: Building) => void
  isLoading: boolean
  selectedBuildingId?: string | null
}

export function MapboxMap({ buildings, filters, onBuildingClick, isLoading, selectedBuildingId }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const buildingsRef = useRef<Building[]>(buildings)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite")
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapboxReady = true; // Declare mapboxReady variable

  // Keep buildings ref updated
  useEffect(() => {
    buildingsRef.current = buildings
  }, [buildings])

  // Filter buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      if (!filters.classifications.includes(b.classification)) return false
      if (b.area_in_meters < filters.minArea || b.area_in_meters > filters.maxArea) return false
      if (b.confidence < filters.minConfidence) return false
      return true
    })
  }, [buildings, filters])

  // Convert buildings to GeoJSON with polygon geometry
  const geojsonData = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: filteredBuildings.slice(0, 100000).map((building) => ({
        type: "Feature" as const,
        id: building.id,
        properties: {
          id: building.id,
          classification: building.classification,
          area: building.area_in_meters,
          confidence: building.confidence,
          tax: building.estimated_tax,
        },
        geometry: building.geometry,
      })),
    }
  }, [filteredBuildings])

  // Load Mapbox GL JS dynamically
  useEffect(() => {
    if (typeof window === "undefined" || window.mapboxgl) {
      setMapboxLoaded(true)
      return
    }

    // Load CSS
    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
    document.head.appendChild(cssLink)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"
    script.async = true
    script.onload = () => setMapboxLoaded(true)
    script.onerror = () => setMapError("Failed to load Mapbox GL JS")
    document.head.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [])

  // Add buildings layer function with polygon fill
  const addBuildingsLayer = useCallback(
    (map: any) => {
      try {
        // Check if source already exists
        if (map.getSource("buildings")) {
          const source = map.getSource("buildings")
          source.setData(geojsonData)
          return
        }

        // Add source
        map.addSource("buildings", {
          type: "geojson",
          data: geojsonData,
        })

        // Add fill layer for building polygons
        map.addLayer({
          id: "buildings-fill",
          type: "fill",
          source: "buildings",
          paint: {
            "fill-color": [
              "match",
              ["get", "classification"],
              "Residential",
              CLASSIFICATION_COLORS.Residential,
              "Commercial",
              CLASSIFICATION_COLORS.Commercial,
              "Industrial",
              CLASSIFICATION_COLORS.Industrial,
              CLASSIFICATION_COLORS.default,
            ],
            "fill-opacity": 0.65,
          },
        })

        // Add outline layer for buildings
        map.addLayer({
          id: "buildings-outline",
          type: "line",
          source: "buildings",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 0.5,
            "line-opacity": 0.8,
          },
        })

        // Add click handler
        map.on("click", "buildings-fill", (e: any) => {
          if (!e.features || e.features.length === 0) return

          const feature = e.features[0]
          const props = feature.properties

          const building = buildingsRef.current.find((b) => b.id === props?.id)
          if (building) {
            onBuildingClick(building)
          }
        })

        // Change cursor on hover
        map.on("mouseenter", "buildings-fill", () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", "buildings-fill", () => {
          map.getCanvas().style.cursor = ""
        })
      } catch (err) {
        console.error("[v0] Error adding buildings layer:", err)
      }
    },
    [geojsonData, onBuildingClick],
  )

  // Initialize map
  useEffect(() => {
    if (!mapboxReady || !mapContainerRef.current || mapRef.current) return

    try {
      const mapboxgl = window.mapboxgl
      if (!mapboxgl) {
        setMapError("Mapbox GL JS is not available")
        return
      }

      mapboxgl.accessToken = MAPBOX_TOKEN

      const styleUrl =
        mapStyle === "satellite"
          ? "mapbox://styles/mapbox/satellite-streets-v12"
          : "mapbox://styles/mapbox/streets-v12"

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center: GOMBE_CENTER,
        zoom: 12,
        pitch: 45,
        antialias: true,
      })

      // Remove default controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right")
      map.addControl(new mapboxgl.ScaleControl(), "bottom-right")

      const handleMapLoad = () => {
        try {
          // Add 3D terrain only if not already added
          if (!map.getSource("mapbox-dem")) {
            map.addSource("mapbox-dem", {
              type: "raster-dem",
              url: "mapbox://mapbox.mapbox-terrain-dem-v1",
              tileSize: 512,
              maxzoom: 14,
            })
            map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })
          }

          // Add buildings layer
          addBuildingsLayer(map)
          setMapLoaded(true)
        } catch (err) {
          console.error("[v0] Map load error:", err)
          setMapError("Failed to load map layers")
        }
      }

      map.on("load", handleMapLoad)

      mapRef.current = map

      return () => {
        map.off("load", handleMapLoad)
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
        setMapLoaded(false)
      }
    } catch (err) {
      console.error("[v0] Map initialization error:", err)
      setMapError("Failed to initialize map")
    }
  }, [mapboxReady, mapStyle, addBuildingsLayer])

  // Update buildings data when it changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    const map = mapRef.current
    const source = map.getSource("buildings") as mapboxgl.GeoJSONSource

    if (source) {
      source.setData(geojsonData)
    } else {
      addBuildingsLayer(map)
    }
  }, [geojsonData, mapLoaded, addBuildingsLayer])

  // Handle selected building highlight and fly-to
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    const map = mapRef.current

    // Remove existing selection layer
    if (map.getLayer("selected-building-outline")) {
      map.removeLayer("selected-building-outline")
    }

    if (selectedBuildingId) {
      // Add highlight layer for selected building
      map.addLayer({
        id: "selected-building-outline",
        type: "line",
        source: "buildings",
        paint: {
          "line-color": "#FFFF00", // Bright yellow
          "line-width": 3,
          "line-opacity": 1,
        },
        filter: ["==", ["get", "id"], selectedBuildingId],
      })

      // Fly to selected building
      const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId)
      if (selectedBuilding && selectedBuilding.geometry?.coordinates?.[0]) {
        const coordinates = selectedBuilding.geometry.coordinates[0]
        const center = coordinates.reduce(
          (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
          [0, 0],
        )
        center[0] /= coordinates.length
        center[1] /= coordinates.length

        map.flyTo({
          center: center as [number, number],
          zoom: 18,
          pitch: 60,
        })
      }
    }
  }, [selectedBuildingId, mapLoaded, buildings])

  // Handle style changes
  const toggleStyle = useCallback(() => {
    if (!mapRef.current) return

    const newStyle = mapStyle === "satellite" ? "streets" : "satellite"
    setMapStyle(newStyle)
    setMapLoaded(false)

    const styleUrl =
      newStyle === "satellite" ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/streets-v12"

    const map = mapRef.current

    // Remove terrain before changing style to avoid issues
    try {
      if (map.getTerrain()) {
        map.setTerrain(null)
      }
    } catch {
      // Terrain might not exist yet
    }

    map.setStyle(styleUrl)

    const handleStyleLoad = () => {
      // Re-add terrain after style change
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        })
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })
      }

      // Re-add buildings layers
      addBuildingsLayer(map)
      setMapLoaded(true)
    }

    map.once("style.load", handleStyleLoad)
  }, [mapStyle, addBuildingsLayer])

  const handleRecenter = useCallback(() => {
    mapRef.current?.flyTo({
      center: GOMBE_CENTER,
      zoom: 12,
      pitch: 45,
      duration: 1500,
    })
  }, [])

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut()
  }, [])

  if (mapError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600 mb-2">Unable to Load Map</div>
          <p className="text-sm text-slate-600">{mapError}</p>
        </div>
      </div>
    )
  }

  if (isLoading && buildings.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin mx-auto" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Loading Geospatial Data</h3>
          <p className="text-xs text-slate-500">Parsing 245,264 building footprints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <div ref={mapContainerRef} className="absolute inset-0 bg-slate-200" />

      {/* Top controls - modern iOS style */}
      <div className="absolute top-4 right-4 z-10 flex gap-2.5">
        {/* Style toggle */}
        <button
          onClick={toggleStyle}
          className="p-2.5 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 transition-all active:scale-95"
          title={mapStyle === "satellite" ? "Switch to Streets" : "Switch to Satellite"}
        >
          <Layers className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
        </button>

        {/* Recenter */}
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 transition-all active:scale-95"
          title="Recenter Map"
        >
          <Locate className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 transition-all active:scale-95 lg:hidden"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 transition-all active:scale-95 lg:hidden"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
        </button>
      </div>

      {/* Building Types Legend - bottom left */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="rounded-2xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 p-3.5 min-w-fit">
          <div className="text-xs font-semibold text-slate-900 mb-2.5">Building Types</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Residential }} />
              <span className="text-xs text-slate-700 font-medium">Residential</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Commercial }} />
              <span className="text-xs text-slate-700 font-medium">Commercial</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Industrial }} />
              <span className="text-xs text-slate-700 font-medium">Industrial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Badge - top right, below controls */}
      <div className="absolute top-20 right-4 z-10">
        <div className="rounded-2xl backdrop-blur-md bg-white/70 hover:bg-white/80 shadow-sm border border-white/50 px-4 py-3 text-right">
          <div className="text-xs font-medium text-slate-600 mb-0.5">Showing</div>
          <div className="text-xl font-bold text-slate-900">{filteredBuildings.length.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">of {buildings.length.toLocaleString()} buildings</div>
        </div>
      </div>
    </div>
  )
}

// Add global type declaration for mapboxgl
declare global {
  interface Window {
    mapboxgl: typeof import("mapbox-gl")
  }
}
