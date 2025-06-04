"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, BookOpen, BookmarkIcon, Star, Calendar } from "lucide-react"
import type { ClassNameProps } from "@/lib/types"

type Review = {
  rating: number
}

type Recipe = {
  reviews: Review[]
}

type UserStats = {
  recipesCount: number
  bookmarksCount: number
  averageRating: number
  totalReviews: number
  memberSince: string
}

export function UserStats({ className }: ClassNameProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      setIsLoading(true)

      const [profileResponse, recipesResponse, bookmarksResponse] =
        await Promise.all([
          fetch("/api/profile"),
          fetch("/api/profile/recipes"),
          fetch("/api/profile/bookmarks"),
        ])

      if (!profileResponse.ok || !recipesResponse.ok || !bookmarksResponse.ok) {
        throw new Error("Failed to fetch stats")
      }

      const [profile, recipes, bookmarks] = await Promise.all([
        profileResponse.json(),
        recipesResponse.json(),
        bookmarksResponse.json(),
      ])

      const totalReviews = recipes.reduce(
        (sum: number, recipe: Recipe) => sum + recipe.reviews.length,
        0,
      )
      const totalRating = recipes.reduce((sum: number, recipe: Recipe) => {
        return (
          sum +
          recipe.reviews.reduce(
            (ratingSum: number, review: Review) => ratingSum + review.rating,
            0,
          )
        )
      }, 0)
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

      setStats({
        recipesCount: recipes.length,
        bookmarksCount: bookmarks.length,
        averageRating,
        totalReviews,
        memberSince: profile.createdAt,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Došlo je do greške pri dohvaćanju statistike.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">
            Greška pri učitavanju statistike.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Statistike</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.recipesCount}</div>
            <div className="text-sm text-muted-foreground">
              {stats.recipesCount === 1 ? "Recept" : "Recepta"}
            </div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <BookmarkIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.bookmarksCount}</div>
            <div className="text-sm text-muted-foreground">Spremljeno</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
            </div>
            <div className="text-sm text-muted-foreground">Prosjek ocjena</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {new Date(stats.memberSince).toLocaleDateString("hr-HR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-sm text-muted-foreground">Član od</div>
          </div>
        </div>

        {stats.totalReviews > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold">{stats.totalReviews}</div>
              <div className="text-sm text-muted-foreground">
                Ukupno {stats.totalReviews === 1 ? "recenzija" : "recenzija"} na
                vašim receptima
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
