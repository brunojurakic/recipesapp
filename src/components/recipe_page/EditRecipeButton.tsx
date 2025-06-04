"use client"

import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EditRecipeButtonProps {
  recipeId: string
}

export function EditRecipeButton({ recipeId }: EditRecipeButtonProps) {
  return (
    <Button asChild className="w-full" variant={"outline"}>
      <Link href={`/recipes/${recipeId}/edit`}>
        <PenSquare className="mr-2 h-4 w-4" />
        Uredi recept
      </Link>
    </Button>
  )
}
