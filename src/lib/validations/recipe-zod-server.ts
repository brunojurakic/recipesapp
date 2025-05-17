import { z } from "zod";

export const recipeServerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, 'Description is required'),
  servings: z.number().min(1, "Servings must be at least 1"),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  imagePath: z.string().min(1, "Image path is required"),
  instructions: z.array(z.object({
    stepNumber: z.number(),
    content: z.string().min(1, "Instruction content is required")
  })).min(1, "At least one instruction is required"),
  categories: z.array(z.string().uuid()).min(1, "At least one category is required"),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Ingredient name is required"),
    quantity: z.string().min(1, "Quantity is required"),
    unitId: z.string().uuid("Unit ID must be a valid UUID")
  })).min(1, "At least one ingredient is required"),
  allergies: z.array(z.string().uuid("Allergy ID must be a valid UUID")).optional()
});

export type CreateRecipeServerData = z.infer<typeof recipeServerSchema>;