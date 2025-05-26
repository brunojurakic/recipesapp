import { db } from "@/db/drizzle";
import { recipe } from "@/db/schema";
import { asc, desc, eq, and, like, lte, gte, inArray } from "drizzle-orm";
import { recipeCategory, recipeAllergy } from "@/db/schema";

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

export async function deleteRecipe(id: string) {
  try {
    await db.delete(recipe).where(eq(recipe.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
}

export async function getFilteredRecipes(filters: {
  search?: string;
  categoryIds?: string[];
  allergyIds?: string[];
  maxPrepTime?: number;
  minServings?: number;
}) {
  try {
    const basicConditions = [];

    if (filters.search && filters.search.trim()) {
      basicConditions.push(like(recipe.title, `%${filters.search.trim()}%`));
    }

    if (filters.maxPrepTime && filters.maxPrepTime > 0) {
      basicConditions.push(lte(recipe.preparationTime, filters.maxPrepTime));
    }

    if (filters.minServings && filters.minServings > 0) {
      basicConditions.push(gte(recipe.servings, filters.minServings));
    }

    let candidateRecipeIds: string[] = [];

    if (basicConditions.length > 0) {
      const basicResults = await db
        .select({ id: recipe.id })
        .from(recipe)
        .where(and(...basicConditions));
      candidateRecipeIds = basicResults.map(r => r.id);
    } else {
      const allResults = await db
        .select({ id: recipe.id })
        .from(recipe);
      candidateRecipeIds = allResults.map(r => r.id);
    }

    if (candidateRecipeIds.length === 0) {
      return [];
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      const recipesWithCategories = await db
        .select({ recipeId: recipeCategory.recipeId })
        .from(recipeCategory)
        .where(
          and(
            inArray(recipeCategory.recipeId, candidateRecipeIds),
            inArray(recipeCategory.categoryId, filters.categoryIds)
          )
        );

      candidateRecipeIds = [...new Set(recipesWithCategories.map(r => r.recipeId))];
    }

    if (candidateRecipeIds.length === 0) {
      return [];
    }

    if (filters.allergyIds && filters.allergyIds.length > 0) {
      const recipesWithExcludedAllergies = await db
        .select({ recipeId: recipeAllergy.recipeId })
        .from(recipeAllergy)
        .where(
          and(
            inArray(recipeAllergy.recipeId, candidateRecipeIds),
            inArray(recipeAllergy.allergyId, filters.allergyIds)
          )
        );

      const excludedRecipeIds = new Set(recipesWithExcludedAllergies.map(r => r.recipeId));
      candidateRecipeIds = candidateRecipeIds.filter(id => !excludedRecipeIds.has(id));
    }

    if (candidateRecipeIds.length === 0) {
      return [];
    }

    const recipes = await db.query.recipe.findMany({
      where: inArray(recipe.id, candidateRecipeIds),
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

    return recipes;
  } catch (error) {
    console.error('Error fetching filtered recipes:', error);
    return null;
  }
}
