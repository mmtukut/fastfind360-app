import type React from "react"
import type { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Dashboard | FastFind360",
  description: "Government Property Intelligence Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar />
        {/* Main content area with responsive padding for sidebar */}
        <main className="lg:pl-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
