"use client"

import Link from "next/link"
import Image from "next/image"
import { recipe, category } from "@/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import { Badge } from "./ui/badge"
import { User } from "lucide-react"

type Recipe = InferSelectModel<typeof recipe>
type Category = InferSelectModel<typeof category>

interface RecipeWithRelations extends Recipe {
  user: {
    name: string | null
  }
  categories: {
    category: Category
  }[]
}

interface RecipeCardProps {
  recipe: RecipeWithRelations
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <div className="overflow-hidden rounded-xl bg-card shadow transition-all hover:shadow-lg border h-full flex flex-col">
        <div className="relative h-48 w-full">
          {recipe.image_path ? (
            <Image
              src={recipe.image_path}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Nema slike</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.categories.map(({ category }) => (
              <Badge variant={"outline"} key={category.id}>
                {category.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{recipe.preparationTime} min</span>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{recipe.servings}</span>
              <User className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 font-semibold text-lg text-foreground line-clamp-2" title={recipe.title}>
            {recipe.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
