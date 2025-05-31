import { NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = currentUser.role?.name;
    if (userRole !== "Moderator" && userRole !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ 
      message: "Access granted",
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      }
    });
  } catch (error) {
    console.error("Error checking moderator access:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
