import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/db/queries/user-queries"
import { getModeratorRole, assignRoleToUser } from "@/db/queries"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role?.name !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 },
      )
    }

    const moderatorRole = await getModeratorRole()

    await assignRoleToUser(userId, moderatorRole.id)

    return NextResponse.json({
      message: "User promoted to moderator successfully",
      role: moderatorRole,
    })
  } catch (error) {
    console.error("Error promoting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
