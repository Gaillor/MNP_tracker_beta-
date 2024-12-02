import { z } from 'zod';

const livestockSchema = z.object({
  uniqueIdentifier: z.string().min(1, 'L\'identifiant unique est requis'),
  type: z.string().min(1, 'Le type est requis'),
  race: z.string().min(1, 'La race est requise'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de naissance invalide'
  }),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Genre invalide' })
  }),
  acquisitionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date d\'acquisition invalide'
  }),
  acquisitionPrice: z.number().positive('Le prix d\'acquisition doit être positif'),
  currentStatus: z.enum(['healthy', 'sick', 'sold', 'deceased'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }),
  investmentId: z.number().positive('L\'ID de l\'investissement est requis')
});

const livestockUpdateSchema = livestockSchema.partial();

export function validateLivestockInput(data) {
  try {
    livestockSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export function validateLivestockUpdateInput(data) {
  try {
    livestockUpdateSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}