import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { addReview, getRecipeAuthorId } from "@/db/queries"
import { reviewSchema } from "@/lib/validations/review-schema"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = reviewSchema.parse(body)
    const authorId = await getRecipeAuthorId(validatedData.recipeId)
    if (!authorId) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    if (authorId === session.user.id) {
      return NextResponse.json(
        { error: "Ne možete ostaviti recenziju na vlastiti recept" },
        { status: 403 },
      )
    }

    await addReview(
      validatedData.recipeId,
      session.user.id,
      validatedData.content,
      validatedData.rating,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
