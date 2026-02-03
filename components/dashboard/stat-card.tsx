import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    positive: boolean
  }
  variant?: "default" | "primary" | "secondary" | "accent"
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variants = {
    default: "bg-[#112240]/50 border-slate-700 hover:border-slate-600",
    primary: "bg-blue-900/20 border-blue-800/50 hover:border-blue-700",
    secondary: "bg-emerald-900/10 border-emerald-800/30 hover:border-emerald-700",
    accent: "bg-purple-900/10 border-purple-800/30 hover:border-purple-700",
  }

  const iconVariants = {
    default: "text-slate-400 bg-slate-800/50",
    primary: "text-blue-400 bg-blue-900/30",
    secondary: "text-emerald-400 bg-emerald-900/30",
    accent: "text-purple-400 bg-purple-900/30",
  }

  return (
    <div className={cn("rounded-sm border p-5 backdrop-blur-sm transition-colors", variants[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-mono text-white font-medium tracking-tight">{value}</p>
          {subtitle && <p className="mt-2 text-xs text-slate-500 font-medium">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-2 text-xs font-mono font-bold flex items-center gap-1", trend.positive ? "text-emerald-400" : "text-red-400")}>
              {trend.positive ? "▲" : "▼"}
              {trend.value}%
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-sm flex items-center justify-center border border-white/5", iconVariants[variant])}>
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
