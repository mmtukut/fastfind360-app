"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/buildings-data"

interface RevenueChartProps {
  currentRevenue: number
  potentialRevenue: number
}

export function RevenueComparisonChart({ currentRevenue, potentialRevenue }: RevenueChartProps) {
  const data = [
    {
      name: "Annual Revenue",
      current: currentRevenue,
      potential: potentialRevenue,
    },
  ]

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-2">Estimated Annual Property Tax Revenue</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Current Tax Roll</div>
          <div className="text-lg font-bold text-foreground">{formatCurrency(currentRevenue)}</div>
          <div className="text-xs text-muted-foreground">5,000 properties</div>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="text-xs text-secondary mb-1">FastFind360 Detected</div>
          <div className="text-lg font-bold text-secondary">{formatCurrency(potentialRevenue)}</div>
          <div className="text-xs text-muted-foreground">245,254 properties</div>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="text-xs text-accent mb-1">Recovery Potential</div>
          <div className="text-lg font-bold text-accent">{formatCurrency(potentialRevenue - currentRevenue)}</div>
          <div className="text-xs text-muted-foreground">
            {Math.round((potentialRevenue / currentRevenue) * 10) / 10}x increase
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="current" name="Current Tax Roll" fill="#9CA3AF" radius={[0, 4, 4, 0]} barSize={40} />
            <Bar dataKey="potential" name="FastFind360 Detected" fill="#059669" radius={[0, 4, 4, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
