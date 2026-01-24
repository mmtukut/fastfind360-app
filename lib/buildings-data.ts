import type { Building, BuildingStats } from "./types"

// Tax rates per m² per year (in Naira)
export const TAX_RATES = {
  Residential: 100,
  Commercial: 350,
  Industrial: 500,
}

export function classifyBuilding(area: number): "Residential" | "Commercial" | "Industrial" {
  if (area < 150) return "Residential"
  if (area < 600) return "Commercial"
  return "Industrial"
}

export function calculatePropertyTax(
  area: number,
  classification: "Residential" | "Commercial" | "Industrial",
): number {
  return area * TAX_RATES[classification]
}

export function calculateStats(buildings: Building[]): BuildingStats {
  const stats: BuildingStats = {
    total: buildings.length,
    residential: 0,
    commercial: 0,
    industrial: 0,
    totalArea: 0,
    revenuePotential: 0,
    largeCommercial: 0,
  }

  for (const building of buildings) {
    stats.totalArea += building.area_in_meters
    stats.revenuePotential += building.estimated_tax || 0

    switch (building.classification) {
      case "Residential":
        stats.residential++
        break
      case "Commercial":
        stats.commercial++
        if (building.area_in_meters > 500) {
          stats.largeCommercial++
        }
        break
      case "Industrial":
        stats.industrial++
        break
    }
  }

  return stats
}

export function formatCurrency(amount: number): string {
  if (amount >= 1e12) {
    return `₦${(amount / 1e12).toFixed(1)}T`
  }
  if (amount >= 1e9) {
    return `₦${(amount / 1e9).toFixed(1)}B`
  }
  if (amount >= 1e6) {
    return `₦${(amount / 1e6).toFixed(1)}M`
  }
  if (amount >= 1e3) {
    return `₦${(amount / 1e3).toFixed(1)}K`
  }
  return `₦${amount.toFixed(0)}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num)
}
