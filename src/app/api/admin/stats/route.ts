import { NextResponse } from "next/server";
import { getCurrentUser } from "@/db/queries/user-queries";
import { getAdminStats } from "@/db/queries/stats-queries";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = await getAdminStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
