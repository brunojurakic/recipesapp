"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SearchBar from "@/components/SearchBar"
import CategoryCard from "@/components/CategoryCard"
import { toast } from "sonner"
import {
  UtensilsCrossed,
  ChefHat,
  Users,
  Star,
  BookOpen,
  Search,
  Heart,
  Share2,
  Award,
  ArrowRight,
} from "lucide-react"

interface PopularCategory {
  id: string
  name: string
  image_path: string
  recipeCount: number
}

const Home = () => {
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>(
    [],
  )
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await fetch("/api/categories/popular")
        if (response.ok) {
          const categories = await response.json()
          setPopularCategories(categories)
        } else {
          toast.error(
            "Greška pri dohvaćanju kategorija. Molimo pokušajte kasnije.",
          )
        }
      } catch (error) {
        console.error("Failed to fetch popular categories:", error)
        toast.error(
          "Greška pri dohvaćanju kategorija. Molimo pokušajte kasnije.",
        )
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchPopularCategories()
  }, [])
  return (
    <div className="min-h-screen">
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background z-10" />

        <Image
          src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2067&auto=format&fit=crop"
          alt="Cooking background"
          fill
          className="object-cover brightness-[0.8] blur-[6px] scale-105"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 p-4">
          <div className="flex items-center gap-3 mb-6">
            <UtensilsCrossed className="h-10 w-10 text-white drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              ReceptiNet
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-xl md:text-2xl text-white/95 drop-shadow-md font-medium leading-relaxed">
            Otkrijte, dijelite i kuhajte nevjerojatne recepte iz cijelog svijeta
          </p>
          <div className="mt-10 w-full max-w-lg">
            <SearchBar />
          </div>
          <div className="mt-8 w-full max-w-lg">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="py-5 w-full sm:w-48 h-11">
                <Link href="/recipes">
                  <Search className="mr-2 h-5 w-5" />
                  Pregledaj recepte
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="py-5 w-full sm:w-48 h-11"
              >
                <Link href="/recipes/new">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Objavi recept
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Zašto odabrati ReceptiNet?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sve što trebate za savršeno kulinarsko iskustvo na jednom mjestu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Jednostavni recepti</CardTitle>
                <CardDescription>
                  Detaljne upute korak po korak s fotografijama za savršene
                  rezultate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Zajednica kuhara</CardTitle>
                <CardDescription>
                  Spojite se s drugim kuharima, dijelite savjete i znanje
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Ocijenite recepte</CardTitle>
                <CardDescription>
                  Ocijenite recepte i podijelite svoje mišljenje
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Spremite najdraže recepte</CardTitle>
                <CardDescription>
                  Označite svoje omiljene recepte i lakše ih pronađite kad god
                  želite
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Napredna pretraga</CardTitle>
                <CardDescription>
                  Filtrirajte po kategorijama, alergenima, vremenu pripreme,
                  sastojcima...
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/10 transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Podijelite recepte</CardTitle>
                <CardDescription>
                  Jednostavno podijelite svoje kulinarske kreacije s cijelim
                  svijetom
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popularne kategorije
            </h2>
            <p className="text-xl text-muted-foreground">
              Istražite recepte po kategorijama
            </p>
          </div>{" "}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoadingCategories
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-white/10 transition-shadow overflow-hidden"
                  >
                    <div className="relative aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 text-center">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              : popularCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={{
                      id: category.id,
                      name: category.name,
                      image_path: category.image_path,
                      recipe_count: category.recipeCount,
                    }}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Spremni ste za kulinarsku avanturu?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Pridružite se drugim kuharima koji već dijele svoje recepte i
              savjete
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="py-5 w-full sm:w-48 h-11">
                <Link href="/signup">
                  Registriraj se
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="py-5 w-full sm:w-48 h-11"
              >
                <Link href="/recipes">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Istraži recepte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
