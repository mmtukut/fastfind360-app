"use client"

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { Building, BuildingStats } from "@/lib/types"
import { formatCurrency } from "@/lib/buildings-data"

interface CommercialAnalysisProps {
  buildings: Building[]
  stats: BuildingStats
}

export function CommercialAnalysis({ buildings, stats }: CommercialAnalysisProps) {
  // Get commercial buildings for scatter plot
  const commercialBuildings = buildings
    .filter((b) => b.classification === "Commercial")
    .slice(0, 500) // Limit for performance
    .map((b) => ({
      area: b.area_in_meters,
      value: b.estimated_tax || 0,
      id: b.id,
    }))

  // Calculate high-value targets
  const highValueTargets = buildings.filter((b) => b.classification === "Commercial" && (b.estimated_tax || 0) > 500000)

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-2">Commercial Property Analysis</h3>
      <p className="text-sm text-muted-foreground mb-6">Size vs estimated annual tax value</p>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <XAxis
              type="number"
              dataKey="area"
              name="Area"
              unit=" m²"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              type="number"
              dataKey="value"
              name="Est. Tax"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "area" ? `${value.toLocaleString()} m²` : formatCurrency(value),
                name === "area" ? "Area" : "Est. Tax",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Scatter data={commercialBuildings} fill="#059669">
              {commercialBuildings.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 500000 ? "#DC2626" : "#059669"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* High-value targets summary */}
      <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-destructive">High-Value Targets ({">"}₦500K/year)</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {stats.largeCommercial.toLocaleString()} properties
            </div>
            <div className="text-xs text-muted-foreground mt-1">Concentrated along major roads</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Priority for</div>
            <div className="text-sm font-medium text-destructive">Tax Enforcement</div>
          </div>
        </div>
      </div>
    </div>
  )
}
