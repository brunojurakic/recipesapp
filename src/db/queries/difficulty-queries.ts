import { db } from "@/db/drizzle"

export async function getAllDifficulties() {
  try {
    return await db.query.difficulty.findMany({
      orderBy: (table) => [table.level],
    })
  } catch (error) {
    console.error("Error fetching difficulties:", error)
    return []
  }
}
