import { db } from "@/db/drizzle"
import { review } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

export async function addReview(
  recipeId: string,
  userId: string,
  content: string,
  rating: number,
) {
  await db.insert(review).values({
    recipeId,
    userId,
    content,
    rating,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function getAllReviewsForAdmin() {
  try {
    return await db.query.review.findMany({
      columns: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        recipe: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: (table) => [desc(table.createdAt)],
    })
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return []
  }
}

export async function deleteReviewById(reviewId: string) {
  try {
    await db.delete(review).where(eq(review.id, reviewId))
    return true
  } catch (error) {
    console.error("Error deleting review:", error)
    return false
  }
}

export async function updateReview(
  reviewId: string,
  userId: string,
  content: string,
  rating: number,
) {
  try {
    const updateData: Partial<typeof review.$inferInsert> = {
      content,
      rating,
      updatedAt: new Date(),
    }

    const result = await db
      .update(review)
      .set(updateData)
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning({ id: review.id })

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating review:", error)
    return null
  }
}

export async function deleteReview(reviewId: string, userId: string) {
  try {
    const result = await db
      .delete(review)
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning({ id: review.id })

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error deleting review:", error)
    return null
  }
}
