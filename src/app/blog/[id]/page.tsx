import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogById, incrementViewCount } from "@/db/queries/blog-queries"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Heart, Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BlogLikeButton } from "@/components/blog_page/BlogLikeButton"

interface BlogPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params
  const blog = await getBlogById(id)

  if (!blog) {
    return {
      title: "Blog članak nije pronađen - ReceptiNet",
      description: "Traženi blog članak ne postoji.",
    }
  }

  return {
    title: `ReceptiNet Blog - ${blog.name}`,
    description: blog.description,
    keywords: ["blog", "kulinarski članci", "recepti", "kuharstvo"],
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params
  const blog = await getBlogById(id)

  if (!blog) {
    notFound()
  }

  await incrementViewCount(id)

  const formattedDate = new Intl.DateTimeFormat("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(blog.createdAt)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na blog
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <div className="relative w-full h-64 md:h-80 lg:h-96">
                  <Image
                    src={blog.imagePath}
                    alt={blog.name}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {blog.name}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {blog.description}
                  </p>
                </div>
              </div>

              <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6">
                <div
                  className="whitespace-pre-wrap text-foreground leading-relaxed text-lg"
                  style={{ wordBreak: "break-word", lineHeight: "1.8" }}
                >
                  {blog.content}
                </div>
              </article>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-2xl p-6 space-y-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Informacije o članku
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Autor</p>
                    <p className="font-medium text-foreground">
                      {blog.user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objavljeno</p>
                    <p className="font-medium text-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pregledi</p>
                    <p className="font-medium text-foreground">
                      {blog.viewCount + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lajkovi</p>
                    <p className="font-medium text-foreground">
                      {blog.likeCount}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-muted">
                  <BlogLikeButton blogId={blog.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Istražite više članaka
            </h3>
            <p className="text-muted-foreground mb-6">
              Otkrijte više korisnih savjeta i recepata na našem blogu
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/blog">Pogledaj sve članke</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
