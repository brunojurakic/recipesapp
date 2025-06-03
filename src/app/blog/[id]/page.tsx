import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogById, incrementViewCount } from '@/db/queries/blog-queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Eye, Heart, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return {
      title: 'Blog članak nije pronađen - ReceptiNet',
      description: 'Traženi blog članak ne postoji.',
    };
  }

  return {
    title: `${blog.name} - ReceptiNet Blog`,
    description: blog.description,
    keywords: ['blog', 'kulinarski članci', 'recepti', 'kuharstvo'],
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  await incrementViewCount(id);

  const formattedDate = new Intl.DateTimeFormat('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(blog.createdAt);

  return (
    <div className="container mx-auto px-4 py-8 pt-25">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad na blog
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {blog.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {blog.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{blog.viewCount + 1} pregleda</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{blog.likeCount} lajkova</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap text-foreground leading-relaxed"
                style={{ wordBreak: 'break-word' }}
              >
                {blog.content}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/blog">
              Pogledaj sve članke
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
