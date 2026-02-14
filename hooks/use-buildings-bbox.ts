"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Building, BuildingStats } from "@/lib/types"

export type MapBounds = {
    north: number
    south: number
    east: number
    west: number
}

interface UseBuildingsBboxReturn {
    buildings: Building[]
    stats: BuildingStats
    isLoading: boolean
    isError: Error | null
    fetchBuildingsInBounds: (bounds: MapBounds) => Promise<void>
}

// Initial empty stats
const initialStats: BuildingStats = {
    total: 0,
    residential: 0,
    commercial: 0,
    industrial: 0,
    totalArea: 0,
    revenuePotential: 0,
    largeCommercial: 0,
}

// Helper to check if bounds are valid
const isValidBounds = (bounds: MapBounds) => {
    return (
        bounds.north !== bounds.south &&
        bounds.east !== bounds.west &&
        !isNaN(bounds.north) &&
        !isNaN(bounds.south)
    )
}

export function useBuildingsBbox(): UseBuildingsBboxReturn {
    const [buildings, setBuildings] = useState<Building[]>([])
    const [stats, setStats] = useState<BuildingStats>(initialStats)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    // Keep track of loaded building IDs to prevent duplicates
    const loadedBuildingIds = useRef<Set<string>>(new Set())

    // Track last fetched bounds to prevent duplicate requests
    const lastFetchBounds = useRef<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    const fetchBuildingsInBounds = useCallback(async (bounds: MapBounds) => {
        if (!isValidBounds(bounds)) return

        // Create a rough key for the bounds (rounded to 3 decimal places ~100m)
        const boundsKey = `${bounds.north.toFixed(3)},${bounds.south.toFixed(3)},${bounds.east.toFixed(3)},${bounds.west.toFixed(3)}`

        // Skip if we just fetched this area
        if (lastFetchBounds.current === boundsKey) return
        lastFetchBounds.current = boundsKey

        // Cancel previous request if still running
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        setIsLoading(true)
        setError(null)

        try {
            // Fetch buildings from our new API route (which handles backend fallback internally)
            const params = new URLSearchParams({
                north: bounds.north.toString(),
                south: bounds.south.toString(),
                east: bounds.east.toString(),
                west: bounds.west.toString(),
                limit: "2000" // Fetch up to 2000 visible buildings at a time
            })

            const response = await fetch(`/api/buildings/bbox?${params.toString()}`, {
                signal: abortControllerRef.current.signal,
                headers: {
                    "Accept": "application/json"
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch buildings: ${response.statusText}`)
            }

            const data = await response.json()

            // Merge new buildings with existing ones
            if (data.buildings && Array.isArray(data.buildings)) {
                setBuildings(prev => {
                    const newBuildings = data.buildings.filter((b: Building) => !loadedBuildingIds.current.has(b.id))

                    if (newBuildings.length === 0) return prev

                    newBuildings.forEach((b: Building) => loadedBuildingIds.current.add(b.id))
                    return [...prev, ...newBuildings]
                })
            }

            // Update stats based on what we fetched (or merge stats if needed)
            // For now, we'll keep the stats from the response which represent the current view
            if (data.stats) {
                setStats(prev => ({
                    total: prev.total + (data.stats.total || 0), // This is tricky - accumulative stats vs view stats
                    // For simplicity, let's fetch GLOBAL stats once and keep them fixed, 
                    // but here we might want view-local stats.
                    // Let's stick to accumulating loaded stats for now or just using the returned stats
                    // actually, the UI expects global stats usually. 
                    // Let's refetch global stats separately if needed.
                    ...data.stats
                }))
            }

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Ignore abort errors
                return
            }
            console.error("Error fetching buildings:", err)
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial global stats fetch (optional)
    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                // Use the Next.js API route which handles fallback internally
                const response = await fetch('/api/buildings?statsOnly=1')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data.stats)
                }
            } catch (e) {
                console.error("Failed to fetch initial stats", e)
            }
        }
        fetchGlobalStats()
    }, [])

    return {
        buildings,
        stats,
        isLoading,
        isError: error,
        fetchBuildingsInBounds
    }
}
