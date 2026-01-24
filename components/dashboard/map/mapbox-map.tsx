"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Building, FilterState } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Layers, Locate } from "lucide-react"

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q"

interface MapboxMapProps {
  buildings: Building[]
  filters: FilterState
  onBuildingClick: (building: Building) => void
  isLoading: boolean
}

const GOMBE_CENTER: [number, number] = [11.1672, 10.2897] // [lng, lat]

const CLASSIFICATION_COLORS: Record<string, string> = {
  Residential: "#2563EB",
  Commercial: "#059669",
  Industrial: "#DC2626",
}

export function MapboxMap({ buildings, filters, onBuildingClick, isLoading }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState<"satellite" | "streets">("satellite")

  // Filter buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      if (!filters.classifications.includes(b.classification)) return false
      if (b.area_in_meters < filters.minArea || b.area_in_meters > filters.maxArea) return false
      if (b.confidence < filters.minConfidence) return false
      return true
    })
  }, [buildings, filters])

  // Convert buildings to GeoJSON
  const geojsonData = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: filteredBuildings.slice(0, 100000).map((building) => ({
        type: "Feature" as const,
        properties: {
          id: building.id,
          classification: building.classification,
          area: building.area_in_meters,
          confidence: building.confidence,
          tax: building.estimated_tax,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [building.longitude, building.latitude],
        },
      })),
    }
  }, [filteredBuildings])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        mapStyle === "satellite"
          ? "mapbox://styles/mapbox/satellite-streets-v12"
          : "mapbox://styles/mapbox/streets-v12",
      center: GOMBE_CENTER,
      zoom: 10,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right")

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update map style
  useEffect(() => {
    if (!map.current) return

    const styleUrl =
      mapStyle === "satellite" ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/streets-v12"

    map.current.setStyle(styleUrl)

    // Re-add source and layers after style change
    map.current.once("style.load", () => {
      addBuildingsLayer()
    })
  }, [mapStyle])

  // Add buildings layer function
  const addBuildingsLayer = () => {
    if (!map.current) return

    // Remove existing source/layers if they exist
    if (map.current.getSource("buildings")) {
      map.current.removeLayer("buildings-heat")
      map.current.removeLayer("buildings-points")
      map.current.removeSource("buildings")
    }

    // Add source
    map.current.addSource("buildings", {
      type: "geojson",
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })

    // Add heatmap layer for zoomed out view
    map.current.addLayer({
      id: "buildings-heat",
      type: "heatmap",
      source: "buildings",
      maxzoom: 12,
      paint: {
        "heatmap-weight": ["interpolate", ["linear"], ["get", "area"], 0, 0, 1000, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 12, 3],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(33,102,172,0)",
          0.2,
          "rgb(103,169,207)",
          0.4,
          "rgb(209,229,240)",
          0.6,
          "rgb(253,219,199)",
          0.8,
          "rgb(239,138,98)",
          1,
          "rgb(178,24,43)",
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 12, 20],
        "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 0],
      },
    })

    // Add circle layer for individual buildings when zoomed in
    map.current.addLayer({
      id: "buildings-points",
      type: "circle",
      source: "buildings",
      minzoom: 10,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 14, 4, 18, 8],
        "circle-color": [
          "match",
          ["get", "classification"],
          "Residential",
          CLASSIFICATION_COLORS.Residential,
          "Commercial",
          CLASSIFICATION_COLORS.Commercial,
          "Industrial",
          CLASSIFICATION_COLORS.Industrial,
          "#888888",
        ],
        "circle-opacity": 0.8,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": 0.5,
      },
    })

    // Add click handler
    map.current.on("click", "buildings-points", (e) => {
      if (!e.features || e.features.length === 0) return

      const feature = e.features[0]
      const props = feature.properties

      // Find the original building
      const building = buildings.find((b) => b.id === props?.id)
      if (building) {
        onBuildingClick(building)
      }
    })

    // Change cursor on hover
    map.current.on("mouseenter", "buildings-points", () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer"
    })

    map.current.on("mouseleave", "buildings-points", () => {
      if (map.current) map.current.getCanvas().style.cursor = ""
    })
  }

  // Update buildings data
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const source = map.current.getSource("buildings") as mapboxgl.GeoJSONSource
    if (source) {
      source.setData(geojsonData)
    } else {
      addBuildingsLayer()
    }
  }, [geojsonData, mapLoaded])

  const handleZoomIn = () => {
    map.current?.zoomIn()
  }

  const handleZoomOut = () => {
    map.current?.zoomOut()
  }

  const handleRecenter = () => {
    map.current?.flyTo({
      center: GOMBE_CENTER,
      zoom: 10,
      duration: 1500,
    })
  }

  const toggleStyle = () => {
    setMapStyle((s) => (s === "satellite" ? "streets" : "satellite"))
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading buildings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="absolute inset-0" />

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
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Building Types</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Residential }} />
            <span>Residential ({filters.classifications.includes("Residential") ? "On" : "Off"})</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Commercial }} />
            <span>Commercial ({filters.classifications.includes("Commercial") ? "On" : "Off"})</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CLASSIFICATION_COLORS.Industrial }} />
            <span>Industrial ({filters.classifications.includes("Industrial") ? "On" : "Off"})</span>
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
