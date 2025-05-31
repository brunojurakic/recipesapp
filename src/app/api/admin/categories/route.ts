import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";
import { createCategorySchema, updateCategorySchema } from '@/lib/schemas/admin';
import { 
  getAllCategoriesWithCounts, 
  createCategory, 
  findCategoryByName, 
  updateCategory, 
  deleteCategory 
} from "@/db/queries/category-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const categoriesWithCounts = await getAllCategoriesWithCounts();

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Greška prilikom dohvaćanja kategorija" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const body = await req.json();
    
    const validationResult = createCategorySchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Neispravni podaci";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }    const { name } = validationResult.data;

    const existingCategory = await findCategoryByName(name);

    if (existingCategory) {
      return NextResponse.json(
        { error: "Kategorija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const newCategory = await createCategory(name);

    return NextResponse.json({ category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Greška prilikom stvaranja kategorije" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const body = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID kategorije je obavezan" },
        { status: 400 }
      );
    }

    const validationResult = updateCategorySchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Neispravni podaci";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;

    if (!name) {
      return NextResponse.json(
        { error: "Naziv je obavezan" },
        { status: 400 }
      );
    }    const existingCategory = await findCategoryByName(name);

    if (existingCategory && existingCategory.id !== categoryId) {
      return NextResponse.json(
        { error: "Kategorija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const updatedCategory = await updateCategory(categoryId, name);

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      );
    }    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Greška prilikom ažuriranja kategorije" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID kategorije je obavezan" },
        { status: 400 }
      );
    }    const deletedCategory = await deleteCategory(categoryId);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Greška prilikom brisanja kategorije" },
      { status: 500 }
    );
  }
}
