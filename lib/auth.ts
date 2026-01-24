"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "viewer"
  agency: string
  state: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Demo credentials for testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@gombegis.org": {
    password: "demo123",
    user: {
      id: "1",
      email: "admin@gombegis.org",
      name: "Dr. Kabiru Usman Hassan",
      role: "admin",
      agency: "Gombe Geographic Information System (GOGIS)",
      state: "Gombe",
    },
  },
  "admin@gombestate.gov.ng": {
    password: "demo123",
    user: {
      id: "2",
      email: "admin@gombestate.gov.ng",
      name: "Government Admin",
      role: "admin",
      agency: "Board of Internal Revenue",
      state: "Gombe",
    },
  },
}

// Allowed email domains for government authentication
const ALLOWED_DOMAINS = ["gombegis.org", "gombestate.gov.ng", "gov.ng"]

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check email domain
        const domain = email.split("@")[1]
        const isAllowedDomain = ALLOWED_DOMAINS.some((d) => domain?.endsWith(d))

        if (!isAllowedDomain) {
          return {
            success: false,
            error: "Only government email addresses are allowed. Please use your official @gov.ng email.",
          }
        }

        // Check demo credentials
        const demoUser = DEMO_USERS[email.toLowerCase()]
        if (demoUser && demoUser.password === password) {
          set({ user: demoUser.user, isAuthenticated: true })
          return { success: true }
        }

        // For demo purposes, allow any gov.ng email with password "demo123"
        if (password === "demo123" && isAllowedDomain) {
          const name = email.split("@")[0].replace(/[._]/g, " ")
          set({
            user: {
              id: Date.now().toString(),
              email,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              role: "viewer",
              agency: "Government Agency",
              state: "Gombe",
            },
            isAuthenticated: true,
          })
          return { success: true }
        }

        return {
          success: false,
          error: "Invalid email or password. For demo, use password: demo123",
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "fastfind360-auth",
    },
  ),
)
