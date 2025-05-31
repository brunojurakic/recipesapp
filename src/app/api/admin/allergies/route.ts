import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";
import { createAllergySchema, updateAllergySchema } from '@/lib/schemas/admin';
import { 
  getAllAllergiesWithCounts, 
  createAllergy, 
  findAllergyByName, 
  updateAllergy, 
  deleteAllergy 
} from "@/db/queries/allergy-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    }

    const allergiesWithCounts = await getAllAllergiesWithCounts();

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

    const existingAllergy = await findAllergyByName(name);

    if (existingAllergy) {
      return NextResponse.json(
        { error: "Alergija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const newAllergy = await createAllergy(name);

    return NextResponse.json({ allergy: newAllergy });
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

    const existingAllergy = await findAllergyByName(name);

    if (existingAllergy && existingAllergy.id !== allergyId) {
      return NextResponse.json(
        { error: "Alergija s ovim nazivom već postoji" },
        { status: 400 }
      );
    }

    const updatedAllergy = await updateAllergy(allergyId, name);

    if (!updatedAllergy) {
      return NextResponse.json(
        { error: "Alergija nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: updatedAllergy });
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

    const deletedAllergy = await deleteAllergy(allergyId);

    if (!deletedAllergy) {
      return NextResponse.json(
        { error: "Alergija nije pronađena" },
        { status: 404 }
      );
    }

    return NextResponse.json({ allergy: deletedAllergy });
  } catch (error) {
    console.error("Error deleting allergy:", error);
    return NextResponse.json(
      { error: "Greška prilikom brisanja alergije" },
      { status: 500 }
    );
  }
}
