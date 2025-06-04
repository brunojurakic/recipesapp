import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getCurrentUser } from "@/db/queries/user-queries"
import { getAllBlogs } from "@/db/queries/blog-queries"
import { headers } from "next/headers"
import { PenSquare } from "lucide-react"
import BlogCard from "@/components/BlogCard"

export const metadata: Metadata = {
  title: "ReceptiNet - Blog",
  description:
    "Pročitajte naše najnovije članke o kulinarstvu, receptima i kuharskim trikovima. Otkrijte savjete i inspiracije za vašu kuhinju.",
  keywords: [
    "blog",
    "kulinarski članci",
    "recepti",
    "kuharstvo",
    "savjeti",
    "trikovi",
  ],
}
export default async function BlogPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const currentUser = session ? await getCurrentUser() : null
  const isAdmin = currentUser?.role?.name === "Admin"
  const isModerator = currentUser?.role?.name === "Moderator"
  const canWriteBlog = isAdmin || isModerator

  const blogs = await getAllBlogs()

  return (
    <div className="container mx-auto px-4 py-8 pt-25">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pratite naše članke o kulinarstvu i poboljšajte svoje vještine u
            kuhinji
          </p>
        </div>

        {canWriteBlog && (
          <Button asChild className="ml-4">
            <Link href="/blog/new">
              <PenSquare className="mr-2 h-4 w-4" />
              Napiši blog
            </Link>
          </Button>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Trenutno nema objavljenih članaka
          </p>
          {canWriteBlog && (
            <Button variant={"outline"} asChild className="mt-4">
              <Link href="/blog/new">
                <PenSquare className="mr-2 h-4 w-4" />
                Napiši prvi blog
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}
