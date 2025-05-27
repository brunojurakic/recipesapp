import { db } from "@/db/drizzle";
import { user, recipe, review, bookmark } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export async function getAdminStats() {
  const [userCount] = await db.select({ count: count() }).from(user);
  const [recipeCount] = await db.select({ count: count() }).from(recipe);
  const [reviewCount] = await db.select({ count: count() }).from(review);
  const [bookmarkCount] = await db.select({ count: count() }).from(bookmark);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const [newUsersCount] = await db
    .select({ count: count() })
    .from(user)
    .where(sql`${user.createdAt} >= ${thirtyDaysAgo}`);

  const [newRecipesCount] = await db
    .select({ count: count() })
    .from(recipe)
    .where(sql`${recipe.createdAt} >= ${thirtyDaysAgo}`);

  const [avgRating] = await db
    .select({ average: sql<number>`AVG(${review.rating})` })
    .from(review);

  return {
    totalUsers: userCount.count,
    totalRecipes: recipeCount.count,
    totalReviews: reviewCount.count,
    totalBookmarks: bookmarkCount.count,
    newUsers30Days: newUsersCount.count,
    newRecipes30Days: newRecipesCount.count,
    averageRating: avgRating.average ? Number(avgRating.average) : 0,
  };
}
