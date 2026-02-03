"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Map, BarChart3, FileText, Settings, LogOut, Satellite, ChevronLeft, Menu, Crosshair } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/lib/auth"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/map", icon: Map, label: "Intelligence Map" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Revenue Analytics" },
  { href: "/dashboard/reports", icon: FileText, label: "Audit Reports" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#112240] border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-900/30 border border-blue-700 rounded-sm flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-lg text-white">FastFind360</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-300">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-[#112240] border-r border-slate-800 z-50 transition-all duration-300 shadow-xl",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0d1b33]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50">
              <div className="w-4 h-4 border-2 border-white rounded-full relative">
                <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            {!collapsed && <span className="font-bold text-lg text-white tracking-tight">FastFind360</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* User info & State selector */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-slate-800 bg-[#0f1e39]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-xs font-bold text-white">GS</span>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Gombe State</div>
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE CONNECTED
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono border-t border-slate-800 pt-2 mt-2">
              ID: {user?.id?.substring(0, 8) || "8527-315A"}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border hover:border-slate-700 border border-transparent",
                  collapsed && "justify-center px-2",
                )}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                {!collapsed && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800 bg-[#0d1b33]">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
              collapsed && "justify-center",
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">System Config</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors mt-1",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#112240] border-t border-slate-800 z-50 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2",
                isActive ? "text-blue-400" : "text-slate-500",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold">{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
