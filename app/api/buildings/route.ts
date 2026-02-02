import { NextResponse } from "next/server"
import { getBuildingsData } from "@/lib/buildings-cache"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get("statsOnly") === "1"

    const { buildings, stats } = await getBuildingsData()

    return NextResponse.json(
      statsOnly ? { stats } : { buildings, stats },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300, s-maxage=3600",
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
