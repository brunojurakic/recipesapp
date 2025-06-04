import { z } from "zod"

export const createBlogSchema = z.object({
  name: z
    .string()
    .min(3, "Naziv mora imati najmanje 3 znaka")
    .max(100, "Naziv može imati najviše 100 znakova")
    .trim(),
  description: z
    .string()
    .min(10, "Opis mora imati najmanje 10 znakova")
    .max(500, "Opis može imati najviše 500 znakova")
    .trim(),
  content: z.string().min(50, "Sadržaj mora imati najmanje 50 znakova").trim(),
  image: z
    .instanceof(File, { message: "Slika je obavezna" })
    .refine((file) => file.size > 0, "Slika je obavezna")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Slika mora biti manja od 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Dozvoljen je samo JPEG, PNG ili WebP format",
    ),
})

export type CreateBlogInput = z.infer<typeof createBlogSchema>
