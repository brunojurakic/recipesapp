import { db } from "@/db/drizzle";
import { user, recipe, bookmark } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserById(userId: string) {
  return await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserRecipes(userId: string) {
  return await db.query.recipe.findMany({
    where: eq(recipe.userId, userId),
    with: {
      user: {
        columns: {
          name: true,
          image: true,
        }
      },
      categories: {
        with: {
          category: true,
        },
      },
      allergies: {
        with: {
          allergy: true,
        },
      },
      reviews: {
        with: {
          user: true,
        },
        orderBy: (table) => [
          desc(table.createdAt)
        ],
      },
    },
    orderBy: (table) => [
      desc(table.createdAt)
    ],
  });
}

export async function getUserBookmarks(userId: string) {
  return await db.query.bookmark.findMany({
    where: eq(bookmark.userId, userId),
    with: {
      recipe: {
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            }
          },
          categories: {
            with: {
              category: true,
            },
          },
          allergies: {
            with: {
              allergy: true,
            },
          },
          reviews: {
            with: {
              user: true,
            },
            orderBy: (table) => [
              desc(table.createdAt)
            ],
          },
        },
      },
    },
    orderBy: (table) => [
      desc(table.createdAt)
    ],
  });
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  image?: string | null;
}) {
  const [updatedUser] = await db
    .update(user)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

  return updatedUser;
}
