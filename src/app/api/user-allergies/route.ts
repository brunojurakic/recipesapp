import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAllAllergies, getUserAllergies, updateUserAllergies } from "@/lib/utils/drizzle_queries";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [allAllergies, userAllergies] = await Promise.all([
      getAllAllergies(),
      getUserAllergies(session.user.id)
    ]);

    return NextResponse.json({
      allAllergies,
      userAllergies: userAllergies.map(ua => ua.allergy)
    });
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allergyIds } = await request.json();

    if (!Array.isArray(allergyIds)) {
      return NextResponse.json({ error: "Invalid allergy IDs" }, { status: 400 });
    }

    await updateUserAllergies(session.user.id, allergyIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user allergies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
