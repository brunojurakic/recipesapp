import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { getOrCreateKorisnikRole, assignRoleToUser, getDefaultUserRole } from "@/db/queries";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  },  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const korisnikRole = await getDefaultUserRole();
            
            await assignRoleToUser(user.id, korisnikRole.id);
            
            console.log(`Assigned "Korisnik" role (${korisnikRole.id}) to user ${user.id}`);
          } catch (error) {
            console.error("Failed to assign role to user:", error);
          }
        }
      }
    }
  }
});