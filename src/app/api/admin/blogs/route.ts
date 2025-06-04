import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCurrentUser } from "@/db/queries/user-queries"
import { getAllBlogs, deleteBlog } from "@/db/queries/blog-queries"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      )
    }

    const isAdmin = currentUser?.role?.name === "Admin"
    const isModerator = currentUser?.role?.name === "Moderator"
    const hasAccess = isAdmin || isModerator

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Nemate dozvolu za pristup ovim podacima" },
        { status: 403 },
      )
    }

    const blogs = await getAllBlogs()

    const formattedBlogs = blogs.map((blog) => ({
      id: blog.id,
      name: blog.name,
      description: blog.description,
      viewCount: blog.viewCount,
      likeCount: blog.likeCount,
      createdAt: blog.createdAt.toISOString(),
      user: {
        name: blog.user.name,
        id: blog.user.id,
      },
    }))

    return NextResponse.json({ blogs: formattedBlogs })
  } catch (error) {
    console.error("Error fetching blogs for admin:", error)
    return NextResponse.json(
      { error: "Greška pri dohvaćanju blogova" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 },
      )
    }

    const isAdmin = currentUser?.role?.name === "Admin"
    const isModerator = currentUser?.role?.name === "Moderator"
    const hasAccess = isAdmin || isModerator

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Nemate dozvolu za brisanje blogova" },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get("blogId")

    if (!blogId) {
      return NextResponse.json(
        { error: "ID bloga je obavezan" },
        { status: 400 },
      )
    }

    const deletedBlog = await deleteBlog(blogId)

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog nije pronađen ili je već obrisan" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      message: "Blog je uspješno obrisan",
      deletedBlog,
    })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: "Greška pri brisanju bloga" },
      { status: 500 },
    )
  }
}
