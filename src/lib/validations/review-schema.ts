import { z } from "zod"

export const reviewSchema = z.object({
  recipeId: z.string().min(1, "ID recepta je obavezan"),
  rating: z
    .number()
    .min(1, "Ocjena mora biti najmanje 1")
    .max(5, "Ocjena može biti najviše 5"),
  content: z
    .string()
    .min(10, "Sadržaj recenzije mora imati najmanje 10 znakova"),
})

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Ocjena mora biti najmanje 1")
    .max(5, "Ocjena može biti najviše 5"),
  content: z
    .string()
    .min(10, "Sadržaj recenzije mora imati najmanje 10 znakova"),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>
