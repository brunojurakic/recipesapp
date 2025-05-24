import { db } from "@/db/drizzle";
import { userAllergy } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

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
