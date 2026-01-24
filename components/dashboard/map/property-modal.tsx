"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/buildings-data"
import { Home, Store, Factory, MapPin, Ruler, Target, Banknote, Download, Flag, RefreshCw, Loader2 } from "lucide-react"
import type { Building } from "@/lib/types"

interface PropertyModalProps {
  building: Building | null
  open: boolean
  onClose: () => void
}

const classificationIcons = {
  Residential: Home,
  Commercial: Store,
  Industrial: Factory,
}

const classificationColors = {
  Residential: "bg-secondary text-secondary-foreground",
  Commercial: "bg-accent text-accent-foreground",
  Industrial: "bg-destructive text-destructive-foreground",
}

export function PropertyModal({ building, open, onClose }: PropertyModalProps) {
  const [isReclassifying, setIsReclassifying] = useState(false)
  const [reclassifyResult, setReclassifyResult] = useState<string | null>(null)

  if (!building) return null

  const Icon = classificationIcons[building.classification]

  const handleReclassify = async () => {
    setIsReclassifying(true)
    setReclassifyResult(null)

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: building.area_in_meters,
          latitude: building.latitude,
          longitude: building.longitude,
          confidence: building.confidence,
        }),
      })

      if (!response.ok) throw new Error("Classification failed")

      const result = await response.json()
      setReclassifyResult(result.classification || result.predicted_class || "Unknown")
    } catch (error) {
      console.error("Reclassify error:", error)
      setReclassifyResult("Error")
    } finally {
      setIsReclassifying(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ["ID", "Latitude", "Longitude", "Area (m²)", "Classification", "Confidence", "Est. Tax"].join(","),
      [
        building.id,
        building.latitude,
        building.longitude,
        building.area_in_meters,
        building.classification,
        building.confidence,
        building.estimated_tax,
      ].join(","),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `property-${building.id}.csv`
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${classificationColors[building.classification]}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div>Property Details</div>
              <div className="text-sm font-normal text-muted-foreground">ID: #{building.id}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Classification Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={classificationColors[building.classification]}>{building.classification}</Badge>
            <Badge variant="outline">{(building.confidence * 100).toFixed(1)}% confidence</Badge>
            {reclassifyResult && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                AI: {reclassifyResult}
              </Badge>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                Area
              </div>
              <div className="font-semibold">{building.area_in_meters.toLocaleString()} m²</div>
            </div>

            {building.perimeter && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Perimeter</div>
                <div className="font-semibold">{building.perimeter.toFixed(1)} m</div>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" />
                Confidence
              </div>
              <div className="font-semibold">{(building.confidence * 100).toFixed(1)}%</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Banknote className="w-3 h-3" />
                Est. Annual Tax
              </div>
              <div className="font-semibold text-accent">{formatCurrency(building.estimated_tax || 0)}</div>
            </div>
          </div>

          {/* Location */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" />
              Location
            </div>
            <div className="font-mono text-sm">
              <div>Lat: {building.latitude.toFixed(6)}°</div>
              <div>Lon: {building.longitude.toFixed(6)}°</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={handleReclassify}
              disabled={isReclassifying}
            >
              {isReclassifying ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Reclassify
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Flag className="w-4 h-4 mr-1" />
              Flag
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
