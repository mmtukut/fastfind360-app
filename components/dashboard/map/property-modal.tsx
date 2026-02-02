"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  Building as BuildingIcon, 
  MapPin, 
  Calendar, 
  TrendingUp,
  FileText,
  Camera,
  Send
} from "lucide-react"
import type { Building } from "@/lib/types"

interface PropertyModalProps {
  building: Building | null
  open: boolean
  onClose: () => void
}

export function PropertyModal({ building, open, onClose }: PropertyModalProps) {
  const [timeTravelYear, setTimeTravelYear] = useState(2024)

  if (!building) return null

  const isUnmapped = building.confidence < 0.8
  const estimatedTax = building.estimated_tax ?? 0
  const estimatedValue = estimatedTax * 200 // Rough estimation

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Property Intelligence</h2>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Plot {building.id.split('-')[1]}, Tudun Wada, Gombe
                </span>
              </div>
            </div>
            
            <Badge 
              variant="secondary" 
              className={
                isUnmapped 
                  ? "bg-red-100 text-red-800 border-red-200 animate-pulse" 
                  : "bg-green-100 text-green-800 border-green-200"
              }
            >
              {isUnmapped ? (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  UNREGISTERED
                </div>
              ) : (
                "COMPLIANT"
              )}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Travel Slider */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Time Travel Evidence</h3>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">2020</span>
              <input
                type="range"
                min="2020"
                max="2024"
                value={timeTravelYear}
                onChange={(e) => setTimeTravelYear(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium">2024</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">2020 (Empty Land)</div>
                <div className="h-24 bg-gray-200 rounded flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">2024 (Building)</div>
                <div className="h-24 bg-blue-100 rounded flex items-center justify-center">
                  <BuildingIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              AI Analysis: New construction detected. Building appears to be {timeTravelYear - 2020} years old.
            </p>
          </div>

          <Separator />

          {/* Building Details */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Building Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Building Type</p>
                <p className="font-medium">{building.classification} - AI Detected</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-medium">{building.area_in_meters.toLocaleString()} m²</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confidence Score</p>
                <p className="font-medium">{(building.confidence * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Detection Date</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financials */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Financial Analysis</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Estimated Property Value</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{estimatedValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Tax Liability</p>
                  <p className="text-xl font-bold text-red-600">
                    ₦{estimatedTax.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Potential 5-year revenue: ₦{(estimatedTax * 5).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
              <Send className="w-5 h-5 mr-2" />
              Generate Tax Notice
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Sends PDF notice to property owner and FIRS database
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Request Photo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
