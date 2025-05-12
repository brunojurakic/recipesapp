"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import RecipeCard from "@/components/ui/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  servings: number;
  preparationTime: number;
  createdAt: string;
}

export default function RecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      // Log the data we're getting from the API
      console.log('API response:', data);
      // Make sure we have a valid recipes array
      if (!Array.isArray(data.recipes)) {
        throw new Error("Invalid response format");
      }
      // Filter out any recipes without an ID
      const validRecipes = data.recipes.filter((recipe: Recipe) => recipe?.id);
      console.log('Valid recipes:', validRecipes);
      setRecipes(validRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">All Recipes</h1>
          {session?.user && (
            <Link
              href="/recipes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              Create Recipe
            </Link>
          )}
        </div>

        {error ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-zinc-900">No recipes</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get started by creating a new recipe.
            </p>
            {session?.user && (
              <div className="mt-6">
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                >
                  Create Recipe
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.filter(recipe => recipe.id).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                href={recipe.id ? `/recipes/${recipe.id}` : "#"}
                title={recipe.title}
                description={recipe.description || ""}
                image={recipe.image_path}
                cookTime={recipe.preparationTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
