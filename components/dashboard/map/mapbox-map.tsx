"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { Building, FilterState } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle } from "lucide-react"

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export const classificationColors: Record<string, string> = {
  Residential: "#3B82F6",
  Commercial: "#F59E0B",
  Industrial: "#8B5CF6",
  default: "#9CA3AF",
}

type Position = [number, number]

type PolygonGeometry = {
  type: "Polygon"
  coordinates: Position[][]
}

type MultiPolygonGeometry = {
  type: "MultiPolygon"
  coordinates: Position[][][]
}

type Geometry = PolygonGeometry | MultiPolygonGeometry

type FeatureProperties = {
  id: string
  classification: Building["classification"]
  confidence: number
  area_in_meters: number
  estimated_tax?: number
  isUnmapped: boolean
}

type Feature = {
  type: "Feature"
  id: string
  geometry: Geometry
  properties: FeatureProperties
}

type FeatureCollection = {
  type: "FeatureCollection"
  features: Feature[]
}

interface MapboxMapProps {
  buildings: Building[]
  filters: FilterState
  onBuildingClick: (building: Building) => void
  isLoading?: boolean
  selectedBuildingId?: string | null
}

const toNumberPair = (pair: string): Position | null => {
  const [lng, lat] = pair.trim().split(/\s+/).map(Number)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
  return [lng, lat]
}

const parseWktRing = (ring: string): Position[] =>
  ring
    .split(",")
    .map(toNumberPair)
    .filter((coord): coord is Position => Boolean(coord))

const parseWktPolygon = (value: string): PolygonGeometry | null => {
  const body = value.replace(/^POLYGON\s*\(\(/i, "").replace(/\)\)\s*$/i, "")
  if (!body) return null
  const ring = parseWktRing(body)
  if (!ring.length) return null
  return { type: "Polygon", coordinates: [ring] }
}

const parseWktMultiPolygon = (value: string): MultiPolygonGeometry | null => {
  const body = value.replace(/^MULTIPOLYGON\s*\(\(\(/i, "").replace(/\)\)\)\s*$/i, "")
  if (!body) return null
  const polygons = body
    .split(/\)\s*,\s*\(\(/)
    .map((polygon) =>
      polygon
        .split(/\)\s*,\s*\(/)
        .map(parseWktRing)
        .filter((ring) => ring.length > 0),
    )
    .filter((rings) => rings.length > 0)

  if (!polygons.length) return null
  return { type: "MultiPolygon", coordinates: polygons }
}

const parseGeometry = (geometry?: string): Geometry | null => {
  if (!geometry) return null
  const trimmed = geometry.trim()
  if (!trimmed) return null

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed)
      if (!parsed) return null

      if (parsed.type === "Feature" && parsed.geometry) {
        if (parsed.geometry.type === "Polygon" || parsed.geometry.type === "MultiPolygon") {
          return parsed.geometry
        }
      }

      if (parsed.type === "Polygon" || parsed.type === "MultiPolygon") return parsed

      if (Array.isArray(parsed)) {
        return { type: "Polygon", coordinates: parsed as Position[][] }
      }

      if (parsed.coordinates && parsed.type) {
        if (parsed.type === "Polygon" || parsed.type === "MultiPolygon") return parsed
      }

      return null
    } catch {
      return null
    }
  }

  if (trimmed.toUpperCase().startsWith("MULTIPOLYGON")) {
    return parseWktMultiPolygon(trimmed)
  }

  if (trimmed.toUpperCase().startsWith("POLYGON")) {
    return parseWktPolygon(trimmed)
  }

  return null
}

const collectCoordinates = (geometry: Geometry): Position[] => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.flat()
  }

  return geometry.coordinates.flatMap((polygon) => polygon.flat())
}

const getGeometryCenter = (geometry: Geometry): Position => {
  const coords = collectCoordinates(geometry)
  if (!coords.length) return [0, 0]

  const [lngSum, latSum] = coords.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0],
  )

  return [lngSum / coords.length, latSum / coords.length]
}

export function MapboxMap({
  buildings,
  filters,
  onBuildingClick,
  isLoading,
  selectedBuildingId,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const onBuildingClickRef = useRef(onBuildingClick)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    onBuildingClickRef.current = onBuildingClick
  }, [onBuildingClick])

  const buildingById = useMemo(() => new Map(buildings.map((building) => [building.id, building])), [buildings])

  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      const matchesClassification =
        filters.classifications.length === 0 || filters.classifications.includes(building.classification)
      const matchesArea =
        building.area_in_meters >= filters.minArea && building.area_in_meters <= filters.maxArea
      const matchesConfidence = building.confidence >= filters.minConfidence
      const matchesUnmapped = !filters.showOnlyUnmapped || building.confidence < 0.8
      const matchesMinValue = !filters.minValue || (building.estimated_tax ?? 0) >= (filters.minValue ?? 0)

      return matchesClassification && matchesArea && matchesConfidence && matchesUnmapped && matchesMinValue
    })
  }, [buildings, filters])

  const geometryById = useMemo(() => {
    const mapping = new Map<string, Geometry>()
    filteredBuildings.forEach((building) => {
      const geometry = parseGeometry(building.geometry)
      if (geometry) mapping.set(building.id, geometry)
    })
    return mapping
  }, [filteredBuildings])

  const geojsonData = useMemo<FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: filteredBuildings.reduce<Feature[]>((acc, building) => {
        const geometry = geometryById.get(building.id)
        if (!geometry) return acc

        acc.push({
          type: "Feature",
          id: building.id,
          geometry,
          properties: {
            id: building.id,
            classification: building.classification,
            confidence: building.confidence,
            area_in_meters: building.area_in_meters,
            estimated_tax: building.estimated_tax,
            isUnmapped: building.confidence < 0.8,
          },
        })

        return acc
      }, []),
    }),
    [filteredBuildings, geometryById],
  )

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      const errorMsg = "Mapbox Access Token is missing. Please check your environment configuration."
      console.error(errorMsg)
      setMapError(errorMsg)
      return
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    if (map.current) return

    if (mapContainer.current) {
      try {
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: [11.1672, 10.2897], // Gombe State, Nigeria
          zoom: 12,
          pitch: 45,
          antialias: true,
        })

        map.current = mapInstance

        // Error handling for map loading issues
        mapInstance.on("error", (e: mapboxgl.ErrorEvent) => {
          console.error("Mapbox error:", e)
          setMapError("Failed to load map tiles. Please check your internet connection.")
        })

        mapInstance.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right")

        mapInstance.on("load", () => {
          setIsMapLoaded(true)

          mapInstance.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          })
          mapInstance.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 })
        })

        mapInstance.on("click", "buildings-fill", (event: mapboxgl.MapLayerMouseEvent) => {
          if (event.features && event.features.length > 0) {
            const feature = event.features[0]
            const id = feature.properties?.id

            if (id && buildingById.has(id)) {
              onBuildingClickRef.current(buildingById.get(id) as Building)
            }
          }
        })

        mapInstance.on("mouseenter", "buildings-fill", () => {
          mapInstance.getCanvas().style.cursor = "pointer"
        })

        mapInstance.on("mouseleave", "buildings-fill", () => {
          mapInstance.getCanvas().style.cursor = ""
        })
      } catch (initError) {
        console.error("Failed to initialize map:", initError)
      }
    }

    return () => {
      try {
        if (map.current) {
          map.current.remove()
          map.current = null
        }
      } catch (error) {
        console.warn("Error cleaning up map:", error)
        map.current = null
      }
    }
  }, [buildingById])

  useEffect(() => {
    if (!map.current || !isMapLoaded || !map.current.isStyleLoaded()) return

    const mapInstance = map.current
    const source = mapInstance.getSource("buildings") as mapboxgl.GeoJSONSource | undefined

    if (source) {
      source.setData(geojsonData as unknown as GeoJSON.FeatureCollection)
      return
    }

    mapInstance.addSource("buildings", {
      type: "geojson",
      data: geojsonData as unknown as GeoJSON.FeatureCollection,
    })

    mapInstance.addLayer({
      id: "buildings-fill",
      type: "fill",
      source: "buildings",
      paint: {
        "fill-color": [
          "match",
          ["get", "classification"],
          "Residential",
          classificationColors.Residential,
          "Commercial",
          classificationColors.Commercial,
          "Industrial",
          classificationColors.Industrial,
          classificationColors.default,
        ],
        "fill-opacity": ["case", ["get", "isUnmapped"], 0.65, 0.35],
      },
    })

    mapInstance.addLayer({
      id: "buildings-outline",
      type: "line",
      source: "buildings",
      paint: {
        "line-color": "#FFFFFF",
        "line-width": 1,
        "line-opacity": 0.35,
      },
    })
  }, [geojsonData, isMapLoaded])

  useEffect(() => {
    if (!map.current || !isMapLoaded || !map.current.isStyleLoaded()) return

    const mapInstance = map.current

    if (mapInstance.getLayer("selected-building-outline")) {
      mapInstance.removeLayer("selected-building-outline")
    }

    if (selectedBuildingId) {
      mapInstance.addLayer({
        id: "selected-building-outline",
        type: "line",
        source: "buildings",
        paint: {
          "line-color": "#FDE047",
          "line-width": 3,
          "line-opacity": 1,
        },
        filter: ["==", ["get", "id"], selectedBuildingId],
      })

      const geometry = geometryById.get(selectedBuildingId)
      const selected = buildingById.get(selectedBuildingId)

      const center = geometry
        ? getGeometryCenter(geometry)
        : selected
          ? ([selected.longitude, selected.latitude] as Position)
          : null

      if (center) {
        mapInstance.flyTo({ center, zoom: 18, pitch: 60, duration: 1200 })
      }
    }
  }, [buildingById, geometryById, isMapLoaded, selectedBuildingId])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading State with iOS-style spinner - only show during initial load */}
      {!isMapLoaded && !mapError && (
        <LoadingSpinner backdrop />
      )}

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Map Loading Error</h3>
            <p className="text-sm text-muted-foreground">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
