import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['admin', 'user', 'readonly'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  }),
  permissions: z.array(z.string())
});

const userUpdateSchema = userSchema.partial().omit({ password: true }).and(
  z.object({
    password: z.string().min(6).optional(),
    is_active: z.boolean().optional()
  })
);

export function validateUserInput(data) {
  try {
    userSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export function validateUserUpdateInput(data) {
  try {
    userUpdateSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}