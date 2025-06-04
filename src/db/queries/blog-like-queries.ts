import { db } from "@/db/drizzle"
import { blogLike, blog } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export async function getBlogLike(blogId: string, userId: string) {
  return await db.query.blogLike.findFirst({
    where: and(eq(blogLike.blogId, blogId), eq(blogLike.userId, userId)),
  })
}

export async function isBlogLiked(blogId: string, userId: string) {
  const existingLike = await getBlogLike(blogId, userId)
  return Boolean(existingLike)
}

export async function createBlogLike(blogId: string, userId: string) {
  const [newLike] = await db
    .insert(blogLike)
    .values({
      blogId,
      userId,
      createdAt: new Date(),
    })
    .returning()
  return newLike
}

export async function deleteBlogLike(blogId: string, userId: string) {
  await db
    .delete(blogLike)
    .where(and(eq(blogLike.blogId, blogId), eq(blogLike.userId, userId)))
  return true
}

export async function toggleBlogLike(blogId: string, userId: string) {
  const existing = await getBlogLike(blogId, userId)

  if (existing) {
    await deleteBlogLike(blogId, userId)
    await db
      .update(blog)
      .set({
        likeCount: sql`${blog.likeCount} - 1`,
      })
      .where(eq(blog.id, blogId))
    return false
  } else {
    await createBlogLike(blogId, userId)
    await db
      .update(blog)
      .set({
        likeCount: sql`${blog.likeCount} + 1`,
      })
      .where(eq(blog.id, blogId))
    return true
  }
}
