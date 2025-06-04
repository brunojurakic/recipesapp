"use client"

import Link from "next/link"
import Image from "next/image"
import type { Recipe, Category } from "@/lib/types/database"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { User, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  showDeleteButton?: boolean
  onDelete?: (recipeId: string) => void
}

export function RecipeCard({
  recipe,
  showDeleteButton = false,
  onDelete,
}: RecipeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete recipe")
      }

      toast.success("Recept je uspješno obrisan!")
      setDialogOpen(false)

      if (onDelete) {
        onDelete(recipe.id)
      }
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast.error(
        error instanceof Error ? error.message : "Greška pri brisanju recepta",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative group">
      <Link
        href={`/recipes/${recipe.id}`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
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
            <h3
              className="mt-2 font-semibold text-lg text-foreground line-clamp-2"
              title={recipe.title}
            >
              {recipe.title}
            </h3>
          </div>
        </div>
      </Link>
      {showDeleteButton && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0 shadow-md"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Obriši recept</DialogTitle>{" "}
                <DialogDescription>
                  Jeste li sigurni da želite obrisati recept &quot;
                  {recipe.title}&quot;? Ova akcija se ne može poništiti.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Odustani
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Brisanje...
                    </>
                  ) : (
                    "Obriši"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
