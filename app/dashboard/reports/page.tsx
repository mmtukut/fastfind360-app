"use client"

import { useBuildings } from "@/hooks/use-buildings"
import { ReportGenerator } from "@/components/dashboard/reports/report-generator"
import { RecentReports } from "@/components/dashboard/reports/recent-reports"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  const { stats, isLoading, isError } = useBuildings()

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Generate and download custom reports for stakeholders.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Report Generator */}
        {isLoading ? (
          <Skeleton className="h-[600px] rounded-xl" />
        ) : (
          <ReportGenerator
            stats={stats}
            onGenerate={(config) => {
              console.log("Report generated:", config)
            }}
          />
        )}

        {/* Recent Reports */}
        <RecentReports />
      </div>
    </div>
  )
}
