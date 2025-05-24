import { db } from "@/db/drizzle";
import { bookmark, recipe, review, userAllergy } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";

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


export async function getBookmark(recipeId: string, userId: string) {
  return await db.query.bookmark.findFirst({
    where: and(
      eq(bookmark.recipeId, recipeId),
      eq(bookmark.userId, userId)
    ),
  });
}


export async function isRecipeBookmarked(recipeId: string, userId: string) {
  const existingBookmark = await getBookmark(recipeId, userId);
  return Boolean(existingBookmark);
}


export async function createBookmark(recipeId: string, userId: string) {
  const [newBookmark] = await db.insert(bookmark).values({
    recipeId,
    userId,
    createdAt: new Date(),
  }).returning();
  return newBookmark;
}

export async function deleteBookmark(recipeId: string, userId: string) {
  await db.delete(bookmark).where(
    and(
      eq(bookmark.recipeId, recipeId),
      eq(bookmark.userId, userId)
    )
  );
  return true;
}

export async function toggleBookmark(recipeId: string, userId: string) {
  const existing = await getBookmark(recipeId, userId);

  if (existing) {
    await deleteBookmark(recipeId, userId);
    return false;
  } else {
    await createBookmark(recipeId, userId);
    return true;
  }
}

export async function addReview(recipeId: string, userId: string, content: string | null, rating: number) {
  await db.insert(review).values({
    recipeId,
    userId,
    content,
    rating,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function getAllAllergies() {
  return await db.query.allergy.findMany({
    orderBy: (table) => [asc(table.name)]
  });
}

export async function getUserAllergies(userId: string) {
  return await db.query.userAllergy.findMany({
    where: eq(userAllergy.userId, userId),
    with: {
      allergy: true
    }
  });
}

export async function addUserAllergy(userId: string, allergyId: string) {
  await db.insert(userAllergy).values({
    userId,
    allergyId
  });
}

export async function removeUserAllergy(userId: string, allergyId: string) {
  await db.delete(userAllergy)
    .where(and(
      eq(userAllergy.userId, userId),
      eq(userAllergy.allergyId, allergyId)
    ));
}

export async function updateUserAllergies(userId: string, allergyIds: string[]) {
  await db.delete(userAllergy).where(eq(userAllergy.userId, userId));
  
  if (allergyIds.length > 0) {
    await db.insert(userAllergy).values(
      allergyIds.map(allergyId => ({
        userId,
        allergyId
      }))
    );
  }
}