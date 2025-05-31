import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { desc, eq } from "drizzle-orm";
import { allergy } from "@/db/schema";
import { getCurrentUser } from "@/db/queries/user-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
      { error: "Error fetching allergies" },
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
        { error: "Allergy name must be between 2 and 30 characters" },
        { status: 400 }
      );
    }

    const existingAllergy = await db.query.allergy.findFirst({
      where: eq(allergy.name, name),
    });

    if (existingAllergy) {
      return NextResponse.json(
        { error: "Allergy with this name already exists" },
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
      { error: "Error creating allergy" },
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
    const allergyId = searchParams.get("allergyId");
    const { name } = await req.json();

    if (!allergyId) {
      return NextResponse.json(
        { error: "Allergy ID is required" },
        { status: 400 }
      );
    }

    if (!name || name.length < 2 || name.length > 30) {
      return NextResponse.json(
        { error: "Allergy name must be between 2 and 30 characters" },
        { status: 400 }
      );
    }

    const existingAllergy = await db.query.allergy.findFirst({
      where: eq(allergy.name, name),
    });

    if (existingAllergy && existingAllergy.id !== allergyId) {
      return NextResponse.json(
        { error: "Allergy with this name already exists" },
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
        { error: "Allergy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: updatedAllergy[0] });
  } catch (error) {
    console.error("Error updating allergy:", error);
    return NextResponse.json(
      { error: "Error updating allergy" },
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
    const allergyId = searchParams.get("allergyId");

    if (!allergyId) {
      return NextResponse.json(
        { error: "Allergy ID is required" },
        { status: 400 }
      );
    }

    const deletedAllergy = await db
      .delete(allergy)
      .where(eq(allergy.id, allergyId))
      .returning();

    if (!deletedAllergy.length) {
      return NextResponse.json(
        { error: "Allergy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: deletedAllergy[0] });
  } catch (error) {
    console.error("Error deleting allergy:", error);
    return NextResponse.json(
      { error: "Error deleting allergy" },
      { status: 500 }
    );
  }
}
