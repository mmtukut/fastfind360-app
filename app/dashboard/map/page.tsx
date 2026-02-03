"use client"

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"
import { useBuildings } from "@/hooks/use-buildings"
import { RevenueCard } from "@/components/dashboard/map/revenue-card"
import { FilterPills } from "@/components/dashboard/map/filter-pills"
import { GoogleSatelliteMap } from "@/components/dashboard/map/google-satellite-map"
import type { Building, FilterState } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load the modal since it's only shown on click
const PropertyModal = lazy(() =>
  import("@/components/dashboard/map/property-modal").then((mod) => ({ default: mod.PropertyModal }))
)

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
    showOnlyUnmapped: false,
    minValue: 0,
    newConstructionOnly: false,
  })

  // Memoize filtered buildings to prevent recalculation
  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      // Apply filters
      if (!filters.classifications.includes(building.classification)) return false
      if (building.area_in_meters < filters.minArea || building.area_in_meters > filters.maxArea) return false
      if (building.confidence < filters.minConfidence) return false
      if (filters.showOnlyUnmapped && building.confidence >= 0.8) return false
      if (filters.minValue && (building.estimated_tax || 0) < filters.minValue) return false

      return true
    })
  }, [buildings, filters])

  // Calculate revenue metrics with memoization
  const revenueMetrics = useMemo(() => {
    const totalBuildings = filteredBuildings.length
    const unmappedBuildings = filteredBuildings.filter((b) => b.confidence < 0.8)
    const totalPotentialRevenue = filteredBuildings.reduce((sum, b) => sum + (b.estimated_tax ?? 0), 0)
    const unmappedRevenue = unmappedBuildings.reduce((sum, b) => sum + (b.estimated_tax ?? 0), 0)

    return {
      totalBuildings,
      unmappedBuildings: unmappedBuildings.length,
      totalPotentialRevenue,
      unmappedRevenue,
      complianceRate: totalBuildings > 0 ? (((totalBuildings - unmappedBuildings.length) / totalBuildings) * 100).toFixed(1) : "0",
    }
  }, [filteredBuildings])

  const handleBuildingClick = useCallback((building: Building) => {
    setSelectedBuilding(building)
    setModalOpen(true)
  }, [])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Premium Header with Revenue Metrics */}
      <div className="bg-[#112240] border-b border-slate-800 px-6 py-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h1 className="text-lg font-bold text-white uppercase tracking-wider">Property Intelligence Map</h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              SAT_IMG_SOURCE: SENTINEL-2 | UPDATED: {new Date().toISOString().split('T')[0]}
            </p>
          </div>

          <div className="flex items-center gap-8 font-mono">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Total Revenue Potential</p>
              <p className="text-xl font-bold text-blue-400">
                ₦{(revenueMetrics.totalPotentialRevenue / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Unmapped Leakage</p>
              <p className="text-xl font-bold text-red-500">
                ₦{(revenueMetrics.unmappedRevenue / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Compliance</p>
              <p className="text-xl font-bold text-emerald-400">{revenueMetrics.complianceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="bg-[#0A192F] border-b border-slate-800 px-6 py-2">
        <FilterPills filters={filters} onFilterChange={handleFilterChange} stats={stats} />
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative bg-[#0d1b33]">
        {/* Google Maps Component */}
        <div className="absolute inset-0 border-none">
          {isLoading ? (
            <Skeleton className="w-full h-full min-h-[600px]" />
          ) : (
            <GoogleSatelliteMap buildings={filteredBuildings} onBuildingClick={handleBuildingClick} />
          )}
        </div>
        {/* Revenue Card Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <RevenueCard metrics={revenueMetrics} />
        </div>
      </div>

      {/* Property Modal - Lazy loaded */}
      <Suspense fallback={null}>
        {modalOpen && <PropertyModal building={selectedBuilding} open={modalOpen} onClose={handleCloseModal} />}
      </Suspense>
    </div>
  )
}

