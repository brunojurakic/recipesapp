"use client"

import { useState } from "react"
import { Loader2, Pencil, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { ReviewWithUser } from "@/lib/types"

interface EditReviewDialogProps {
  review: ReviewWithUser
  onReviewUpdated: () => void
}

export function EditReviewDialog({
  review,
  onReviewUpdated,
}: EditReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [content, setContent] = useState(review.content || "")

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

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          content: trimmedContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update review")
      }

      toast.success("Recenzija je uspješno ažurirana!")
      setIsOpen(false)
      onReviewUpdated()
    } catch (error) {
      console.error("Error updating review:", error)
      toast.error("Došlo je do greške pri ažuriranju recenzije.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete review")
      }

      toast.success("Recenzija je uspješno obrisana!")
      setIsOpen(false)
      onReviewUpdated()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Došlo je do greške pri brisanju recenzije.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Uredi recenziju</DialogTitle>
          <DialogDescription>
            Ažurirajte svoju ocjenu i komentar za ovaj recept.
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

        <div className="flex justify-between mt-6">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || isDeleting}>
              {isLoading ? "Spremanje..." : "Ažuriraj recenziju"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
