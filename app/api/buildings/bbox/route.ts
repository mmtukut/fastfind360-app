import { NextResponse } from "next/server"
import { getBuildingsData } from "@/lib/buildings-cache"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const north = parseFloat(searchParams.get("north") || "0")
        const south = parseFloat(searchParams.get("south") || "0")
        const east = parseFloat(searchParams.get("east") || "0")
        const west = parseFloat(searchParams.get("west") || "0")
        const limit = parseInt(searchParams.get("limit") || "2000")
        const statsOnly = searchParams.get("statsOnly") === "1"

        if (!north || !south || !east || !west) {
            return NextResponse.json(
                { error: "Missing bounding box coordinates" },
                { status: 400 }
            )
        }

        // Try to fetch from backend service (production or optional separate service)
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            const endpoint = `${backendUrl}/buildings/bbox?${searchParams.toString()}`

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout to allow Cloud Run cold starts

            const backendRes = await fetch(endpoint, {
                signal: controller.signal,
                headers: { "Accept": "application/json" }
            })
            clearTimeout(timeoutId)

            if (backendRes.ok) {
                const data = await backendRes.json()
                return NextResponse.json(data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "public, max-age=60, s-maxage=300",
                        "X-Data-Source": "backend-service"
                    },
                })
            }
        } catch (e) {
            // Backend not available, continue to fallback
            // console.warn("Backend service unreachable, using local fallback")
        }

        // Fallback: Use in-memory cache / static CSV
        const { buildings } = await getBuildingsData()

        // Filter buildings within bounding box
        const filteredBuildings = buildings.filter(b =>
            b.latitude <= north &&
            b.latitude >= south &&
            b.longitude <= east &&
            b.longitude >= west
        )

        // Calculate dynamic stats for this view
        const localStats = {
            total: filteredBuildings.length,
            residential: 0,
            commercial: 0,
            industrial: 0,
            totalArea: 0,
            revenuePotential: 0,
            largeCommercial: 0,
        }

        filteredBuildings.forEach(b => {
            localStats.totalArea += b.area_in_meters
            localStats.revenuePotential += (b.estimated_tax || 0)

            if (b.classification === "Residential") localStats.residential++
            else if (b.classification === "Commercial") {
                localStats.commercial++
                if (b.area_in_meters > 500) localStats.largeCommercial++
            } else if (b.classification === "Industrial") localStats.industrial++
        })

        if (statsOnly) {
            return NextResponse.json({ stats: localStats, count: filteredBuildings.length })
        }

        // Apply limit for performance
        const limitedBuildings = filteredBuildings.slice(0, limit)

        return NextResponse.json({
            buildings: limitedBuildings,
            stats: localStats,
            count: limitedBuildings.length,
            totalInArea: filteredBuildings.length
        }, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=60, s-maxage=300",
                "X-Data-Source": "internal-fallback"
            }
        })

    } catch (error) {
        console.error("[v0] Failed to fetch buildings bbox:", error)
        return NextResponse.json(
            { error: "Failed to process request", details: String(error) },
            { status: 500 }
        )
    }
}
