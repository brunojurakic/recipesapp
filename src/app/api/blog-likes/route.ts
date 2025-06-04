import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { isBlogLiked, toggleBlogLike } from "@/db/queries"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { blogId } = await req.json()
    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      )
    }

    const isLiked = await toggleBlogLike(blogId, session.user.id)
    return NextResponse.json({ isLiked })
  } catch (error) {
    console.error("Error processing blog like:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get("blogId")
    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      )
    }

    const isLiked = await isBlogLiked(blogId, session.user.id)
    return NextResponse.json({ isLiked })
  } catch (error) {
    console.error("Error checking blog like status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
