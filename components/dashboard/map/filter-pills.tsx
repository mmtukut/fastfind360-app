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
    <div className="flex items-center gap-4 text-slate-300">
      {/* Main Filters */}
      <div className="flex items-center gap-2">
        <Button
          variant={filters.showOnlyUnmapped ? "default" : "outline"}
          size="sm"
          onClick={toggleUnmappedOnly}
          className={filters.showOnlyUnmapped
            ? "bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-sm font-bold tracking-wide"
            : "bg-slate-900/50 hover:bg-slate-800 text-slate-300 border-slate-700 rounded-sm"}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          TARGET UNMAPPED
        </Button>

        <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-sm text-xs font-mono text-slate-400">
          <span className="text-white font-bold">{stats.residential + stats.commercial + stats.industrial}</span> STRUCTS
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-slate-400 hover:text-white rounded-sm"
      >
        <Filter className="w-4 h-4 mr-2" />
        FILTERS
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="flex items-center gap-6 pl-4 border-l border-slate-700">
          {/* High Value Targets */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-slate-500">Min Value:</span>
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
            <span className="text-xs font-mono text-blue-400">
              ₦{((filters.minValue || 0) / 1000).toFixed(0)}K+
            </span>
          </div>

          {/* New Construction */}
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.newConstructionOnly}
              onCheckedChange={toggleNewConstruction}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-xs font-bold uppercase text-slate-500">New Construction</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="ml-auto flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-400">UNMAPPED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500"></div>
          <span className="text-emerald-400">COMPLIANT</span>
        </div>
      </div>
    </div>
  )
}
