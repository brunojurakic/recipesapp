"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeCard } from "@/components/RecipeCard";
import { toast } from "sonner";
import { Loader2, Bookmark } from "lucide-react";
import Link from "next/link";

interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string;
  image_path: string;
  servings: number;
  preparationTime: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
}

interface Bookmark {
  recipe: Recipe;
  createdAt: string;
}

interface UserBookmarksProps {
  className?: string;
}

export function UserBookmarks({ className }: UserBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserBookmarks();
  }, []);

  const fetchUserBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/bookmarks");
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const bookmarksData = await response.json();
      
      const processedBookmarks = bookmarksData.map((bookmark: {
        recipe: {
          createdAt: string;
          updatedAt: string;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      }) => ({
        ...bookmark,
        recipe: {
          ...bookmark.recipe,
          createdAt: new Date(bookmark.recipe.createdAt),
          updatedAt: new Date(bookmark.recipe.updatedAt),
        },
      }));
      
      setBookmarks(processedBookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Došlo je do greške pri dohvaćanju spremljenih recepta.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Spremljeni recepti
        </CardTitle>
        <CardDescription>
          {bookmarks.length === 0 
            ? "Još niste spremili nijedan recept." 
            : `Spremljeno ${bookmarks.length} ${bookmarks.length === 1 ? 'recept' : 'recepta'}.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Još niste spremili nijedan recept.
            </p>
            <Link
              href="/recipes" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Pregledaj recepte
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark) => (
              <RecipeCard key={bookmark.recipe.id} recipe={bookmark.recipe} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
