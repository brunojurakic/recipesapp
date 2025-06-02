import { db } from "@/db/drizzle";
import { category } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function getAllCategories() {
  return await db.query.category.findMany({
    orderBy: (table) => [asc(table.name)]
  });
}

export async function getAllCategoriesWithCounts() {
  const categories = await db.query.category.findMany({
    orderBy: [desc(category.name)],
    with: {
      recipes: true,
    },
  });

  return categories.map(categoryItem => ({
    id: categoryItem.id,
    name: categoryItem.name,
    image_path: categoryItem.image_path,
    recipeCount: categoryItem.recipes.length,
  }));
}

export async function createCategory(name: string, image_path: string) {
  const newCategory = await db
    .insert(category)
    .values({ name, image_path })
    .returning();

  return newCategory[0];
}

export async function findCategoryByName(name: string) {
  return await db.query.category.findFirst({
    where: eq(category.name, name),
  });
}

export async function updateCategory(categoryId: string, name: string, image_path?: string) {
  const updateData: { name: string; image_path?: string } = { name };
  if (image_path) {
    updateData.image_path = image_path;
  }

  const updatedCategory = await db
    .update(category)
    .set(updateData)
    .where(eq(category.id, categoryId))
    .returning();

  return updatedCategory[0] || null;
}

export async function deleteCategory(categoryId: string) {
  const deletedCategory = await db
    .delete(category)
    .where(eq(category.id, categoryId))
    .returning();

  return deletedCategory[0] || null;
}
