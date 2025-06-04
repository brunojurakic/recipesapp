import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { updateReview, deleteReview } from "@/db/queries"
import { updateReviewSchema } from "@/lib/validations/review-schema"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const validatedData = updateReviewSchema.parse(body)

    const updatedReview = await updateReview(
      id,
      session.user.id,
      validatedData.content,
      validatedData.rating,
    )

    if (!updatedReview) {
      return NextResponse.json(
        { error: "Recenzija nije pronađena ili nemate dozvolu za uređivanje" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const deletedReview = await deleteReview(id, session.user.id)

    if (!deletedReview) {
      return NextResponse.json(
        { error: "Recenzija nije pronađena ili nemate dozvolu za brisanje" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
