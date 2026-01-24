"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import type { Building, FilterState } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Layers, Locate, ZoomIn, ZoomOut } from "lucide-react"
import mapboxgl from "mapbox-gl"
import { GeoJSON } from "geojson"

const MAPBOX_TOKEN = "pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q"
const GOMBE_CENTER: [number, number] = [11.1672, 10.2897] // [lng, lat]

export const CLASSIFICATION_COLORS: Record<string, string> = {
  Residential: "#3B82F6", // Blue
  Commercial: "#F59E0B", // Amber
  Industrial: "#8B5CF6", // Purple
  default: "#9CA3AF",
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
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const buildingsRef = useRef<Building[]>(buildings)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite")
  const [mapboxLoaded, setMapboxLoaded] = useState(false)

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
  const geojsonData = useMemo((): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: filteredBuildings.slice(0, 100000).map((building) => ({
        type: "Feature",
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

  // Add buildings layer function with polygon fill
  const addBuildingsLayer = useCallback(
    (map: mapboxgl.Map) => {
      // Check if source already exists
      if (map.getSource("buildings")) {
        const source = map.getSource("buildings") as mapboxgl.GeoJSONSource
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
          "fill-opacity": 0.7,
        },
      })

      // Add outline layer for buildings
      map.addLayer({
        id: "buildings-outline",
        type: "line",
        source: "buildings",
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 1,
          "line-opacity": 0.5,
        },
      })

      // Add click handler
      map.on("click", "buildings-fill", (e) => {
        if (!e.features || e.features.length === 0) return

        const feature = e.features[0]
        const props = feature.properties

        // Find the original building
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
    },
    [geojsonData, onBuildingClick],
  )

  // Load Mapbox GL JS dynamically
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already loaded
    if (window.mapboxgl) {
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
    script.onload = () => {
      setMapboxLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapboxLoaded || !mapContainerRef.current || mapRef.current) return

    const mapboxgl = window.mapboxgl
    mapboxgl.accessToken = MAPBOX_TOKEN

    const styleUrl =
      mapStyle === "satellite" ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/streets-v12"

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: GOMBE_CENTER,
      zoom: 12,
      pitch: 45,
      antialias: true,
    })

    map.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.addControl(new mapboxgl.ScaleControl(), "bottom-right")

    const handleMapLoad = () => {
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
    }

    map.on("load", handleMapLoad)

    mapRef.current = map

    return () => {
      map.off("load", handleMapLoad)
      map.remove()
      mapRef.current = null
      setMapLoaded(false)
    }
  }, [mapboxLoaded, mapStyle, addBuildingsLayer])

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

  if (isLoading && buildings.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center bg-card/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Loading Geospatial Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Parsing building footprints for Gombe State. This may take a moment.
          </p>
          <div className="w-48 bg-muted rounded-full h-2.5 mx-auto">
            <div className="bg-secondary h-2.5 rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Custom controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleStyle}
          className="shadow-lg bg-card/90 backdrop-blur-sm"
          title={mapStyle === "satellite" ? "Switch to Streets" : "Switch to Satellite"}
        >
          <Layers className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRecenter}
          className="shadow-lg bg-card/90 backdrop-blur-sm"
          title="Recenter Map"
        >
          <Locate className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="shadow-lg bg-card/90 backdrop-blur-sm lg:hidden"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="shadow-lg bg-card/90 backdrop-blur-sm lg:hidden"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Building Types</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CLASSIFICATION_COLORS.Residential }} />
            <span>Residential</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CLASSIFICATION_COLORS.Commercial }} />
            <span>Commercial</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CLASSIFICATION_COLORS.Industrial }} />
            <span>Industrial</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-20 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-muted-foreground">Showing</div>
        <div className="text-lg font-bold">{filteredBuildings.length.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">of {buildings.length.toLocaleString()} buildings</div>
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
