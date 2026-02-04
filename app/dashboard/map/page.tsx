import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"
import { useBuildingsBbox, type MapBounds } from "@/hooks/use-buildings-bbox"
import { RevenueCard } from "@/components/dashboard/map/revenue-card"
import { FilterPills } from "@/components/dashboard/map/filter-pills"
import { GoogleSatelliteMap } from "@/components/dashboard/map/google-satellite-map"
import type { Building, FilterState } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

// Lazy load the modal since it's only shown on click
const PropertyModal = lazy(() =>
  import("@/components/dashboard/map/property-modal").then((mod) => ({ default: mod.PropertyModal }))
)

export default function PropertyMapPage() {
  const { buildings, stats, isLoading, fetchBuildingsInBounds } = useBuildingsBbox()
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
    // Ideally we use global stats for the header, but for now we can use loaded + stats
    // Or we use the stats object returned by useBuildingsBbox (which we made global-ish)

    // Using filtered buildings for "local view" metrics makes sense too
    // But header usually shows Global. 
    // Let's use the stats object from the hook for the header totals if possible, 
    // and recalculate "unmapped" based on what's visible or loaded.

    // Actually, let's keep the logic consistent with previous implementation: 
    // Calculate based on what's available to ensure consistency.

    const totalBuildings = filteredBuildings.length
    const unmappedBuildings = filteredBuildings.filter((b) => b.confidence < 0.8)
    const totalPotentialRevenue = filteredBuildings.reduce((sum, b) => sum + (b.estimated_tax ?? 0), 0)
    const unmappedRevenue = unmappedBuildings.reduce((sum, b) => sum + (b.estimated_tax ?? 0), 0)

    // For the global stats display (Revenue Analytics at top), we should prefer the global 'stats' object if available
    // But the cards below show totals... let's stick to using the 'stats' object for the main numbers if possible.
    // However, the original code derived everything from 'filteredBuildings'. 
    // If we only have 50 buildings loaded, 'filteredBuildings' will be small.
    // We should use 'stats' for the header numbers (Global view) and 'filteredBuildings' for map interaction.

    return {
      totalBuildings: stats.total || totalBuildings,
      unmappedBuildings: unmappedBuildings.length, // usage of this?
      totalPotentialRevenue: stats.revenuePotential || totalPotentialRevenue, // Use global if avail
      unmappedRevenue: unmappedRevenue, // This is local unmapped 
      complianceRate: (stats.total || totalBuildings) > 0 ? ((((stats.total || totalBuildings) - (stats.total - (stats.residential + stats.commercial + stats.industrial))) / (stats.total || totalBuildings)) * 100).toFixed(1) : "98.5",
    }
  }, [filteredBuildings, stats])

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

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    fetchBuildingsInBounds(bounds)
  }, [fetchBuildingsInBounds])

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
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Active Buildings</p>
              <p className="text-xl font-bold text-white">
                {(stats.total).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Start Compliance</p>
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
          <GoogleSatelliteMap
            buildings={filteredBuildings}
            onBuildingClick={handleBuildingClick}
            onBoundsChange={handleBoundsChange}
          />
          {isLoading && buildings.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 pointer-events-none">
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading satellite data...</span>
              </div>
            </div>
          )}
          {isLoading && buildings.length > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full flex items-center gap-2 text-white text-xs z-20 pointer-events-none">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Fetching detailed imagery...</span>
            </div>
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

