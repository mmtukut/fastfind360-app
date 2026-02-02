"use client"

import { useEffect, useState, useMemo, useCallback, useRef, memo } from "react"
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api"
import type { Building } from "@/lib/types"
import { Loader2, AlertCircle } from "lucide-react"
import {
    filterByViewport,
    simplifyPolygon,
    getEpsilonForZoom,
    debounce,
    type Bounds,
    type LatLng,
} from "@/lib/map-utils"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "600px",
}

// Gombe State, Nigeria coordinates
const center = {
    lat: 10.2897,
    lng: 11.1672,
}

// Classification colors matching your design system
const classificationColors: Record<string, string> = {
    Residential: "#3B82F6", // Blue
    Commercial: "#F59E0B", // Orange
    Industrial: "#8B5CF6", // Purple
    default: "#9CA3AF", // Gray
}

// Geometry parsing helpers
type Position = [number, number]

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

const parseWktPolygon = (value: string) => {
    const body = value.replace(/^POLYGON\s*\(\(/i, "").replace(/\)\)\s*$/i, "")
    if (!body) return null
    return parseWktRing(body)
}

const parseGeometry = (geometry?: string): Position[] | null => {
    if (!geometry) return null
    const trimmed = geometry.trim()
    if (!trimmed) return null

    // Try JSON parsing first
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed)
            if (parsed.type === "Polygon" && parsed.coordinates?.[0]) {
                return parsed.coordinates[0]
            }
            if (Array.isArray(parsed) && parsed[0]) {
                return parsed[0]
            }
        } catch {
            // Fall through to WKT parsing
        }
    }

    // Try WKT parsing
    if (trimmed.toUpperCase().startsWith("POLYGON")) {
        return parseWktPolygon(trimmed)
    }

    return null
}

interface BuildingPolygon {
    id: string
    paths: LatLng[]
    building: Building
    color: string
    isUnmapped: boolean
    originalPaths?: LatLng[]
}

interface GoogleSatelliteMapProps {
    buildings?: Building[]
    onBuildingClick?: (building: Building) => void
}

// Memoized Polygon component to prevent unnecessary re-renders
const MemoizedPolygon = memo(
    ({
        polygon,
        isSelected,
        onClick,
    }: {
        polygon: BuildingPolygon
        isSelected: boolean
        onClick: () => void
    }) => {
        return (
            <Polygon
                paths={polygon.paths}
                options={{
                    fillColor: polygon.color,
                    fillOpacity: polygon.isUnmapped ? 0.65 : 0.35,
                    strokeColor: isSelected ? "#FDE047" : "#FFFFFF",
                    strokeOpacity: isSelected ? 1 : 0.35,
                    strokeWeight: isSelected ? 3 : 1,
                    clickable: true,
                }}
                onClick={onClick}
            />
        )
    },
    (prevProps, nextProps) => {
        // Custom comparison to prevent unnecessary re-renders
        return (
            prevProps.polygon.id === nextProps.polygon.id &&
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.polygon.paths.length === nextProps.polygon.paths.length
        )
    }
)

MemoizedPolygon.displayName = "MemoizedPolygon"

export function GoogleSatelliteMap({ buildings = [], onBuildingClick }: GoogleSatelliteMapProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null)
    const [viewport, setViewport] = useState<Bounds | null>(null)
    const [zoom, setZoom] = useState(13)
    const [visiblePolygons, setVisiblePolygons] = useState<BuildingPolygon[]>([])
    const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places" as any, "geometry" as any],
    })

    const mapOptions = useMemo<google.maps.MapOptions | null>(() => {
        if (!isLoaded) return null
        return {
            mapTypeId: "satellite" as google.maps.MapTypeId,
            zoom: 13,
            tilt: 0,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
            },
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
            },
        }
    }, [isLoaded])

    // Parse and cache building geometries with memoization
    const buildingPolygons = useMemo(() => {
        console.time("Parse geometries")
        const polygons = buildings
            .map((building) => {
                const coords = parseGeometry(building.geometry)
                if (!coords || coords.length === 0) return null

                // Convert to Google Maps LatLng format
                const paths = coords.map((pos) => ({
                    lat: pos[1], // latitude
                    lng: pos[0], // longitude
                }))

                const color = classificationColors[building.classification] || classificationColors.default
                const isUnmapped = building.confidence < 0.8

                return {
                    id: building.id,
                    paths,
                    originalPaths: paths, // Keep original for high zoom
                    building,
                    color,
                    isUnmapped,
                }
            })
            .filter((poly): poly is NonNullable<typeof poly> => poly !== null)

        console.timeEnd("Parse geometries")
        console.log(`Parsed ${polygons.length} building polygons`)
        return polygons
    }, [buildings])

    // Update visible polygons based on viewport and zoom
    const updateVisiblePolygons = useCallback(() => {
        if (!viewport || !map) {
            setVisiblePolygons(buildingPolygons)
            return
        }

        console.time("Filter and simplify")

        // Filter by viewport
        const inViewport = filterByViewport(buildingPolygons, viewport, 0.2)
        console.log(`Filtered to ${inViewport.length} polygons in viewport`)

        // Apply Level of Detail (LOD) - simplify based on zoom
        const epsilon = getEpsilonForZoom(zoom)
        const shouldSimplify = zoom < 15 // Only simplify at lower zoom levels

        const processed = inViewport.map((poly) => {
            if (!shouldSimplify || !poly.originalPaths) {
                return poly
            }

            // Simplify polygon for better performance
            const simplified = simplifyPolygon(poly.originalPaths, epsilon)

            return {
                ...poly,
                paths: simplified,
            }
        })

        console.timeEnd("Filter and simplify")
        console.log(`Rendering ${processed.length} polygons (zoom: ${zoom}, simplified: ${shouldSimplify})`)

        setVisiblePolygons(processed)
    }, [viewport, zoom, buildingPolygons, map])

    // Debounced viewport update
    const debouncedUpdate = useMemo(
        () => debounce(updateVisiblePolygons, 150),
        [updateVisiblePolygons]
    )

    // Update viewport when map bounds or zoom changes
    const handleBoundsChanged = useCallback(() => {
        if (!map) return

        const bounds = map.getBounds()
        const currentZoom = map.getZoom() || 13

        if (bounds) {
            const ne = bounds.getNorthEast()
            const sw = bounds.getSouthWest()

            setViewport({
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng(),
            })
            setZoom(currentZoom)

            // Defer update to prevent blocking
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current)
            }
            updateTimeoutRef.current = setTimeout(() => {
                debouncedUpdate()
            }, 100)
        }
    }, [map, debouncedUpdate])

    // Set up map event listeners
    useEffect(() => {
        if (!map) return

        const idleListener = map.addListener("idle", handleBoundsChanged)
        const zoomListener = map.addListener("zoom_changed", handleBoundsChanged)

        // Initial update
        handleBoundsChanged()

        return () => {
            google.maps.event.removeListener(idleListener)
            google.maps.event.removeListener(zoomListener)
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current)
            }
        }
    }, [map, handleBoundsChanged])

    // Initial load - show all polygons
    useEffect(() => {
        if (buildingPolygons.length > 0 && visiblePolygons.length === 0) {
            setVisiblePolygons(buildingPolygons)
        }
    }, [buildingPolygons, visiblePolygons.length])

    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance)
    }, [])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    const handlePolygonClick = useCallback(
        (building: Building) => {
            setSelectedBuildingId(building.id)
            if (onBuildingClick) {
                onBuildingClick(building)
            }
        },
        [onBuildingClick]
    )

    if (loadError) {
        return (
            <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-ios-lg flex items-center justify-center bg-background/95">
                <div className="text-center max-w-md px-6">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Map Loading Error</h3>
                    <p className="text-sm text-muted-foreground">
                        Failed to load Google Maps. Please check your internet connection.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Error: {loadError.message}</p>
                </div>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-ios-lg flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="glass px-8 py-6 rounded-2xl shadow-ios-lg flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-foreground">Loading Google Maps...</p>
                    <p className="text-xs text-muted-foreground">Initializing satellite imagery</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-ios-lg">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions || {}}
            >
                {/* Render visible building polygons only */}
                {visiblePolygons.map((poly) => (
                    <MemoizedPolygon
                        key={poly.id}
                        polygon={poly}
                        isSelected={selectedBuildingId === poly.id}
                        onClick={() => handlePolygonClick(poly.building)}
                    />
                ))}
            </GoogleMap>

            {/* Building count overlay */}
            <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-xl shadow-ios border border-border/50">
                <p className="text-xs font-semibold text-foreground">
                    {visiblePolygons.length.toLocaleString()} / {buildingPolygons.length.toLocaleString()}{" "}
                    Buildings
                </p>
                <p className="text-xs text-muted-foreground">Zoom: {zoom}</p>
            </div>
        </div>
    )
}
