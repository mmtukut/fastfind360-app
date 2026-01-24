"use client"

import type React from "react"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import type { Building, FilterState } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Layers, ZoomIn, ZoomOut, Locate } from "lucide-react"

interface BuildingMapProps {
  buildings: Building[]
  filters: FilterState
  onBuildingClick: (building: Building) => void
  isLoading: boolean
}

const GOMBE_CENTER = { lat: 10.2897, lng: 11.1672 }
const CLASSIFICATION_COLORS = {
  Residential: "#2563EB",
  Commercial: "#059669",
  Industrial: "#DC2626",
}

export function BuildingMap({ buildings, filters, onBuildingClick, isLoading }: BuildingMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState({
    centerLat: GOMBE_CENTER.lat,
    centerLng: GOMBE_CENTER.lng,
    zoom: 12,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [mapMode, setMapMode] = useState<"satellite" | "map">("satellite")
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null)

  // Filter buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      if (!filters.classifications.includes(b.classification)) return false
      if (b.area_in_meters < filters.minArea || b.area_in_meters > filters.maxArea) return false
      if (b.confidence < filters.minConfidence) return false
      return true
    })
  }, [buildings, filters])

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = useCallback(
    (lat: number, lng: number, width: number, height: number) => {
      const scale = Math.pow(2, viewport.zoom) * 256
      const worldX = ((lng + 180) / 360) * scale
      const worldY =
        ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * scale

      const centerWorldX = ((viewport.centerLng + 180) / 360) * scale
      const centerWorldY =
        ((1 -
          Math.log(
            Math.tan((viewport.centerLat * Math.PI) / 180) + 1 / Math.cos((viewport.centerLat * Math.PI) / 180),
          ) /
            Math.PI) /
          2) *
        scale

      const x = worldX - centerWorldX + width / 2
      const y = worldY - centerWorldY + height / 2

      return { x, y }
    },
    [viewport],
  )

  // Draw buildings on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.fillStyle = mapMode === "satellite" ? "#1a2e44" : "#e5e7eb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = mapMode === "satellite" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw buildings (limit for performance)
    const buildingsToRender = filteredBuildings.slice(0, 50000)
    const buildingSize = Math.max(2, viewport.zoom - 8)

    buildingsToRender.forEach((building) => {
      const { x, y } = latLngToCanvas(building.latitude, building.longitude, canvas.width, canvas.height)

      if (x < -10 || x > canvas.width + 10 || y < -10 || y > canvas.height + 10) return

      ctx.fillStyle = CLASSIFICATION_COLORS[building.classification]
      ctx.globalAlpha = building === hoveredBuilding ? 1 : 0.7
      ctx.fillRect(x - buildingSize / 2, y - buildingSize / 2, buildingSize, buildingSize)
      ctx.globalAlpha = 1
    })

    // Draw center marker
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1
    ctx.stroke()
  }, [filteredBuildings, viewport, mapMode, hoveredBuilding, latLngToCanvas])

  // Handle canvas interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isDragging) {
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y

      const scale = Math.pow(2, viewport.zoom)
      const dlng = (-dx / (scale * 256)) * 360
      const dlat = (dy / (scale * 256)) * 180

      setViewport((v) => ({
        ...v,
        centerLat: Math.max(-85, Math.min(85, v.centerLat + dlat)),
        centerLng: v.centerLng + dlng,
      }))
      setLastMouse({ x: e.clientX, y: e.clientY })
    } else {
      // Check for hovered building
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const buildingSize = Math.max(2, viewport.zoom - 8)

      let found: Building | null = null
      for (const building of filteredBuildings.slice(0, 10000)) {
        const { x, y } = latLngToCanvas(building.latitude, building.longitude, canvas.width, canvas.height)
        if (Math.abs(mouseX - x) < buildingSize && Math.abs(mouseY - y) < buildingSize) {
          found = building
          break
        }
      }
      setHoveredBuilding(found)
      canvas.style.cursor = found ? "pointer" : isDragging ? "grabbing" : "grab"
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredBuilding) {
      onBuildingClick(hoveredBuilding)
    }
  }

  const handleZoom = (delta: number) => {
    setViewport((v) => ({
      ...v,
      zoom: Math.max(8, Math.min(18, v.zoom + delta)),
    }))
  }

  const handleRecenter = () => {
    setViewport({
      centerLat: GOMBE_CENTER.lat,
      centerLng: GOMBE_CENTER.lng,
      zoom: 12,
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading {buildings.length > 0 ? buildings.length.toLocaleString() : ""} buildings...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 relative bg-muted/30">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={() => handleZoom(1)} className="shadow-lg">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={() => handleZoom(-1)} className="shadow-lg">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleRecenter} className="shadow-lg">
          <Locate className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMapMode((m) => (m === "satellite" ? "map" : "satellite"))}
          className="shadow-lg"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Legend</div>
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
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-muted-foreground">Showing</div>
        <div className="text-lg font-bold">{filteredBuildings.length.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">buildings</div>
      </div>

      {/* Hovered building tooltip */}
      {hoveredBuilding && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <div className="text-xs text-muted-foreground">Hover</div>
          <div className="font-semibold">{hoveredBuilding.classification}</div>
          <div className="text-sm text-muted-foreground">{hoveredBuilding.area_in_meters.toLocaleString()} m²</div>
        </div>
      )}
    </div>
  )
}
