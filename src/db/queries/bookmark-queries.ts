import { db } from "@/db/drizzle"
import { bookmark } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function getBookmark(recipeId: string, userId: string) {
  return await db.query.bookmark.findFirst({
    where: and(eq(bookmark.recipeId, recipeId), eq(bookmark.userId, userId)),
  })
}

export async function isRecipeBookmarked(recipeId: string, userId: string) {
  const existingBookmark = await getBookmark(recipeId, userId)
  return Boolean(existingBookmark)
}

export async function createBookmark(recipeId: string, userId: string) {
  const [newBookmark] = await db
    .insert(bookmark)
    .values({
      recipeId,
      userId,
      createdAt: new Date(),
    })
    .returning()
  return newBookmark
}

export async function deleteBookmark(recipeId: string, userId: string) {
  await db
    .delete(bookmark)
    .where(and(eq(bookmark.recipeId, recipeId), eq(bookmark.userId, userId)))
  return true
}

export async function toggleBookmark(recipeId: string, userId: string) {
  const existing = await getBookmark(recipeId, userId)

  if (existing) {
    await deleteBookmark(recipeId, userId)
    return false
  } else {
    await createBookmark(recipeId, userId)
    return true
  }
}
