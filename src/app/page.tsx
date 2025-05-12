import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";
import RecipeCard from "@/components/ui/RecipeCard";
import Header from "@/components/ui/Header";
import { UtensilsCrossed } from 'lucide-react';

const FEATURED_RECIPES = [
  {
    title: "Classic Italian Spaghetti",
    description: "Traditional Italian spaghetti with homemade tomato sauce and fresh basil.",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
    cookTime: 30,
    category: "Pasta",
    href: "/recipes/classic-italian-spaghetti"
  },
  {
    title: "Grilled Salmon",
    description: "Fresh Atlantic salmon seasoned with herbs and lemon, grilled to perfection.",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=2064&auto=format&fit=crop",
    cookTime: 25,
    category: "Seafood",
    href: "/recipes/grilled-salmon"
  },
  {
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a warm, gooey center. A perfect dessert for chocolate lovers.",
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=2086&auto=format&fit=crop",
    cookTime: 20,
    category: "Dessert",
    href: "/recipes/chocolate-lava-cake"
  },
  {
    title: "Vegetarian Buddha Bowl",
    description: "A nourishing bowl filled with quinoa, roasted vegetables, avocado, and tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    cookTime: 35,
    category: "Vegetarian",
    href: "/recipes/vegetarian-buddha-bowl"
  },
  {
    title: "Korean BBQ Tacos",
    description: "Fusion street food combining tender Korean BBQ beef with Mexican-style tacos and kimchi slaw.",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=2070&auto=format&fit=crop",
    cookTime: 40,
    category: "Fusion",
    href: "/recipes/korean-bbq-tacos"
  },
  {
    title: "Morning Acai Bowl",
    description: "Fresh and healthy breakfast bowl with acai, mixed berries, banana, and crunchy granola.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=2070&auto=format&fit=crop",
    cookTime: 15,
    category: "Breakfast",
    href: "/recipes/morning-acai-bowl"
  }
];

// const CATEGORIES = [
//   "All Recipes",
//   "Breakfast",
//   "Lunch",
//   "Dinner",
//   "Dessert",
//   "Vegetarian",
//   "Quick & Easy"
// ];

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-zinc-50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2067&auto=format&fit=crop"
          alt="Cooking background"
          fill
          className="object-cover brightness-[0.85] blur-[3px] filter backdrop-blur-sm scale-105"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-white drop-shadow-md" />
            <h1 className="text-4xl font-bold text-white drop-shadow-md">Recipe Share</h1>
          </div>
          <p className="mt-4 max-w-xl text-lg text-white drop-shadow-sm font-medium">
            Discover, share, and cook amazing recipes from around the world
          </p>
          <div className="mt-8 w-full max-w-lg px-4">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative -mt-32 z-30 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* Categories */}


        {/* Featured Recipes */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Featured Recipes
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_RECIPES.map((recipe) => (
              <RecipeCard key={recipe.href} {...recipe} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home