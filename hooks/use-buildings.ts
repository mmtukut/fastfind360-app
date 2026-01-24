"use client"

import useSWR from "swr"
import type { Building, BuildingStats } from "@/lib/types"

async function buildingsFetcher(): Promise<{
  buildings: Building[]
  stats: BuildingStats
}> {
  try {
    const response = await fetch("/api/buildings", {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      let errorMessage = "Failed to fetch buildings"
      try {
        const error = await response.json()
        errorMessage = error.details || error.error || errorMessage
      } catch {
        errorMessage = `Server error: ${response.status}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Buildings fetch error:", error)
    throw error
  }
}

export function useBuildings() {
  const { data, error, isLoading, mutate } = useSWR("buildings-data", buildingsFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })

  return {
    buildings: data?.buildings || [],
    stats: data?.stats || {
      total: 0,
      residential: 0,
      commercial: 0,
      industrial: 0,
      totalArea: 0,
      revenuePotential: 0,
      largeCommercial: 0,
    },
    isLoading,
    isError: error,
    mutate,
  }
}
