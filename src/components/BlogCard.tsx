import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, Heart, Calendar, User } from 'lucide-react';

interface BlogCardProps {
  blog: {
    id: string;
    name: string;
    description: string;
    imagePath: string;
    viewCount: number;
    likeCount: number;
    createdAt: Date;
    user: {
      name: string;
    };
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden">
      <Link href={`/blog/${blog.id}`}>
        <div className="relative w-full h-48">
          <Image
            src={blog.imagePath}
            alt={blog.name}
            fill
            className="object-cover"
          />
        </div>
        
        <CardHeader className="pb-3">
          <h3 className="text-xl font-semibold line-clamp-2 mb-2">
            {blog.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {blog.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{blog.user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{blog.createdAt.toLocaleDateString('hr-HR')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{blog.viewCount} pregleda</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{blog.likeCount} lajkova</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
