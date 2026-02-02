"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Target, ArrowUpRight } from "lucide-react"

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
    <Card className="w-80 glass border border-border/50 shadow-ios-lg">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-foreground text-lg">Revenue Intelligence</h3>
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Missing Revenue - Priority Alert */}
        <div className="mb-5 p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-2xl border border-destructive/20 shadow-ios hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-sm font-semibold text-destructive">Unmapped Revenue</span>
          </div>
          <div className="text-3xl font-bold text-destructive mb-1">
            ₦{(metrics.unmappedRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs font-medium text-destructive/70">
            {metrics.unmappedBuildings.toLocaleString()} properties unmapped
          </div>
        </div>

        {/* Total Potential */}
        <div className="mb-5 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Potential</span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ₦{(metrics.totalPotentialRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {metrics.totalBuildings.toLocaleString()} total properties
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
          <span className="text-sm font-medium text-foreground">Compliance Rate</span>
          <Badge
            variant="secondary"
            className={
              complianceValue > 80
                ? "bg-accent/20 text-accent border-accent/30 font-semibold"
                : complianceValue > 60
                  ? "bg-warning-orange/20 text-warning-orange border-warning-orange/30 font-semibold"
                  : "bg-destructive/20 text-destructive border-destructive/30 font-semibold"
            }
          >
            {metrics.complianceRate}%
          </Badge>
        </div>

        {/* Action Button - iOS style */}
        <div className="mt-5 pt-5 border-t border-border/30">
          <button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl shadow-ios transition-all duration-300 hover-lift flex items-center justify-center gap-2 group">
            <span>Export to Revenue Board</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <div className="text-xs text-muted-foreground text-center mt-3">
            Generate detailed property assessment report
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
