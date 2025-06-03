import { db } from "@/db/drizzle";
import { blog } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getAllBlogs() {
  return await db.query.blog.findMany({
    orderBy: [desc(blog.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getBlogById(id: string) {
  return await db.query.blog.findFirst({
    where: eq(blog.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createBlog(data: {
  name: string;
  description: string;
  content: string;
  imagePath: string;
  userId: string;
}) {
  const newBlog = await db
    .insert(blog)
    .values({
      name: data.name,
      description: data.description,
      content: data.content,
      imagePath: data.imagePath,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newBlog[0];
}

export async function updateBlog(
  id: string,
  data: {
    name: string;
    description: string;
    content: string;
  }
) {
  const updatedBlog = await db
    .update(blog)
    .set({
      name: data.name,
      description: data.description,
      content: data.content,
      updatedAt: new Date(),
    })
    .where(eq(blog.id, id))
    .returning();

  return updatedBlog[0] || null;
}

export async function deleteBlog(id: string) {
  const deletedBlog = await db
    .delete(blog)
    .where(eq(blog.id, id))
    .returning();

  return deletedBlog[0] || null;
}

export async function incrementViewCount(id: string) {
  const updatedBlog = await db
    .update(blog)
    .set({
      viewCount: sql`${blog.viewCount} + 1`,
    })
    .where(eq(blog.id, id))
    .returning();

  return updatedBlog[0] || null;
}
