"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { reviewSchema, ReviewFormData } from "@/lib/validations/review-schema"
import { authClient } from "@/lib/auth-client"
import { LoginDialog } from "@/components/common/LoginDialog"

interface ReviewDialogProps {
  recipeId: string
  isAuthor?: boolean
}

export function ReviewDialog({
  recipeId,
  isAuthor = false,
}: ReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  const handleButtonClick = async () => {
    if (isLoggedIn === null) {
      try {
        const { data: session } = await authClient.getSession()
        if (!session) {
          setIsLoggedIn(false)
          setShowLoginDialog(true)
          return
        }
        setIsLoggedIn(true)
        setIsOpen(true)
      } catch (error) {
        console.error("Error checking auth status:", error)
        setIsLoggedIn(false)
        setShowLoginDialog(true)
      }
    } else if (isLoggedIn) {
      setIsOpen(true)
    } else {
      setShowLoginDialog(true)
    }
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Molimo odaberite ocjenu")
      return
    }

    const trimmedContent = content.trim()
    if (trimmedContent.length < 10) {
      toast.error("Sadržaj recenzije mora imati najmanje 10 znakova")
      return
    }

    try {
      setIsLoading(true)

      const formData: ReviewFormData = {
        recipeId,
        rating,
        content: trimmedContent,
      }

      reviewSchema.parse(formData)

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setIsLoggedIn(false)
          setIsOpen(false)
          setShowLoginDialog(true)
          return
        }
        throw new Error("Failed to submit review")
      }

      toast.success("Recenzija je uspješno dodana!")
      setIsOpen(false)
      setRating(0)
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Došlo je do greške pri dodavanju recenzije.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  if (isAuthor) {
    return null
  }

  return (
    <>
      <Button className="w-full" variant="outline" onClick={handleButtonClick}>
        <Star />
        Ocijeni recept
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ocijeni recept</DialogTitle>
            <DialogDescription>
              Podijelite svoje mišljenje o ovom receptu
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ocjena</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Komentar</label>
              <Textarea
                placeholder="Opišite svoje iskustvo s ovim receptom..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Spremanje..." : "Dodaj recenziju"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="Za dodavanje recenzije potrebno je prijaviti se. Želite li se prijaviti?"
      />
    </>
  )
}
