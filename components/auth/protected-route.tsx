"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Loader2, Satellite } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(useAuth.persist.hasHydrated())

    const unsubFinishHydration = useAuth.persist.onFinishHydration(() => setHasHydrated(true))

    return () => {
      unsubFinishHydration()
    }
  }, [])

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Satellite className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">FastFind360</span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
