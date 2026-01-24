"use client"

import { useBuildings } from "@/hooks/use-buildings"
import { StatCard } from "@/components/dashboard/stat-card"
import { BuildingTypePieChart, SizeDistributionChart } from "@/components/dashboard/overview-charts"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { formatCurrency } from "@/lib/buildings-data"
import { Building2, Home, Store, Factory, Banknote, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardOverview() {
  const { stats, isLoading, isError } = useBuildings()

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">
            Here is an overview of your property intelligence data for Gombe State.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatCard title="Total Buildings" value={stats.total.toLocaleString()} icon={Building2} variant="primary" />
            <StatCard
              title="Residential"
              value={stats.residential.toLocaleString()}
              subtitle={`${((stats.residential / stats.total) * 100).toFixed(1)}%`}
              icon={Home}
              variant="secondary"
            />
            <StatCard
              title="Commercial"
              value={stats.commercial.toLocaleString()}
              subtitle={`${((stats.commercial / stats.total) * 100).toFixed(1)}%`}
              icon={Store}
              variant="accent"
            />
            <StatCard
              title="Industrial"
              value={stats.industrial.toLocaleString()}
              subtitle={`${((stats.industrial / stats.total) * 100).toFixed(1)}%`}
              icon={Factory}
            />
          </>
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Revenue Potential"
              value={formatCurrency(stats.revenuePotential)}
              subtitle="Annual property tax estimate"
              icon={Banknote}
              variant="accent"
            />
            <StatCard
              title="Large Commercial"
              value={stats.largeCommercial.toLocaleString()}
              subtitle="Buildings over 500m²"
              icon={Store}
              variant="secondary"
            />
            <StatCard
              title="Model Accuracy"
              value="99.998%"
              subtitle="Classification confidence"
              icon={Target}
              variant="primary"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </>
        ) : (
          <>
            <BuildingTypePieChart stats={stats} />
            <SizeDistributionChart stats={stats} />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
