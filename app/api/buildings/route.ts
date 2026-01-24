import { NextResponse } from "next/server"

const FIREBASE_CSV_URL =
  "https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347"

// Tax rates per m² per year (in Naira)
const TAX_RATES = {
  Residential: 100,
  Commercial: 350,
  Industrial: 500,
}

// Value multiplier for estimated property value
const VALUE_MULTIPLIER = {
  Residential: 50000,
  Commercial: 120000,
  Industrial: 80000,
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

function parseGeometry(geometryStr: string, lat: number, lng: number): { type: "Polygon"; coordinates: number[][][] } {
  // Try to parse the geometry string
  if (geometryStr) {
    try {
      // Check if it's a POLYGON format like "POLYGON((lng lat, lng lat, ...))"
      if (geometryStr.startsWith("POLYGON")) {
        const coordsMatch = geometryStr.match(/\(\((.+)\)\)/)
        if (coordsMatch) {
          const coordsStr = coordsMatch[1]
          const points = coordsStr.split(",").map((p) => {
            const [x, y] = p.trim().split(/\s+/).map(Number)
            return [x, y]
          })
          if (points.length >= 3) {
            return { type: "Polygon", coordinates: [points] }
          }
        }
      }

      // Try JSON parse
      const parsed = JSON.parse(geometryStr)
      if (parsed.coordinates && Array.isArray(parsed.coordinates)) {
        return { type: "Polygon", coordinates: parsed.coordinates }
      }
    } catch {
      // Fall through to generate from center point
    }
  }

  // Generate a simple square polygon from center point and area
  // Assuming a roughly square building
  const sideLength = 0.00005 // ~5 meters in degrees at this latitude
  return {
    type: "Polygon",
    coordinates: [
      [
        [lng - sideLength, lat - sideLength],
        [lng + sideLength, lat - sideLength],
        [lng + sideLength, lat + sideLength],
        [lng - sideLength, lat + sideLength],
        [lng - sideLength, lat - sideLength], // Close the polygon
      ],
    ],
  }
}

export async function GET() {
  try {
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

    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    // Find column indices - be flexible with header names
    const latIdx = headers.findIndex((h) => h.includes("lat") || h === "y")
    const lonIdx = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h === "x")
    const areaIdx = headers.findIndex((h) => h.includes("area"))
    const confIdx = headers.findIndex((h) => h.includes("confidence") || h.includes("conf"))
    const geomIdx = headers.findIndex((h) => h.includes("geometry") || h.includes("geom"))

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

    const detectedAt = new Date().toISOString().split("T")[0]

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)

      const lat = Number.parseFloat(values[latIdx] || "0")
      const lng = Number.parseFloat(values[lonIdx] || "0")
      const area = Number.parseFloat(values[areaIdx] || "0")
      const confidence = Number.parseFloat(values[confIdx] || "0.95")
      const geometryStr = values[geomIdx] || ""

      // Skip invalid coordinates
      if (Number.isNaN(lat) || Number.isNaN(lng) || lat === 0 || lng === 0) continue

      const classification = classifyBuilding(area)
      const estimatedTax = area * TAX_RATES[classification]
      const estimatedValue = area * VALUE_MULTIPLIER[classification]
      const geometry = parseGeometry(geometryStr, lat, lng)

      const id = `building-${i}`

      buildings.push({
        id,
        latitude: lat,
        longitude: lng,
        area_in_meters: area,
        confidence,
        geometry,
        classification,
        estimated_tax: estimatedTax,
        properties: {
          id,
          classification,
          area_in_meters: area,
          confidence,
          estimated_tax: estimatedTax,
          estimatedValue,
          detectedAt,
        },
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
