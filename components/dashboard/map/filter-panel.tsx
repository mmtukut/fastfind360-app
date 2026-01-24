"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Download, FileText, Search, X } from "lucide-react"
import type { FilterState, BuildingStats } from "@/lib/types"

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  stats: BuildingStats
  onExportCSV: () => void
  onGenerateReport: () => void
}

export function FilterPanel({ filters, onFilterChange, stats, onExportCSV, onGenerateReport }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleClassificationToggle = (classification: string) => {
    const newClassifications = localFilters.classifications.includes(classification)
      ? localFilters.classifications.filter((c) => c !== classification)
      : [...localFilters.classifications, classification]

    const newFilters = { ...localFilters, classifications: newClassifications }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleAreaChange = (values: number[]) => {
    const newFilters = { ...localFilters, minArea: values[0], maxArea: values[1] }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleConfidenceChange = (values: number[]) => {
    const newFilters = { ...localFilters, minConfidence: values[0] }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      classifications: ["Residential", "Commercial", "Industrial"],
      minArea: 0,
      maxArea: 10000,
      minConfidence: 0,
      searchLocation: "",
    }
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Classification */}
      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Building Type</Label>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/20 transition-colors cursor-pointer group">
            <Checkbox
              id="residential"
              checked={localFilters.classifications.includes("Residential")}
              onCheckedChange={() => handleClassificationToggle("Residential")}
              className="border-2 border-blue-400"
            />
            <label htmlFor="residential" className="text-sm flex items-center gap-2.5 cursor-pointer flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-medium text-slate-800">Residential</span>
              <span className="text-xs text-slate-500 ml-auto font-semibold">{stats.residential.toLocaleString()}</span>
            </label>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/20 transition-colors cursor-pointer">
            <Checkbox
              id="commercial"
              checked={localFilters.classifications.includes("Commercial")}
              onCheckedChange={() => handleClassificationToggle("Commercial")}
              className="border-2 border-amber-400"
            />
            <label htmlFor="commercial" className="text-sm flex items-center gap-2.5 cursor-pointer flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-medium text-slate-800">Commercial</span>
              <span className="text-xs text-slate-500 ml-auto font-semibold">{stats.commercial.toLocaleString()}</span>
            </label>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/20 transition-colors cursor-pointer">
            <Checkbox
              id="industrial"
              checked={localFilters.classifications.includes("Industrial")}
              onCheckedChange={() => handleClassificationToggle("Industrial")}
              className="border-2 border-purple-400"
            />
            <label htmlFor="industrial" className="text-sm flex items-center gap-2.5 cursor-pointer flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="font-medium text-slate-800">Industrial</span>
              <span className="text-xs text-slate-500 ml-auto font-semibold">{stats.industrial.toLocaleString()}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Size Range */}
      <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-b from-white/50 to-white/30 border border-white/20">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Size Range</Label>
          <span className="text-sm font-semibold text-slate-900">{localFilters.minArea}m² → {localFilters.maxArea}m²</span>
        </div>
        <Slider
          value={[localFilters.minArea, localFilters.maxArea]}
          min={0}
          max={10000}
          step={50}
          onValueChange={handleAreaChange}
          className="mt-3"
        />
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>0 m²</span>
          <span>10,000 m²</span>
        </div>
      </div>

      {/* Confidence */}
      <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-b from-white/50 to-white/30 border border-white/20">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Confidence</Label>
          <span className="text-sm font-semibold text-slate-900">{(localFilters.minConfidence * 100).toFixed(0)}%</span>
        </div>
        <Slider
          value={[localFilters.minConfidence]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(v) => handleConfidenceChange(v)}
          className="mt-3"
        />
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Location Search */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Location</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
          <Input
            placeholder="Search location..."
            value={localFilters.searchLocation}
            onChange={(e) => {
              const newFilters = { ...localFilters, searchLocation: e.target.value }
              setLocalFilters(newFilters)
              onFilterChange(newFilters)
            }}
            className="pl-9 bg-white/40 border-white/20 rounded-xl text-slate-900 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-white/20 space-y-2">
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/20 text-slate-900 font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" strokeWidth={2} />
          Reset Filters
        </button>
        <button
          onClick={onExportCSV}
          className="w-full px-4 py-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-white/20 text-slate-900 font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" strokeWidth={2} />
          Export (CSV)
        </button>
        <button
          onClick={onGenerateReport}
          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" strokeWidth={2} />
          Report (PDF)
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter Panel - Modern iOS Style */}
      <div className="hidden lg:flex flex-col w-80 bg-gradient-to-b from-white/80 via-white/60 to-white/40 backdrop-blur-xl border-r border-white/30 overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/20 sticky top-0 backdrop-blur-xl bg-gradient-to-b from-white/60 to-white/40">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20">
              <Filter className="w-4 h-4 text-blue-600" strokeWidth={2} />
            </div>
            Filters
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Floating Button */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden fixed bottom-24 right-4 z-40 p-3 rounded-full shadow-xl bg-white/80 hover:bg-white/90 backdrop-blur-md border border-white/50 transition-all active:scale-95">
            <Filter className="w-6 h-6 text-blue-600" strokeWidth={2} />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-xl rounded-t-3xl border-t border-white/30">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-slate-900">Filter Buildings</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(100%-80px)] pb-8">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
