"use client"

import { RecipeCard } from "@/components/RecipeCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { RecipeClient } from "@/lib/types/database"

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
}

interface RecipeListDisplayProps {
  isLoadingRecipes: boolean
  filteredRecipes: RecipeClient[]
  hasActiveFilters: boolean
  onClearFilters: () => void
  pagination?: Pagination
  onLoadMore?: () => void
  isLoadingMore?: boolean
}

export function RecipeListDisplay({
  isLoadingRecipes,
  filteredRecipes,
  hasActiveFilters,
  onClearFilters,
  pagination,
  onLoadMore,
  isLoadingMore = false,
}: RecipeListDisplayProps) {
  if (isLoadingRecipes) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <Skeleton className="h-[150px] w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredRecipes.length > 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {pagination?.hasMore && onLoadMore && (
          <div className="flex justify-center">
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              size="lg"
              className="px-8"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Učitavam...
                </>
              ) : (
                "Učitaj više recepata"
              )}
            </Button>
          </div>
        )}

        {pagination && (
          <div className="text-center text-sm text-muted-foreground">
            Prikazano {filteredRecipes.length} od {pagination.totalCount}{" "}
            recepata
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="text-center py-10">
      <p className="text-xl text-muted-foreground">
        Nema recepata koji odgovaraju vašim filterima.
      </p>
      {hasActiveFilters && (
        <Button variant="link" onClick={onClearFilters} className="mt-2">
          Pokušajte očistiti filtere
        </Button>
      )}
    </div>
  )
}
