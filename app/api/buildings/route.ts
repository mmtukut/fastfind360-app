import { NextResponse } from "next/server"
import { getBuildingsData } from "@/lib/buildings-cache"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get("statsOnly") === "1"

    // Try to fetch from backend service (production or local)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      const endpoint = `${backendUrl}/buildings` + (statsOnly ? "?statsOnly=1" : "")
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2s timeout

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
            "Cache-Control": "public, max-age=300, s-maxage=3600",
            "X-Data-Source": "backend-service"
          },
        })
      }
    } catch (e) {
      // Backend service not available, fall back to internal logic
      console.warn("Backend service not reachable, falling back to internal logic:", e)
    }

    const { buildings, stats } = await getBuildingsData()

    return NextResponse.json(
      statsOnly ? { stats } : { buildings, stats },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300, s-maxage=3600",
          "X-Data-Source": "internal-fallback"
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
