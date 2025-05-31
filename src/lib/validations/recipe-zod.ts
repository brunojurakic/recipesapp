import { z } from "zod";

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const recipeZodSchema = z.object({
  title: z.string().min(3, "Naslov mora imati najmanje 3 znaka").max(100, "Naslov može imati najviše 100 znakova"),
  description: z.string().min(10, "Opis mora imati najmanje 10 znakova"),
  servings: z.number().min(1, "Broj porcija mora biti najmanje 1"),
  preparationTime: z.number().min(1, "Vrijeme pripreme mora biti najmanje 1 minuta"),
  image: z
    .any()
    .transform((fileList) => {
      if (!fileList || (fileList instanceof FileList && fileList.length === 0)) {
        return undefined;
      }
      return fileList instanceof FileList ? fileList[0] : fileList;
    })
    .refine((file): file is File => file instanceof File, {
      message: "Slika je obavezna",
    })
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: "Maksimalna veličina datoteke je 4MB.",
    })
    .refine((file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Podržani su samo .jpg, .jpeg, .png i .webp formati.",
    })
    .pipe(z.instanceof(File)).optional(),
  instructions: z.array(z.object({
    stepNumber: z.number().min(1, "Broj koraka mora biti pozitivan"),
    content: z.string().min(5, "Sadržaj upute mora imati najmanje 5 znakova")
  })).min(1, "Potrebna je barem jedna uputa"),
  categories: z.array(z.string().uuid()).min(1, "Potrebna je barem jedna kategorija"),
  ingredients: z.array(z.object({
    name: z.string().min(2, "Naziv sastojka mora imati najmanje 2 znaka").max(50, "Naziv sastojka može imati najviše 50 znakova"),
    quantity: z.number().positive("Količina mora biti pozitivna"),
    unitId: z.string().min(1, "Mjerna jedinica je obavezna").uuid()
  })).min(1, "Potreban je barem jedan sastojak"),
  allergies: z.array(z.string().uuid()).optional()
});

export const editRecipeZodSchema = z.object({
  title: z.string().min(3, "Naslov mora imati najmanje 3 znaka").max(100, "Naslov može imati najviše 100 znakova"),
  description: z.string().min(10, "Opis mora imati najmanje 10 znakova"),
  servings: z.number().min(1, "Broj porcija mora biti najmanje 1"),
  preparationTime: z.number().min(1, "Vrijeme pripreme mora biti najmanje 1 minuta"),
  image: z
    .any()
    .transform((fileList) => {
      if (!fileList || (fileList instanceof FileList && fileList.length === 0)) {
        return undefined;
      }
      return fileList instanceof FileList ? fileList[0] : fileList;
    })
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, {
      message: "Datoteka mora biti valjana",
    })
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, {
      message: "Maksimalna veličina datoteke je 4MB.",
    })
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, {
      message: "Podržani su samo .jpg, .jpeg, .png i .webp formati.",
    })
    .optional(),
  instructions: z.array(z.object({
    stepNumber: z.number().min(1, "Broj koraka mora biti pozitivan"),
    content: z.string().min(5, "Sadržaj upute mora imati najmanje 5 znakova")
  })).min(1, "Potrebna je barem jedna uputa"),
  categories: z.array(z.string().uuid()).min(1, "Potrebna je barem jedna kategorija"),
  ingredients: z.array(z.object({
    name: z.string().min(2, "Naziv sastojka mora imati najmanje 2 znaka").max(50, "Naziv sastojka može imati najviše 50 znakova"),
    quantity: z.number().positive("Količina mora biti pozitivna"),
    unitId: z.string().min(1, "Mjerna jedinica je obavezna").uuid()
  })).min(1, "Potreban je barem jedan sastojak"),
  allergies: z.array(z.string().uuid()).optional()
});

export type CreateRecipeFormData = z.infer<typeof recipeZodSchema>;
export type EditRecipeFormData = z.infer<typeof editRecipeZodSchema>;