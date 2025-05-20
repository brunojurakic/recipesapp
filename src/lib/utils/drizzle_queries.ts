import { db } from "@/db/drizzle";
import { recipe } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function getRecipe(id: string) {
  try {
    const recipeData = await db.query.recipe.findFirst({
      where: eq(recipe.id, id),
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          }
        },
        categories: {
          with: {
            category: true,
          },
        },
        allergies: {
          with: {
            allergy: true,
          },
        },
        instructions: {
          orderBy: (table) => [
            table.stepNumber
          ],
        },
        ingredients: {
          with: {
            unit: true,
          },
        },
        reviews: {
          with: {
            user: true,
          },
          orderBy: (table) => [
            table.createdAt
          ],
        },
      },
    });

    return recipeData;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}



export async function getRecipes() {
  try {
    const recipes = await db.query.recipe.findMany({
      with: {
        user: {
          columns: {
            name: true
          }
        },
        categories: {
          with: {
            category: true,
          },
        },
        allergies: {
          with: {
            allergy: true,
          },
        },
        instructions: {
          orderBy: (table) => [
            asc(table.stepNumber)
          ],
        },
        ingredients: {
          with: {
            unit: true,
          },
        },
        reviews: {
          with: {
            user: true,
          },
          orderBy: (table) => [
            desc(table.createdAt)
          ],
        },
      },
      orderBy: (table) => [
        desc(table.createdAt)
      ],
    });

    return recipes
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return null
  }
}