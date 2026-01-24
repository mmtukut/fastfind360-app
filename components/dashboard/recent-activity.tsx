import { FileText, RefreshCw, Building2 } from "lucide-react"

const activities = [
  {
    icon: RefreshCw,
    title: "Model retrained",
    description: "Classification accuracy improved to 99.998%",
    time: "Jan 15, 2026",
  },
  {
    icon: FileText,
    title: "Report exported",
    description: "Executive Summary Q1 2026 by Admin",
    time: "Jan 10, 2026",
  },
  {
    icon: Building2,
    title: "New buildings detected",
    description: "1,250 new buildings in recent satellite scan",
    time: "Jan 5, 2026",
  },
]

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <activity.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
