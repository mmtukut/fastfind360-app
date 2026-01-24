import { type NextRequest, NextResponse } from "next/server"

const CLASSIFIER_API_URL = "https://building-classifier-service-480235407496.us-central1.run.app/predict"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(CLASSIFIER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Classifier API error:", errorText)
      throw new Error(`Classifier API responded with status: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json(result, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[v0] Classification error:", error)
    return NextResponse.json(
      { error: "Failed to classify building", details: String(error) },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
