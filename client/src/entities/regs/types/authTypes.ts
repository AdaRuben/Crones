import { z } from 'zod';

export const authStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
});

export type AuthState = z.infer<typeof authStateSchema>;

export const newUserSchema = authStateSchema.omit({ id: true });

export type NewUser = z.infer<typeof newUserSchema>;
