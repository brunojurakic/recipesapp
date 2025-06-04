import { db } from "@/db/drizzle"
import { NextResponse } from "next/server"

export async function GET() {
  const data = await db.query.allergy.findMany({})
  return NextResponse.json(data)
}
