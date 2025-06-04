import { NextResponse } from "next/server"
import { getAllDifficulties } from "@/db/queries/difficulty-queries"

export async function GET() {
  try {
    const difficulties = await getAllDifficulties()
    return NextResponse.json(difficulties)
  } catch (error) {
    console.error("Error fetching difficulties:", error)
    return NextResponse.json(
      { error: "Failed to fetch difficulties" },
      { status: 500 },
    )
  }
}
