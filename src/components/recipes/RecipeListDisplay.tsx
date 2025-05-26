"use client";

import { RecipeCard } from "@/components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { RecipeClient } from "@/lib/types/database";

interface RecipeListDisplayProps {
  isLoadingRecipes: boolean;
  filteredRecipes: RecipeClient[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function RecipeListDisplay({
  isLoadingRecipes,
  filteredRecipes,
  hasActiveFilters,
  onClearFilters,
}: RecipeListDisplayProps) {
  if (isLoadingRecipes) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Skeleton className="h-[150px] w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredRecipes.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <p className="text-xl text-muted-foreground">Nema recepata koji odgovaraju vašim filterima.</p>
      {hasActiveFilters && (
        <Button variant="link" onClick={onClearFilters} className="mt-2">
          Pokušajte očistiti filtere
        </Button>
      )}
    </div>
  );
}