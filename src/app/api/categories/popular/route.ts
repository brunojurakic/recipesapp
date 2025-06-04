import { NextResponse } from "next/server"
import { getAllCategoriesWithCounts } from "@/db/queries/category-queries"

export async function GET() {
  try {
    const categories = await getAllCategoriesWithCounts()

    const popularCategories = categories
      .sort((a, b) => b.recipeCount - a.recipeCount)
      .slice(0, 6)

    return NextResponse.json(popularCategories)
  } catch (error) {
    console.error("Error fetching popular categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch popular categories" },
      { status: 500 },
    )
  }
}
