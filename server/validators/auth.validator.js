import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export function validateLoginInput(data) {
  try {
    loginSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}