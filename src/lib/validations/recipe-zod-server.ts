import { z } from "zod";

export const recipeServerSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  description: z.string().min(1, 'Opis je obavezan'),
  servings: z.number().min(1, "Broj porcija mora biti najmanje 1"),
  preparationTime: z.number().min(1, "Vrijeme pripreme mora biti najmanje 1 minuta"),
  imagePath: z.string().min(1, "Putanja do slike je obavezna"),
  instructions: z.array(z.object({
    stepNumber: z.number(),
    content: z.string().min(1, "Sadržaj upute je obavezan")
  })).min(1, "Potrebna je barem jedna uputa"),
  categories: z.array(z.string().uuid()).min(1, "Potrebna je barem jedna kategorija"),
  ingredients: z.array(z.object({
    name: z.string().min(1, "Naziv sastojka je obavezan"),
    quantity: z.string().min(1, "Količina je obavezna"),
    unitId: z.string().uuid("ID jedinice mora biti validan UUID")
  })).min(1, "Potreban je barem jedan sastojak"),
  allergies: z.array(z.string().uuid("ID alergena mora biti validan UUID")).optional()
});

export type CreateRecipeServerData = z.infer<typeof recipeServerSchema>;