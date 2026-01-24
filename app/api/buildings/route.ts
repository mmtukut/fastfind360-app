import { NextResponse } from "next/server"

const FIREBASE_CSV_URL =
  "https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347"

// Tax rates per m² per year (in Naira)
const TAX_RATES = {
  Residential: 100,
  Commercial: 350,
  Industrial: 500,
}

function classifyBuilding(area: number): "Residential" | "Commercial" | "Industrial" {
  if (area < 150) return "Residential"
  if (area < 600) return "Commercial"
  return "Industrial"
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  values.push(current.trim())

  return values
}

export async function GET() {
  try {
    console.log("[v0] Fetching buildings from Firebase...")

    const response = await fetch(FIREBASE_CSV_URL, {
      headers: {
        Accept: "text/csv, text/plain, */*",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Firebase responded with status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV fetched, parsing...")

    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    console.log("[v0] CSV Headers:", headers)

    // Find column indices - be flexible with header names
    const latIdx = headers.findIndex((h) => h.includes("lat") || h === "y")
    const lonIdx = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h === "x")
    const areaIdx = headers.findIndex((h) => h.includes("area"))
    const confIdx = headers.findIndex((h) => h.includes("confidence") || h.includes("conf"))
    const geomIdx = headers.findIndex((h) => h.includes("geometry") || h.includes("geom"))

    console.log("[v0] Column indices - lat:", latIdx, "lon:", lonIdx, "area:", areaIdx)

    const buildings = []
    const stats = {
      total: 0,
      residential: 0,
      commercial: 0,
      industrial: 0,
      totalArea: 0,
      revenuePotential: 0,
      largeCommercial: 0,
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)

      const lat = Number.parseFloat(values[latIdx] || "0")
      const lng = Number.parseFloat(values[lonIdx] || "0")
      const area = Number.parseFloat(values[areaIdx] || "0")
      const confidence = Number.parseFloat(values[confIdx] || "0.95")

      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue

      const classification = classifyBuilding(area)
      const estimatedTax = area * TAX_RATES[classification]

      buildings.push({
        id: `building-${i}`,
        latitude: lat,
        longitude: lng,
        area_in_meters: area,
        confidence,
        geometry: values[geomIdx] || undefined,
        classification,
        estimated_tax: estimatedTax,
      })

      // Update stats
      stats.total++
      stats.totalArea += area
      stats.revenuePotential += estimatedTax

      if (classification === "Residential") stats.residential++
      else if (classification === "Commercial") {
        stats.commercial++
        if (area > 500) stats.largeCommercial++
      } else if (classification === "Industrial") stats.industrial++
    }

    console.log("[v0] Parsed", buildings.length, "buildings")

    return NextResponse.json(
      { buildings, stats },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Failed to fetch buildings:", error)
    return NextResponse.json(
      { error: "Failed to fetch buildings data", details: String(error) },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
