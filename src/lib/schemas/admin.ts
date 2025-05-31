import { z } from 'zod';

export const allergySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(2, "Naziv mora imati najmanje 2 znakova")
    .max(30, "Naziv može imati najviše 30 znakova")
    .trim()
    .refine((name) => name.length > 0, "Naziv je obavezan"),
});

export const createAllergySchema = allergySchema.omit({ id: true });
export const updateAllergySchema = allergySchema.partial({ name: true });

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(2, "Naziv mora imati najmanje 2 znakova")
    .max(30, "Naziv može imati najviše 30 znakova")
    .trim()
    .refine((name) => name.length > 0, "Naziv je obavezan"),
});

export const createCategorySchema = categorySchema.omit({ id: true });
export const updateCategorySchema = categorySchema.partial({ name: true });

export type AllergySchema = z.infer<typeof allergySchema>;
export type CreateAllergySchema = z.infer<typeof createAllergySchema>;
export type UpdateAllergySchema = z.infer<typeof updateAllergySchema>;

export type CategorySchema = z.infer<typeof categorySchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
