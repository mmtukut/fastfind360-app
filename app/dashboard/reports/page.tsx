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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold text-blue-400 uppercase tracking-widest">System Status: Active</h1>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Audit Reports</h2>
          <p className="text-slate-400 text-sm mt-1">Generate and download custom reports for stakeholders</p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-[#112240] px-3 py-1.5 rounded-sm border border-slate-800">
          LAST_SYNC: {new Date().toISOString().split('T')[0]} | {new Date().toTimeString().split(' ')[0]} UTC
        </div>
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
