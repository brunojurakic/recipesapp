import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { desc, eq } from "drizzle-orm";
import { category } from "@/db/schema";
import { getCurrentUser } from "@/db/queries/user-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const categories = await db.query.category.findMany({
      orderBy: [desc(category.name)],
      with: {
        recipes: true,
      },
    });

    const categoriesWithCounts = categories.map(categoryItem => ({
      id: categoryItem.id,
      name: categoryItem.name,
      recipeCount: categoryItem.recipes.length,
    }));

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name } = await req.json();
    
    if (!name || name.length < 2 || name.length > 30) {
      return NextResponse.json(
        { error: "Category name must be between 2 and 30 characters" },
        { status: 400 }
      );
    }

    const existingCategory = await db.query.category.findFirst({
      where: eq(category.name, name),
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategory = await db
      .insert(category)
      .values({ name })
      .returning();

    return NextResponse.json({ category: newCategory[0] });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Error creating category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const { name } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    if (!name || name.length < 2 || name.length > 30) {
      return NextResponse.json(
        { error: "Category name must be between 2 and 30 characters" },
        { status: 400 }
      );
    }

    const existingCategory = await db.query.category.findFirst({
      where: eq(category.name, name),
    });

    if (existingCategory && existingCategory.id !== categoryId) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const updatedCategory = await db
      .update(category)
      .set({ name })
      .where(eq(category.id, categoryId))
      .returning();

    if (!updatedCategory.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: updatedCategory[0] });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const deletedCategory = await db
      .delete(category)
      .where(eq(category.id, categoryId))
      .returning();

    if (!deletedCategory.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: deletedCategory[0] });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 }
    );
  }
}
