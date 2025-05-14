import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";
import { recipeZodSchema } from "@/lib/validations/recipe-zod";
import { randomUUID } from "crypto";



const recipeData = {
  title: "Chocolate Cake",
  description: "Delicious chocolate cake recipe",
  servings: 8,
  preparationTime: 60,
  userId: "user-123",
  image_path: 'eqqeeq',
  instructions: [
    { stepNumber: 1, content: "Preheat oven to 350°F" },
    { stepNumber: 2, content: "Mix dry ingredients" }
  ],
  categories: [randomUUID(), randomUUID()],
  ingredients: [
    {
      ingredientId: randomUUID(),
      unitId: randomUUID(),
      quantity: "2 cups"
    }
  ],
  allergies: [randomUUID()]
}



export async function POST(request: NextRequest) {
  const zod = recipeZodSchema.safeParse(recipeData)

  return NextResponse.json(zod)
}