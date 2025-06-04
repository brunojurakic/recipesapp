import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/db/queries/user-queries"
import {
  getAllRecipesForAdmin,
  deleteRecipe,
} from "@/db/queries/recipe-queries"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (
      !currentUser ||
      (currentUser.role?.name !== "Admin" &&
        currentUser.role?.name !== "Moderator")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const recipes = await getAllRecipesForAdmin()

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (
      !currentUser ||
      (currentUser.role?.name !== "Admin" &&
        currentUser.role?.name !== "Moderator")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const recipeId = searchParams.get("recipeId")

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 },
      )
    }

    const success = await deleteRecipe(recipeId)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete recipe" },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
