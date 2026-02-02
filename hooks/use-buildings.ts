"use client"

import useSWR from "swr"
import type { Building, BuildingStats } from "@/lib/types"

type UseBuildingsOptions = {
  statsOnly?: boolean
}

async function buildingsFetcher(url: string): Promise<{
  buildings?: Building[]
  stats: BuildingStats
}> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
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

export function useBuildings(options: UseBuildingsOptions = {}) {
  const url = options.statsOnly ? "/api/buildings?statsOnly=1" : "/api/buildings"
  const { data, error, isLoading, mutate } = useSWR(url, buildingsFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 5,
    errorRetryInterval: 3000,
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
