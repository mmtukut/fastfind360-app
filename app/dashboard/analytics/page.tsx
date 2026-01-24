"use client"

import { useBuildings } from "@/hooks/use-buildings"
import { RevenueComparisonChart } from "@/components/dashboard/analytics/revenue-chart"
import { LGARevenueChart } from "@/components/dashboard/analytics/lga-revenue-chart"
import { DensityHeatmap } from "@/components/dashboard/analytics/density-heatmap"
import { CommercialAnalysis } from "@/components/dashboard/analytics/commercial-analysis"
import { Skeleton } from "@/components/ui/skeleton"

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analysis of property tax potential across Gombe State.</p>
      </div>

      {/* Revenue Comparison */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <RevenueComparisonChart currentRevenue={CURRENT_TAX_ROLL} potentialRevenue={stats.revenuePotential} />
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
            <DensityHeatmap buildings={buildings} />
            <CommercialAnalysis buildings={buildings} stats={stats} />
          </>
        )}
      </div>

      {/* LGA Breakdown */}
      {isLoading ? <Skeleton className="h-96 rounded-xl" /> : <LGARevenueChart stats={stats} />}
    </div>
  )
}
