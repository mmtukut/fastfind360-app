"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import type { Building } from "@/lib/types"

interface DensityHeatmapProps {
  buildings: Building[]
}

const GOMBE_CENTER = { lat: 10.2897, lng: 11.1672 }

// Hotspot data based on spec
const hotspots = [
  { name: "Gombe Metropolis", buildings: 45000, lat: 10.2897, lng: 11.1672 },
  { name: "Billiri", buildings: 12000, lat: 10.0167, lng: 11.2 },
  { name: "Kaltungo", buildings: 8500, lat: 9.8167, lng: 11.3167 },
  { name: "Deba", buildings: 6500, lat: 10.2333, lng: 11.3833 },
  { name: "Funakaye", buildings: 5800, lat: 10.55, lng: 11.05 },
]

export function DensityHeatmap({ buildings }: DensityHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState({
    centerLat: GOMBE_CENTER.lat,
    centerLng: GOMBE_CENTER.lng,
    zoom: 10,
  })

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

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Background
    ctx.fillStyle = "#1a2e44"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.1)"
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

    // Draw heatmap circles for hotspots
    hotspots.forEach((hotspot) => {
      const { x, y } = latLngToCanvas(hotspot.lat, hotspot.lng, canvas.width, canvas.height)
      const intensity = hotspot.buildings / 45000 // Normalize to max
      const radius = 30 + intensity * 80

      // Create radial gradient for heatmap effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

      if (intensity > 0.7) {
        // High density - red
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.8)")
        gradient.addColorStop(0.5, "rgba(251, 191, 36, 0.5)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      } else if (intensity > 0.3) {
        // Medium density - yellow
        gradient.addColorStop(0, "rgba(251, 191, 36, 0.7)")
        gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.3)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      } else {
        // Low density - blue
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.6)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw labels
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    hotspots.forEach((hotspot) => {
      const { x, y } = latLngToCanvas(hotspot.lat, hotspot.lng, canvas.width, canvas.height)

      ctx.fillStyle = "white"
      ctx.fillText(hotspot.name, x, y - 5)
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.font = "10px Inter, sans-serif"
      ctx.fillText(`${(hotspot.buildings / 1000).toFixed(1)}k`, x, y + 10)
      ctx.font = "12px Inter, sans-serif"
    })
  }, [buildings, viewport, latLngToCanvas])

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-2">Building Density Heatmap</h3>
      <p className="text-sm text-muted-foreground mb-4">Concentration of detected buildings across Gombe State</p>

      <div ref={containerRef} className="h-80 rounded-lg overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg p-2">
          <div className="text-xs font-medium mb-1.5">Density</div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-3 rounded-sm bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#EF4444]" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Hotspots List */}
      <div className="mt-4 space-y-2">
        <div className="text-sm font-medium">Identified Hotspots</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {hotspots.slice(0, 3).map((hotspot) => (
            <div key={hotspot.name} className="p-2 bg-muted rounded-lg">
              <div className="text-sm font-medium">{hotspot.name}</div>
              <div className="text-xs text-muted-foreground">{hotspot.buildings.toLocaleString()}+ buildings</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
