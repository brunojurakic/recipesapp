import { z } from "zod";

export const reviewSchema = z.object({
  recipeId: z.string().min(1, "ID recepta je obavezan"),
  rating: z.number().min(1, "Ocjena mora biti najmanje 1").max(5, "Ocjena može biti najviše 5"),
  content: z.string().optional()
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
