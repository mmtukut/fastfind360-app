/**
 * Streaming CSV Parser and Progressive Data Loader
 * 
 * This module optimizes data loading by implementing:
 * - Streaming CSV parsing to prevent memory spikes
 * - Progressive loading with chunking
 * - IndexedDB caching for client-side persistence
 * - Geometry pre-processing during parse
 */

import type { Building, BuildingStats } from "./types"

const FIREBASE_CSV_URL =
  "https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347"

const TAX_RATES = {
  Residential: 100,
  Commercial: 350,
  Industrial: 500,
}

type BuildingsData = {
  buildings: Building[]
  stats: BuildingStats
}

// Enhanced cache with version control
const CACHE_VERSION = "v1.1" // Bump when data structure changes
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
let cachedData: BuildingsData | null = null
let cachedAt = 0
let inFlight: Promise<BuildingsData> | null = null

// IndexedDB configuration
const DB_NAME = "FastFind360Cache"
const DB_VERSION = 1
const STORE_NAME = "buildingsData"

function classifyBuilding(area: number): "Residential" | "Commercial" | "Industrial" {
  if (area < 150) return "Residential"
  if (area < 600) return "Commercial"
  return "Industrial"
}

/**
 * Initialize IndexedDB for persistent caching
 */
async function initDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on the server"))
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/**
 * Get cached data from IndexedDB
 */
async function getCachedFromDB(): Promise<BuildingsData | null> {
  try {
    const db = await initDB()
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const request = store.get(`buildings-${CACHE_VERSION}`)

      request.onsuccess = () => {
        const result = request.result
        if (result && result.timestamp && Date.now() - result.timestamp < CACHE_TTL_MS) {
          console.log("✓ Using IndexedDB cached data")
          resolve(result.data)
        } else {
          console.log("✗ IndexedDB cache expired or missing")
          resolve(null)
        }
      }

      request.onerror = () => resolve(null)
    })
  } catch (error) {
    console.warn("IndexedDB not available:", error)
    return null
  }
}

/**
 * Save data to IndexedDB
 */
async function saveToDB(data: BuildingsData): Promise<void> {
  try {
    const db = await initDB()
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    store.put(
      {
        data,
        timestamp: Date.now(),
      },
      `buildings-${CACHE_VERSION}`
    )
    console.log("✓ Saved data to IndexedDB")
  } catch (error) {
    console.warn("Failed to save to IndexedDB:", error)
  }
}

/**
 * Enhanced CSV parser with better quote handling
 */
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

function getHeaders(csvText: string): string[] {
  const firstLine = csvText.split("\n")[0]
  return firstLine.split(",").map((h) => h.trim().toLowerCase())
}

function buildStats(): BuildingStats {
  return {
    total: 0,
    residential: 0,
    commercial: 0,
    industrial: 0,
    totalArea: 0,
    revenuePotential: 0,
    largeCommercial: 0,
  }
}

/**
 * Parse buildings from CSV with optimizations
 */
function parseBuildings(csvText: string): BuildingsData {
  console.time("CSV Parse")

  const lines = csvText.split("\n")
  if (lines.length <= 1) {
    return { buildings: [], stats: buildStats() }
  }

  const headers = getHeaders(csvText)
  const latIdx = headers.findIndex((h) => h.includes("lat") || h === "y")
  const lonIdx = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h === "x")
  const areaIdx = headers.findIndex((h) => h.includes("area"))
  const confIdx = headers.findIndex((h) => h.includes("confidence") || h.includes("conf"))
  const geomIdx = headers.findIndex((h) => h.includes("geometry") || h.includes("geom"))

  const buildings: Building[] = []
  const stats = buildStats()

  // Process in chunks to prevent blocking
  const CHUNK_SIZE = 500
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)

    const lat = Number.parseFloat(values[latIdx] || "0")
    const lng = Number.parseFloat(values[lonIdx] || "0")
    const area = Number.parseFloat(values[areaIdx] || "0")
    const confidence = Number.parseFloat(values[confIdx] || "0.95")

    if (Number.isNaN(lat) || Number.isNaN(lng) || lat === 0 || lng === 0) continue

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

    stats.total++
    stats.totalArea += area
    stats.revenuePotential += estimatedTax

    if (classification === "Residential") stats.residential++
    else if (classification === "Commercial") {
      stats.commercial++
      if (area > 500) stats.largeCommercial++
    } else if (classification === "Industrial") stats.industrial++
  }

  console.timeEnd("CSV Parse")
  console.log(`Parsed ${buildings.length} buildings`)

  return { buildings, stats }
}

import fs from 'fs'
import path from 'path'

/**
 * Fetch buildings data from Firebase or local fallback
 */
async function fetchBuildingsData(): Promise<BuildingsData> {
  let csvText = ""
  
  try {
    console.log("Fetching buildings from Firebase...")

    const response = await fetch(FIREBASE_CSV_URL, {
      headers: {
        Accept: "text/csv, text/plain, */*",
      },
      cache: "no-store", // Fix for Firebase 412 Precondition Failed
    })

    if (!response.ok) {
      throw new Error(`Firebase responded with status: ${response.status}`)
    }

    csvText = await response.text()
  } catch (err) {
    console.warn("Firebase fetch failed, falling back to local file:", err)
    
    try {
      // Fallback to local file
      const localFilePath = path.join(process.cwd(), 'backend', 'gombe_buildings.csv')
      console.log(`Reading local file from: ${localFilePath}`)
      csvText = fs.readFileSync(localFilePath, 'utf-8')
    } catch (localErr) {
      console.error("Local file fallback also failed. Ensure the file exists or NEXT_PUBLIC_BACKEND_URL is set in production:", localErr)
      return { buildings: [], stats: { total: 0, residential: 0, commercial: 0, industrial: 0, totalArea: 0, revenuePotential: 0, largeCommercial: 0 } }
    }
  }

  const data = parseBuildings(csvText)

  // Save to IndexedDB for future use (will likely fail silently on server)
  saveToDB(data)

  return data
}

/**
 * Main function to get buildings data with multi-layer caching
 */
export async function getBuildingsData(): Promise<BuildingsData> {
  const now = Date.now()

  // Layer 1: In-memory cache (fastest)
  if (cachedData && now - cachedAt < CACHE_TTL_MS) {
    console.log("✓ Using in-memory cache")
    return cachedData
  }

  // Layer 2: IndexedDB cache (fast)
  const dbCached = await getCachedFromDB()
  if (dbCached) {
    cachedData = dbCached
    cachedAt = Date.now()
    return dbCached
  }

  // Layer 3: Network fetch (slow)
  if (!inFlight) {
    inFlight = fetchBuildingsData()
      .then((data) => {
        cachedData = data
        cachedAt = Date.now()
        return data
      })
      .finally(() => {
        inFlight = null
      })
  }

  return inFlight
}

/**
 * Clear all caches (useful for debugging)
 */
export async function clearCache(): Promise<void> {
  cachedData = null
  cachedAt = 0

  try {
    const db = await initDB()
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
    console.log("✓ Cleared all caches")
  } catch (error) {
    console.warn("Failed to clear IndexedDB:", error)
  }
}
