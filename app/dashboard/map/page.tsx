"use client"

import { useState } from "react"
import { useBuildings } from "@/hooks/use-buildings"
import { FilterPanel } from "@/components/dashboard/map/filter-panel"
import { MapboxMap } from "@/components/dashboard/map/mapbox-map"
import { PropertyModal } from "@/components/dashboard/map/property-modal"
import type { Building, FilterState } from "@/lib/types"

export default function PropertyMapPage() {
  const { buildings, stats, isLoading } = useBuildings()
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    classifications: ["Residential", "Commercial", "Industrial"],
    minArea: 0,
    maxArea: 10000,
    minConfidence: 0,
    searchLocation: "",
  })

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building)
    setModalOpen(true)
  }

  const handleExportCSV = () => {
    const filteredBuildings = buildings.filter((b) => {
      if (!filters.classifications.includes(b.classification)) return false
      if (b.area_in_meters < filters.minArea || b.area_in_meters > filters.maxArea) return false
      if (b.confidence < filters.minConfidence) return false
      return true
    })

    const csv = [
      ["ID", "Latitude", "Longitude", "Area (m²)", "Classification", "Confidence", "Est. Tax"].join(","),
      ...filteredBuildings.map((b) =>
        [b.id, b.latitude, b.longitude, b.area_in_meters, b.classification, b.confidence, b.estimated_tax].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fastfind360-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const handleGenerateReport = () => {
    window.location.href = "/dashboard/reports"
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col lg:flex-row -m-4 md:-m-6 lg:-m-8">
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        stats={stats}
        onExportCSV={handleExportCSV}
        onGenerateReport={handleGenerateReport}
      />
      <MapboxMap buildings={buildings} filters={filters} onBuildingClick={handleBuildingClick} isLoading={isLoading} />
      <PropertyModal building={selectedBuilding} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
