import { z } from 'zod';

export const createBlogSchema = z.object({
  name: z
    .string()
    .min(3, 'Naziv mora imati najmanje 3 znaka')
    .max(100, 'Naziv može imati najviše 100 znakova')
    .trim(),
  description: z
    .string()
    .min(10, 'Opis mora imati najmanje 10 znakova')
    .max(500, 'Opis može imati najviše 500 znakova')
    .trim(),
  content: z
    .string()
    .min(50, 'Sadržaj mora imati najmanje 50 znakova')
    .trim(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
