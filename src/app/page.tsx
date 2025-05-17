import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { UtensilsCrossed } from 'lucide-react';



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

        </div>
      </main>
    </div>
  );
}

export default Home