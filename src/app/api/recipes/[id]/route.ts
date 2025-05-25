import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { deleteRecipe, getRecipe } from "@/db/queries";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const recipe = await getRecipe(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You can only delete your own recipes" }, { status: 403 });
    }

    const success = await deleteRecipe(id);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
