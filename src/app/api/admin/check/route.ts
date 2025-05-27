import { NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ hasAdminAccess: true });
  } catch (error) {
    console.error("Error checking admin access:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
