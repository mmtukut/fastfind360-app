"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, TrendingUp, Building } from "lucide-react"
import type { FilterState, BuildingStats } from "@/lib/types"

interface FilterPillsProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  stats: BuildingStats
}

export function FilterPills({ filters, onFilterChange, stats }: FilterPillsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const toggleUnmappedOnly = () => {
    onFilterChange({
      ...filters,
      showOnlyUnmapped: !filters.showOnlyUnmapped
    })
  }

  const updateMinValue = (value: number[]) => {
    onFilterChange({
      ...filters,
      minValue: value[0] || 0
    })
  }

  const toggleNewConstruction = () => {
    onFilterChange({
      ...filters,
      newConstructionOnly: !filters.newConstructionOnly
    })
  }

  return (
    <div className="flex items-center gap-4">
      {/* Main Filters */}
      <div className="flex items-center gap-2">
        <Button
          variant={filters.showOnlyUnmapped ? "default" : "outline"}
          size="sm"
          onClick={toggleUnmappedOnly}
          className="bg-red-600 hover:bg-red-700 text-white border-red-600"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Show Opportunities Only
        </Button>
        
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          {stats.residential + stats.commercial + stats.industrial} Buildings
        </Badge>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-gray-600"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="flex items-center gap-6 pl-4 border-l border-gray-300">
          {/* High Value Targets */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Min Value:</span>
            <div className="w-32">
              <Slider
                value={[filters.minValue || 0]}
                min={0}
                max={1000000}
                step={50000}
                onValueChange={updateMinValue}
                className="w-full"
              />
            </div>
            <span className="text-sm text-gray-600">
              ₦{((filters.minValue || 0) / 1000).toFixed(0)}K
            </span>
          </div>

          {/* New Construction */}
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.newConstructionOnly}
              onCheckedChange={toggleNewConstruction}
            />
            <span className="text-sm font-medium text-gray-700">New Construction</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">Unmapped</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-20 border border-green-500"></div>
          <span className="text-sm text-gray-600">Compliant</span>
        </div>
      </div>
    </div>
  )
}
