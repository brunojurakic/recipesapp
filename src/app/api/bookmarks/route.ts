import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isRecipeBookmarked, toggleBookmark } from "@/lib/utils/drizzle_queries";



export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await req.json();
    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const isBookmarked = await toggleBookmark(recipeId, session.user.id);
    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error("Error processing bookmark:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");
    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const isBookmarked = await isRecipeBookmarked(recipeId, session.user.id);
    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
