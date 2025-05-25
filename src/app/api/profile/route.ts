import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserById, updateUserProfile } from "@/db/queries";
import { saveImage } from "@/lib/utils/functions";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
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

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File | null;

    let imagePath: string | null = null;

    if (image && image.size > 0) {
      try {
        imagePath = await saveImage(image);
      } catch (error) {
        console.error('Error saving image:', error);
        return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
      }
    }

    const updateData: { name?: string; image?: string | null } = {};

    if (name) {
      updateData.name = name;
    }

    if (imagePath !== null) {
      updateData.image = imagePath;
    }

    const updatedUser = await updateUserProfile(session.user.id, updateData);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
