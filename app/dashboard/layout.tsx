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
      <div className="min-h-screen bg-[#0A192F] text-slate-200 selection:bg-blue-500 selection:text-white relative">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>
        <DashboardSidebar />
        {/* Main content area with responsive padding for sidebar */}
        <main className="lg:pl-64 pt-16 lg:pt-0 pb-20 lg:pb-0 relative z-10">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
