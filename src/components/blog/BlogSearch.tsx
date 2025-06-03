'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { useDebounce } from 'use-debounce';

interface Blog {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

interface BlogSearchProps {
  blogs: Blog[];
}

export default function BlogSearch({ blogs }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  
  const isSearching = searchTerm !== debouncedSearchTerm;

  const filteredBlogs = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return blogs;
    }

    return blogs.filter(blog =>
      blog.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [blogs, debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        {isSearching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type="text"
          placeholder="Pretražite članke po naslovu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {debouncedSearchTerm ? 'Nema rezultata za pretragu' : 'Trenutno nema objavljenih članaka'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
