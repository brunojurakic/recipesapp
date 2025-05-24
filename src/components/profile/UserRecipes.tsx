"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeCard } from "@/components/RecipeCard";
import { toast } from "sonner";
import { Loader2, BookOpen } from "lucide-react";
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

interface UserRecipesProps {
  className?: string;
}

export function UserRecipes({ className }: UserRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/recipes");
      
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const recipesData = await response.json();
      
      const processedRecipes = recipesData.map((recipe: {
        createdAt: string;
        updatedAt: string;
        [key: string]: unknown;
      }) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }));
      
      setRecipes(processedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Došlo je do greške pri dohvaćanju recepta.");
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
          <BookOpen className="h-5 w-5" />
          Moji recepti
        </CardTitle>
        <CardDescription>
          {recipes.length === 0 
            ? "Još niste objavili nijedan recept." 
            : `Objavljeno ${recipes.length} ${recipes.length === 1 ? 'recept' : 'recepta'}.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Još niste objavili nijedan recept.
            </p>
            <Link 
              href="/recipes/new" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Stvori prvi recept
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
