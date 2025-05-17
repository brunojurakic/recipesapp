import { NextRequest, NextResponse } from "next/server";
import { parseJSON, saveImage } from "@/lib/utils/functions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { recipeServerSchema } from "@/lib/validations/recipe-zod-server";
import { db } from "@/db/drizzle";
import { recipe, instruction, ingredient, recipeCategory, recipeAllergy } from "@/db/schema";
import { desc } from "drizzle-orm";


export async function GET() {
  try {
    const recipes = await db.query.recipe.findMany({
      with: {
        user: {
          columns: {
            name: true,
            image: true
          }
        },
        categories: {
          with: {
            category: true
          }
        },
        ingredients: {
          with: {
            unit: true
          }
        },
        instructions: true,
        allergies: {
          with: {
            allergy: true
          }
        }
      },
      orderBy: (recipes) => [desc(recipes.createdAt)]
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });


  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const image = formData.get('image') as File;


  let imagePath: string | null = null;
  try {
    imagePath = await saveImage(image);
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    servings: Number(formData.get('servings')),
    preparationTime: Number(formData.get('preparationTime')),
    instructions: parseJSON(formData.get('instructions')),
    categories: parseJSON(formData.get('categories')),
    ingredients: parseJSON(formData.get('ingredients')),
    allergies: parseJSON(formData.get('allergies')),
    imagePath,
  };
  const result = recipeServerSchema.safeParse(data);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 }
    );
  }

  const validatedData = result.data;

  try {
    const newRecipe = await db.transaction(async (tx) => {
      const [recipeResult] = await tx.insert(recipe).values({
        userId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        image_path: validatedData.imagePath,
        servings: validatedData.servings,
        preparationTime: validatedData.preparationTime,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      await tx.insert(instruction).values(
        validatedData.instructions.map(inst => ({
          recipeId: recipeResult.id,
          stepNumber: inst.stepNumber,
          content: inst.content
        }))
      );

      await tx.insert(ingredient).values(
        validatedData.ingredients.map(ing => ({
          recipeId: recipeResult.id,
          name: ing.name,
          quantity: ing.quantity,
          unitId: ing.unitId
        }))
      );

      await tx.insert(recipeCategory).values(
        validatedData.categories.map(categoryId => ({
          recipeId: recipeResult.id,
          categoryId
        }))
      );

      if (validatedData.allergies) {
        await tx.insert(recipeAllergy).values(
          validatedData.allergies.map(allergyId => ({
            recipeId: recipeResult.id,
            allergyId
          }))
        );
      }

      return recipeResult;
    });

    return NextResponse.json({ success: true, recipe: newRecipe });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe to database' },
      { status: 500 }
    );
  }
}