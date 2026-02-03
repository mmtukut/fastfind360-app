"use client"

import { useMemo, memo } from "react"
import { useBuildings } from "@/hooks/use-buildings"
import { StatCard } from "@/components/dashboard/stat-card"
import { BuildingTypePieChart, SizeDistributionChart } from "@/components/dashboard/overview-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { formatCurrency } from "@/lib/buildings-data"
import { Building2, Home, Store, Factory, Banknote, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Memoized chart components to prevent unnecessary re-renders
const MemoizedBuildingTypePieChart = memo(BuildingTypePieChart)
const MemoizedSizeDistributionChart = memo(SizeDistributionChart)
const MemoizedRecentActivity = memo(RecentActivity)

export default function DashboardOverview() {
  const { stats, isLoading, isError } = useBuildings({ statsOnly: true })

  // Memoize computed percentages
  const computedStats = useMemo(() => {
    if (!stats || stats.total === 0) return null

    return {
      residentialPercent: ((stats.residential / stats.total) * 100).toFixed(1),
      commercialPercent: ((stats.commercial / stats.total) * 100).toFixed(1),
      industrialPercent: ((stats.industrial / stats.total) * 100).toFixed(1),
    }
  }, [stats])

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load building data</p>
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Overview</h2>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-[#112240] px-3 py-1.5 rounded-sm border border-slate-800">
          LAST_SYNC: {new Date().toISOString().split('T')[0]} | 14:02:45 UTC
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-sm bg-slate-800/50" />
            ))}
          </>
        ) : (
          <>
            <StatCard title="Total Structures" value={stats.total.toLocaleString()} icon={Building2} variant="default" />
            <StatCard
              title="Residential"
              value={stats.residential.toLocaleString()}
              subtitle={`${computedStats?.residentialPercent}% of total volume`}
              icon={Home}
              variant="default"
              trend={{ value: 2.1, positive: true }}
            />
            <StatCard
              title="Commercial"
              value={stats.commercial.toLocaleString()}
              subtitle={`${computedStats?.commercialPercent}% of total volume`}
              icon={Store}
              variant="primary"
              trend={{ value: 5.4, positive: true }}
            />
            <StatCard
              title="Industrial"
              value={stats.industrial.toLocaleString()}
              subtitle={`${computedStats?.industrialPercent}% of total volume`}
              icon={Factory}
              variant="accent"
            />
          </>
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-sm bg-slate-800/50" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Est. Revenue Leakage"
              value={formatCurrency(stats.revenuePotential)}
              subtitle="Annual recoverable tax"
              icon={Banknote}
              variant="secondary"
            />
            <StatCard
              title="High Value Targets"
              value={stats.largeCommercial.toLocaleString()}
              subtitle="Commercial > 500m²"
              icon={Target}
              variant="default"
            />
            <StatCard
              title="AI Confidence"
              value="99.98%"
              subtitle="Classification accuracy"
              icon={Target}
              variant="default"
            />
          </>
        )}
      </div>

      {/* Charts Row - Lazy loaded */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-80 rounded-sm bg-slate-800/50" />
            <Skeleton className="h-80 rounded-sm bg-slate-800/50" />
          </>
        ) : (
          <>
            <div className="bg-[#112240]/50 border border-slate-700/50 p-6 rounded-sm backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Building Classification Distribution</h3>
              <MemoizedBuildingTypePieChart stats={stats} />
            </div>
            <div className="bg-[#112240]/50 border border-slate-700/50 p-6 rounded-sm backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Property Size Analysis</h3>
              <MemoizedSizeDistributionChart stats={stats} />
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      {!isLoading && (
        <div className="bg-[#112240]/50 border border-slate-700/50 p-6 rounded-sm backdrop-blur-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Live Intelligence Feed</h3>
          <MemoizedRecentActivity />
        </div>
      )}
    </div>
  )
}

