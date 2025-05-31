import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { desc, eq } from "drizzle-orm";
import { allergy } from "@/db/schema";
import { getCurrentUser } from "@/db/queries/user-queries";
import { createAllergySchema, updateAllergySchema } from '@/lib/schemas/admin';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const allergies = await db.query.allergy.findMany({
      orderBy: [desc(allergy.name)],
      with: {
        users: true,
        recipes: true,
      },
    });

    // Transform data to include counts
    const allergiesWithCounts = allergies.map(allergyItem => ({
      id: allergyItem.id,
      name: allergyItem.name,
      userCount: allergyItem.users.length,
      recipeCount: allergyItem.recipes.length,
    }));

    return NextResponse.json({ allergies: allergiesWithCounts });
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return NextResponse.json(
      { error: "Greška prilikom dohvaćanja alergija" },
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
    
    const validationResult = createAllergySchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Neispravni podaci";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;

    const existingAllergy = await db.query.allergy.findFirst({
      where: eq(allergy.name, name),
    });

    if (existingAllergy) {
      return NextResponse.json(
        { error: "Alergija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const newAllergy = await db
      .insert(allergy)
      .values({ name })
      .returning();

    return NextResponse.json({ allergy: newAllergy[0] });
  } catch (error) {
    console.error("Error creating allergy:", error);
    return NextResponse.json(
      { error: "Greška prilikom stvaranja alergije" },
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
    const allergyId = searchParams.get("allergyId");
    const body = await req.json();

    if (!allergyId) {
      return NextResponse.json(
        { error: "ID alergije je obavezan" },
        { status: 400 }
      );
    }

    const validationResult = updateAllergySchema.safeParse(body);
    
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
    }

    const existingAllergy = await db.query.allergy.findFirst({
      where: eq(allergy.name, name),
    });

    if (existingAllergy && existingAllergy.id !== allergyId) {
      return NextResponse.json(
        { error: "Alergija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const updatedAllergy = await db
      .update(allergy)
      .set({ name })
      .where(eq(allergy.id, allergyId))
      .returning();

    if (!updatedAllergy.length) {
      return NextResponse.json(
        { error: "Alergija nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: updatedAllergy[0] });
  } catch (error) {
    console.error("Error updating allergy:", error);
    return NextResponse.json(
      { error: "Greška prilikom ažuriranja alergije" },
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
    const allergyId = searchParams.get("allergyId");

    if (!allergyId) {
      return NextResponse.json(
        { error: "ID alergije je obavezan" },
        { status: 400 }
      );
    }

    const deletedAllergy = await db
      .delete(allergy)
      .where(eq(allergy.id, allergyId))
      .returning();

    if (!deletedAllergy.length) {
      return NextResponse.json(
        { error: "Alergija nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: deletedAllergy[0] });
  } catch (error) {
    console.error("Error deleting allergy:", error);
    return NextResponse.json(
      { error: "Greška prilikom brisanja alergije" },
      { status: 500 }
    );
  }
}
