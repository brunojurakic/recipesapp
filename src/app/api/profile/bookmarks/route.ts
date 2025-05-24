import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserBookmarks } from "@/db/queries";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await getUserBookmarks(session.user.id);

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
