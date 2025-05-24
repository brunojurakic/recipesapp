import { z } from "zod";

export const userAllergiesSchema = z.object({
  allergyIds: z.array(z.string().uuid()).default([])
});

export type UserAllergiesFormData = z.infer<typeof userAllergiesSchema>;
