import { auth } from "@/lib/auth"
import { deleteRecipe, getRecipe } from "@/db/queries"
import { recipeServerSchema } from "@/lib/validations/recipe-zod-server"
import { put } from "@vercel/blob"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { updateRecipe } from "@/db/queries/recipe-queries"
import { parseJSON } from "@/lib/utils/functions"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const recipe = await getRecipe(id)

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own recipes" },
        { status: 403 },
      )
    }

    const success = await deleteRecipe(id)

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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const recipe = await getRecipe(id)

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own recipes" },
        { status: 403 },
      )
    }

    const formData = await request.formData()

    let imagePath = recipe.image_path
    const imageFile = formData.get("image") as File | null

    if (imageFile && imageFile.size > 0) {
      const { url } = await put(
        `recipes/${crypto.randomUUID()}-${imageFile.name}`,
        imageFile,
        {
          access: "public",
        },
      )
      imagePath = url
    }
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      servings: parseInt(formData.get("servings") as string),
      preparationTime: parseInt(formData.get("preparationTime") as string),
      categories: parseJSON(formData.get("categories")),
      instructions: parseJSON(formData.get("instructions")),
      ingredients: parseJSON(formData.get("ingredients")),
      allergies: parseJSON(formData.get("allergies")),
      difficultyId: (formData.get("difficultyId") as string) || undefined,
      isVegan: formData.get("isVegan") === "true",
      isVegetarian: formData.get("isVegetarian") === "true",
      imagePath,
    }

    const result = recipeServerSchema.safeParse(data)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 },
      )
    }

    const validatedData = result.data
    const success = await updateRecipe(id, validatedData)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update recipe" },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Recipe updated successfully", id })
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const recipe = await getRecipe(id)

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
