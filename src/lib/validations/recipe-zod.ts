import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const recipeZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, 'Description is required'),
  servings: z.number().min(1, "Servings must be at least 1"),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  userId: z.string(),
  image: z
    .any()
    .transform((fileList) => {
      if (!fileList || (fileList instanceof FileList && fileList.length === 0)) {
        return undefined;
      }
      return fileList instanceof FileList ? fileList[0] : fileList;
    })
    .refine((file): file is File => file instanceof File, {
      message: "Image is required",
    })
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 10MB.",
    })
    .refine((file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    })
    .pipe(z.instanceof(File)).optional(),
  instructions: z.array(z.object({
    stepNumber: z.number(),
    content: z.string().min(1, "Instruction content is required")
  })).min(1, "At least one instruction is required"),
  categories: z.array(z.string().uuid()).min(1, "At least one category is required"),
  ingredients: z.array(z.object({
    ingredientId: z.string().uuid(),
    unitId: z.string().uuid(),
    quantity: z.string().min(1, "Quantity is required")
  })).min(1, "At least one ingredient is required"),
  allergies: z.array(z.string().uuid()).optional()
});

export type CreateRecipeFormData = z.infer<typeof recipeZodSchema>;