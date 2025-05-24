import { db } from "@/db/drizzle";
import { review } from "@/db/schema";

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
