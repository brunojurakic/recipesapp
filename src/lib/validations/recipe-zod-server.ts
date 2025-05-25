import { z } from "zod";

export const recipeServerSchema = z.object({
  title: z.string().min(3, "Naslov mora imati najmanje 3 znaka").max(100, "Naslov može imati najviše 100 znakova"),
  description: z.string().min(10, "Opis mora imati najmanje 10 znakova"),
  servings: z.number().min(1, "Broj porcija mora biti najmanje 1"),
  preparationTime: z.number().min(1, "Vrijeme pripreme mora biti najmanje 1 minuta"),
  imagePath: z.string().min(1, "Putanja do slike je obavezna"),
  instructions: z.array(z.object({
    stepNumber: z.number().min(1, "Broj koraka mora biti pozitivan"),
    content: z.string().min(5, "Sadržaj upute mora imati najmanje 5 znakova")
  })).min(1, "Potrebna je barem jedna uputa"),
  categories: z.array(z.string().uuid()).min(1, "Potrebna je barem jedna kategorija"),
  ingredients: z.array(z.object({
    name: z.string().min(2, "Naziv sastojka mora imati najmanje 2 znaka").max(50, "Naziv sastojka može imati najviše 50 znakova"),
    quantity: z.number().positive("Količina mora biti pozitivna"),
    unitId: z.string().uuid("ID jedinice mora biti validan UUID")
  })).min(1, "Potreban je barem jedan sastojak"),
  allergies: z.array(z.string().uuid("ID alergena mora biti validan UUID")).optional()
});

export type CreateRecipeServerData = z.infer<typeof recipeServerSchema>;