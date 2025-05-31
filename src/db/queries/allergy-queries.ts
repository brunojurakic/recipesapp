import { db } from "@/db/drizzle";
import { userAllergy, allergy } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";

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

export async function getAllAllergiesWithCounts() {
  const allergies = await db.query.allergy.findMany({
    orderBy: [desc(allergy.name)],
    with: {
      users: true,
      recipes: true,
    },
  });

  return allergies.map(allergyItem => ({
    id: allergyItem.id,
    name: allergyItem.name,
    userCount: allergyItem.users.length,
    recipeCount: allergyItem.recipes.length,
  }));
}

export async function createAllergy(name: string) {
  const newAllergy = await db
    .insert(allergy)
    .values({ name })
    .returning();

  return newAllergy[0];
}

export async function findAllergyByName(name: string) {
  return await db.query.allergy.findFirst({
    where: eq(allergy.name, name),
  });
}

export async function updateAllergy(allergyId: string, name: string) {
  const updatedAllergy = await db
    .update(allergy)
    .set({ name })
    .where(eq(allergy.id, allergyId))
    .returning();

  return updatedAllergy[0] || null;
}

export async function deleteAllergy(allergyId: string) {
  const deletedAllergy = await db
    .delete(allergy)
    .where(eq(allergy.id, allergyId))
    .returning();

  return deletedAllergy[0] || null;
}
