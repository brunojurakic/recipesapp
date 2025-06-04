import { db } from "@/db/drizzle"
import { role, user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getDefaultUserRole() {
  const korisnikRole = await db.query.role.findFirst({
    where: (role, { eq }) => eq(role.name, "Korisnik"),
  })

  if (korisnikRole) {
    return korisnikRole
  }

  const [newRole] = await db
    .insert(role)
    .values({
      name: "Korisnik",
      description: "Standardna korisnička uloga za sve nove korisnike",
    })
    .returning()

  return newRole
}

export async function assignRoleToUser(userId: string, roleId: string) {
  await db.update(user).set({ roleId }).where(eq(user.id, userId))
}

export async function getModeratorRole() {
  const moderatorRole = await db.query.role.findFirst({
    where: (role, { eq }) => eq(role.name, "Moderator"),
  })

  if (moderatorRole) {
    return moderatorRole
  }

  const [newRole] = await db
    .insert(role)
    .values({
      name: "Moderator",
      description: "Moderatorska uloga za upravljanje sadržajem",
    })
    .returning()

  return newRole
}
