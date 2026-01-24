"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import type { BuildingStats } from "@/lib/types"

interface OverviewChartsProps {
  stats: BuildingStats
}

export function BuildingTypePieChart({ stats }: OverviewChartsProps) {
  const data = [
    { name: "Residential", value: stats.residential, color: "#2563EB" },
    { name: "Commercial", value: stats.commercial, color: "#059669" },
    { name: "Industrial", value: stats.industrial, color: "#DC2626" },
  ]

  const total = stats.total || 1

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Building Distribution by Type</h3>
      <div className="flex items-center gap-8">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                <div className="text-sm font-medium text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SizeDistributionChart({ stats }: OverviewChartsProps) {
  // Simulated size distribution based on stats
  const residentialAvg = stats.residential > 0 ? 100 : 0
  const commercialAvg = stats.commercial > 0 ? 350 : 0
  const industrialAvg = stats.industrial > 0 ? 1200 : 0

  const data = [
    { range: "0-100m²", count: Math.round(stats.residential * 0.6), fill: "#2563EB" },
    { range: "100-200m²", count: Math.round(stats.residential * 0.3), fill: "#3B82F6" },
    { range: "200-500m²", count: Math.round(stats.commercial * 0.7), fill: "#059669" },
    { range: "500-1000m²", count: Math.round(stats.commercial * 0.3 + stats.industrial * 0.4), fill: "#10B981" },
    { range: "1000m²+", count: Math.round(stats.industrial * 0.6), fill: "#DC2626" },
  ]

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Building Size Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), "Buildings"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
