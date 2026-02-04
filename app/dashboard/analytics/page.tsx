"use client"

import { lazy, Suspense, memo } from "react"
import { useBuildings } from "@/hooks/use-buildings"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load chart components since they're heavy
const RevenueComparisonChart = lazy(() =>
  import("@/components/dashboard/analytics/revenue-chart").then((mod) => ({
    default: mod.RevenueComparisonChart,
  }))
)
const LGARevenueChart = lazy(() =>
  import("@/components/dashboard/analytics/lga-revenue-chart").then((mod) => ({ default: mod.LGARevenueChart }))
)
const DensityHeatmap = lazy(() =>
  import("@/components/dashboard/analytics/density-heatmap").then((mod) => ({ default: mod.DensityHeatmap }))
)
const CommercialAnalysis = lazy(() =>
  import("@/components/dashboard/analytics/commercial-analysis").then((mod) => ({
    default: mod.CommercialAnalysis,
  }))
)

// Simulated current tax roll (5,000 properties as per spec)
const CURRENT_TAX_ROLL = 50000000 // ₦50M

export default function AnalyticsPage() {
  const { buildings, stats, isLoading, isError } = useBuildings()

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load analytics data</p>
          <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold text-blue-400 uppercase tracking-widest">System Status: Active</h1>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Revenue Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">Comprehensive analysis of property tax potential across Gombe State</p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-[#112240] px-3 py-1.5 rounded-sm border border-slate-800">
          LAST_SYNC: {new Date().toISOString().split('T')[0]} | {new Date().toTimeString().split(' ')[0]} UTC
        </div>
      </div>

      {/* Revenue Comparison */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <RevenueComparisonChart currentRevenue={CURRENT_TAX_ROLL} potentialRevenue={stats.revenuePotential} />
        </Suspense>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </>
        ) : (
          <>
            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
              <DensityHeatmap buildings={buildings} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
              <CommercialAnalysis buildings={buildings} stats={stats} />
            </Suspense>
          </>
        )}
      </div>

      {/* LGA Breakdown */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <LGARevenueChart stats={stats} />
        </Suspense>
      )}
    </div>
  )
}

