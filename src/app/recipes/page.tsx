import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { RecipeCard } from "@/components/RecipeCard"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getRecipes } from "@/lib/utils/drizzle_queries"
import { notFound } from "next/navigation"



export default async function RecipesPage() {
  const recipes = await getRecipes();

    if (!recipes) {
      notFound();
    }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div className="max-w-7xl mx-auto p-6 pt-25">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recepti</h1>
          <p className="text-muted-foreground">Otkrijte i podijelite nevjerojatne recepte</p>
        </div>
        {session && (
          <Link href="/recipes/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="text-white" /> Stvori recept
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