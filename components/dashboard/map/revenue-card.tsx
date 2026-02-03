"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Target, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RevenueMetrics {
  totalBuildings: number
  unmappedBuildings: number
  totalPotentialRevenue: number
  unmappedRevenue: number
  complianceRate: string
}

interface RevenueCardProps {
  metrics: RevenueMetrics
}

export function RevenueCard({ metrics }: RevenueCardProps) {
  const complianceValue = parseFloat(metrics.complianceRate)

  return (
    <Card className="w-80 bg-[#112240]/90 backdrop-blur-md border border-slate-700 shadow-2xl rounded-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Revenue Intelligence</h3>
          <div className="w-8 h-8 border border-blue-500/30 bg-blue-500/10 rounded-sm flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Missing Revenue - Priority Alert */}
        <div className="mb-5 p-4 bg-red-950/30 border border-red-900/50 rounded-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wide">LEAKAGE DETECTED</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1 relative z-10">
            ₦{(metrics.unmappedRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs font-medium text-red-400/80 relative z-10">
            {metrics.unmappedBuildings.toLocaleString()} properties unmapped
          </div>
          {/* Background stripe effect */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 50%, #ef4444 50%, #ef4444 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
        </div>

        {/* Total Potential */}
        <div className="mb-5 p-3 border-l-2 border-slate-600 pl-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Total Potential</span>
            <span className="text-xs font-mono text-slate-500">{metrics.totalBuildings.toLocaleString()} structs</span>
          </div>
          <div className="text-xl font-mono font-bold text-blue-400">
            ₦{(metrics.totalPotentialRevenue / 1000000).toFixed(1)}M
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/50 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase">Compliance Rate</span>
          <div className={cn(
            "text-sm font-mono font-bold px-2 py-0.5 rounded-sm border",
            complianceValue > 80 ? "text-emerald-400 border-emerald-900 bg-emerald-900/20" :
              complianceValue > 60 ? "text-yellow-400 border-yellow-900 bg-yellow-900/20" :
                "text-red-400 border-red-900 bg-red-900/20"
          )}>
            {metrics.complianceRate}%
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-700">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-sm transition-all flex items-center justify-center gap-2 group border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <span>Generate Report</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
