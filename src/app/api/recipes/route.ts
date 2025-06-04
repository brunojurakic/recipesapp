import { NextRequest, NextResponse } from "next/server"
import { parseJSON, saveImage } from "@/lib/utils/functions"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { recipeServerSchema } from "@/lib/validations/recipe-zod-server"
import { db } from "@/db/drizzle"
import {
  recipe,
  instruction,
  ingredient,
  recipeCategory,
  recipeAllergy,
} from "@/db/schema"
import { getRecipes, getFilteredRecipes } from "@/db/queries"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    )
  }

  const formData = await request.formData()
  const image = formData.get("image") as File

  let imagePath: string | null = null
  try {
    imagePath = await saveImage(image)
  } catch (error) {
    console.error("Error saving image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    servings: Number(formData.get("servings")),
    preparationTime: Number(formData.get("preparationTime")),
    instructions: parseJSON(formData.get("instructions")),
    categories: parseJSON(formData.get("categories")),
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

  try {
    const newRecipe = await db.transaction(async (tx) => {
      const [recipeResult] = await tx
        .insert(recipe)
        .values({
          userId: session.user.id,
          title: validatedData.title,
          description: validatedData.description,
          image_path: validatedData.imagePath,
          servings: validatedData.servings,
          preparationTime: validatedData.preparationTime,
          difficultyId: validatedData.difficultyId,
          isVegan: validatedData.isVegan,
          isVegetarian: validatedData.isVegetarian,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      await tx.insert(instruction).values(
        validatedData.instructions.map((inst) => ({
          recipeId: recipeResult.id,
          stepNumber: inst.stepNumber,
          content: inst.content,
        })),
      )

      await tx.insert(ingredient).values(
        validatedData.ingredients.map((ing) => ({
          recipeId: recipeResult.id,
          name: ing.name,
          quantity: ing.quantity,
          unitId: ing.unitId,
        })),
      )

      await tx.insert(recipeCategory).values(
        validatedData.categories.map((categoryId) => ({
          recipeId: recipeResult.id,
          categoryId,
        })),
      )
      if (validatedData.allergies && validatedData.allergies.length > 0) {
        await tx.insert(recipeAllergy).values(
          validatedData.allergies.map((allergyId) => ({
            recipeId: recipeResult.id,
            allergyId,
          })),
        )
      }

      return recipeResult
    })

    return NextResponse.json({ success: true, recipe: newRecipe })
  } catch (error) {
    console.error("Error saving recipe:", error)
    return NextResponse.json(
      { error: "Failed to save recipe to database" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const categoryIds =
      searchParams.get("categoryIds")?.split(",").filter(Boolean) || undefined
    const allergyIds =
      searchParams.get("allergyIds")?.split(",").filter(Boolean) || undefined
    const difficultyIds =
      searchParams.get("difficultyIds")?.split(",").filter(Boolean) || undefined
    const isVegan = searchParams.get("isVegan") === "true" ? true : undefined
    const isVegetarian =
      searchParams.get("isVegetarian") === "true" ? true : undefined
    const maxPrepTime = searchParams.get("maxPrepTime")
      ? parseInt(searchParams.get("maxPrepTime")!, 10)
      : undefined
    const minServings = searchParams.get("minServings")
      ? parseInt(searchParams.get("minServings")!, 10)
      : undefined
    const ingredientSearch = searchParams.get("ingredientSearch") || undefined

    const hasFilters =
      search ||
      categoryIds ||
      allergyIds ||
      difficultyIds ||
      isVegan ||
      isVegetarian ||
      maxPrepTime ||
      minServings ||
      ingredientSearch

    let recipes
    if (hasFilters) {
      recipes = await getFilteredRecipes({
        search,
        categoryIds,
        allergyIds,
        difficultyIds,
        isVegan,
        isVegetarian,
        maxPrepTime: maxPrepTime && maxPrepTime > 0 ? maxPrepTime : undefined,
        minServings: minServings && minServings > 0 ? minServings : undefined,
        ingredientSearch,
      })
    } else {
      recipes = await getRecipes()
    }

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { message: "Failed to fetch recipes" },
      { status: 500 },
    )
  }
}
