import { z } from "zod"

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Ime mora imati najmanje 2 znakova.",
    })
    .max(50, {
      message: "Ime ne smije imati više od 50 znakova.",
    })
    .trim(),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
