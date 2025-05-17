import Link from "next/link"
import { recipe, category } from "@/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { RecipeCard } from "@/components/RecipeCard"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"

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

export default async function RecipesPage() {
  const response = await fetch(`${process.env.NEXT_BASE_URL}/api/recipes`)

  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  const recipes = (await response.json()) as RecipeWithRelations[]

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div className="max-w-7xl mx-auto p-6 pt-25">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recipes</h1>
          <p className="text-muted-foreground">Discover and share amazing recipes</p>
        </div>
        {session && (
          <Link href="/recipes/new" className={buttonVariants({variant: "default"})}>
            <Plus className="text-white" /> Create Recipe
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}