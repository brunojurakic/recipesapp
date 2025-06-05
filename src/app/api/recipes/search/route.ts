import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { recipe } from "@/db/schema"
import { ilike } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    const recipes = await db
      .select({
        id: recipe.id,
        title: recipe.title,
        imagePath: recipe.image_path,
      })
      .from(recipe)
      .where(ilike(recipe.title, `%${query.trim()}%`))
      .limit(8)

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error searching recipes:", error)
    return NextResponse.json(
      { message: "Failed to search recipes" },
      { status: 500 }
    )
  }
}
