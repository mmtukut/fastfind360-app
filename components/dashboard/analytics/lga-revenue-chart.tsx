"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/buildings-data"
import type { BuildingStats } from "@/lib/types"

interface LGARevenueChartProps {
  stats: BuildingStats
}

// Simulated LGA data based on overall stats
function generateLGAData(stats: BuildingStats) {
  const lgas = [
    { name: "Gombe", factor: 0.35 },
    { name: "Billiri", factor: 0.12 },
    { name: "Kaltungo", factor: 0.1 },
    { name: "Funakaye", factor: 0.08 },
    { name: "Yamaltu/Deba", factor: 0.08 },
    { name: "Balanga", factor: 0.07 },
    { name: "Akko", factor: 0.06 },
    { name: "Nafada", factor: 0.05 },
    { name: "Kwami", factor: 0.05 },
    { name: "Shongom", factor: 0.04 },
  ]

  return lgas.map((lga) => ({
    name: lga.name,
    current: Math.round(50000000 * lga.factor), // Simulated current
    potential: Math.round(stats.revenuePotential * lga.factor),
  }))
}

export function LGARevenueChart({ stats }: LGARevenueChartProps) {
  const data = generateLGAData(stats)

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-2">Revenue by Local Government Area</h3>
      <p className="text-sm text-muted-foreground mb-6">Comparison of current tax roll vs detected potential</p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="current" name="Current" fill="#9CA3AF" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="potential" name="Potential" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
