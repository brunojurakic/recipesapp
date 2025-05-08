import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";
import RecipeCard from "@/components/ui/RecipeCard";
import { UtensilsCrossed } from 'lucide-react';

// Mock data for recipes - in a real app this would come from an API
const FEATURED_RECIPES = [
  {
    title: "Classic Italian Spaghetti",
    description: "Traditional Italian spaghetti with homemade tomato sauce and fresh basil.",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
    cookTime: "30 min",
    category: "Pasta",
    slug: "classic-italian-spaghetti"
  },
  {
    title: "Grilled Salmon",
    description: "Fresh Atlantic salmon seasoned with herbs and lemon, grilled to perfection.",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=2064&auto=format&fit=crop",
    cookTime: "25 min",
    category: "Seafood",
    slug: "grilled-salmon"
  },
  {
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a warm, gooey center. A perfect dessert for chocolate lovers.",
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=2086&auto=format&fit=crop",
    cookTime: "20 min",
    category: "Dessert",
    slug: "chocolate-lava-cake"
  }
];

const CATEGORIES = [
  "All Recipes",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Vegetarian",
  "Quick & Easy"
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2067&auto=format&fit=crop"
          alt="Cooking background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Recipe Share</h1>
          </div>
          <p className="mt-4 max-w-xl text-lg text-zinc-200">
            Discover, share, and cook amazing recipes from around the world
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-800"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Recipes */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Featured Recipes
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_RECIPES.map((recipe) => (
              <RecipeCard key={recipe.slug} {...recipe} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
