import { z } from "zod";

export const recipeZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, 'Description is required'),
  image_path: z.string().nonempty(),
  servings: z.number().min(1, "Servings must be at least 1"),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  userId: z.string(),
  instructions: z.array(z.object({
    stepNumber: z.number(),
    content: z.string()
  })),
  categories: z.array(z.string().uuid()),
  ingredients: z.array(z.object({
    ingredientId: z.string().uuid(),
    unitId: z.string().uuid(),
    quantity: z.string()
  })),
  allergies: z.array(z.string().uuid()).optional()
});
