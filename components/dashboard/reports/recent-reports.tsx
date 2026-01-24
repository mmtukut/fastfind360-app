"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, Eye } from "lucide-react"

interface Report {
  id: string
  title: string
  type: string
  generatedAt: string
  generatedBy: string
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Executive Summary - Q1 2026",
    type: "Executive",
    generatedAt: "Jan 15, 2026",
    generatedBy: "Admin User",
  },
  {
    id: "2",
    title: "Gombe Metro Revenue Analysis",
    type: "Revenue",
    generatedAt: "Jan 10, 2026",
    generatedBy: "Admin User",
  },
  {
    id: "3",
    title: "Technical Report - Full State",
    type: "Technical",
    generatedAt: "Jan 5, 2026",
    generatedBy: "Admin User",
  },
  {
    id: "4",
    title: "Billiri LGA Assessment",
    type: "LGA",
    generatedAt: "Dec 28, 2025",
    generatedBy: "Admin User",
  },
]

interface RecentReportsProps {
  onNewReport?: (report: Report) => void
}

export function RecentReports({ onNewReport }: RecentReportsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Recent Reports</h3>

      <div className="space-y-3">
        {mockReports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{report.title}</div>
                <div className="text-xs text-muted-foreground">
                  {report.type} • Generated {report.generatedAt} by {report.generatedBy}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {mockReports.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reports generated yet</p>
          <p className="text-sm">Create your first report using the form above</p>
        </div>
      )}
    </div>
  )
}
