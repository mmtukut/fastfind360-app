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
    <div className="space-y-6">
      {/* Classification */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Classification</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="residential"
              checked={localFilters.classifications.includes("Residential")}
              onCheckedChange={() => handleClassificationToggle("Residential")}
            />
            <label htmlFor="residential" className="text-sm flex items-center gap-2 cursor-pointer">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              Residential ({stats.residential.toLocaleString()})
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="commercial"
              checked={localFilters.classifications.includes("Commercial")}
              onCheckedChange={() => handleClassificationToggle("Commercial")}
            />
            <label htmlFor="commercial" className="text-sm flex items-center gap-2 cursor-pointer">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Commercial ({stats.commercial.toLocaleString()})
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="industrial"
              checked={localFilters.classifications.includes("Industrial")}
              onCheckedChange={() => handleClassificationToggle("Industrial")}
            />
            <label htmlFor="industrial" className="text-sm flex items-center gap-2 cursor-pointer">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              Industrial ({stats.industrial.toLocaleString()})
            </label>
          </div>
        </div>
      </div>

      {/* Size Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Size Range: {localFilters.minArea}m² - {localFilters.maxArea}m²
        </Label>
        <Slider
          value={[localFilters.minArea, localFilters.maxArea]}
          min={0}
          max={10000}
          step={50}
          onValueChange={handleAreaChange}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0 m²</span>
          <span>10,000 m²</span>
        </div>
      </div>

      {/* Confidence */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Min Confidence: {(localFilters.minConfidence * 100).toFixed(0)}%
        </Label>
        <Slider
          value={[localFilters.minConfidence]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(v) => handleConfidenceChange(v)}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Location Search */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Location</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={localFilters.searchLocation}
            onChange={(e) => {
              const newFilters = { ...localFilters, searchLocation: e.target.value }
              setLocalFilters(newFilters)
              onFilterChange(newFilters)
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent">
        <X className="w-4 h-4 mr-2" />
        Reset Filters
      </Button>

      {/* Export Actions */}
      <div className="pt-4 border-t border-border space-y-2">
        <Button onClick={onExportCSV} variant="outline" className="w-full bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export Filtered (CSV)
        </Button>
        <Button
          onClick={onGenerateReport}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report (PDF)
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="hidden lg:block w-80 bg-card border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h2>
        </div>
        <div className="p-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="lg:hidden fixed bottom-20 right-4 z-40 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            size="lg"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-8">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
