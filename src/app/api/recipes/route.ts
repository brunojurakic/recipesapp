import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { recipe, instruction, ingredient, recipeIngredient, recipeCategory } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession(req);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    // Create recipe with auto-generated UUID
    const [newRecipe] = await db.insert(recipe).values({
      userId: session.user.id,
      title: data.title,
      description: data.description || null,
      image_path: data.imagePath || null,
      servings: data.servings,
      preparationTime: data.preparationTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: recipe.id });

    // Create instructions with auto-generated UUIDs
    const instructionValues = data.instructions.map((inst: { content: string }, index: number) => ({
      recipeId: newRecipe.id,
      stepNumber: index + 1,
      content: inst.content,
    }));
    
    if (instructionValues.length > 0) {
      await db.insert(instruction).values(instructionValues);
    }

    // Create or get ingredients and link them to recipe
    for (const ing of data.ingredients) {
      if (!ing.name || !ing.quantity) continue;

      // Try to find existing ingredient or create new one
      const existingIngredient = await db
        .select()
        .from(ingredient)
        .where(eq(ingredient.name, ing.name.toLowerCase()))
        .limit(1)
        .then(rows => rows[0]);

      if (existingIngredient) {
        // Link ingredient to recipe with quantity
        await db.insert(recipeIngredient).values({
          recipeId: newRecipe.id,
          ingredientId: existingIngredient.id,
          quantity: ing.quantity,
        });
      } else {
        // Create new ingredient with auto-generated UUID and link it
        const [newIngredient] = await db.insert(ingredient).values({
          name: ing.name.toLowerCase(),
          type: "other", // Default type, could be enhanced later
        }).returning({ id: ingredient.id });

        await db.insert(recipeIngredient).values({
          recipeId: newRecipe.id,
          ingredientId: newIngredient.id,
          quantity: ing.quantity,
        });
      }
    }

    // Handle categories if provided
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      const categoryLinks = data.categories.map((categoryId: string) => ({
        recipeId: newRecipe.id,
        categoryId: categoryId,
      }));
      await db.insert(recipeCategory).values(categoryLinks);
    }

    return NextResponse.json({ id: newRecipe.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
