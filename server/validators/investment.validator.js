import { z } from 'zod';

const investmentSchema = z.object({
  category: z.string().min(1, 'La catégorie est requise'),
  typeOfInvestment: z.string().min(1, 'Le type d\'investissement est requis'),
  initialAmount: z.number().positive('Le montant initial doit être positif'),
  currentValue: z.number().positive('La valeur actuelle doit être positive'),
  dateOfInvestment: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date d\'investissement invalide'
  }),
  locationId: z.number().optional(),
  status: z.string().min(1, 'Le statut est requis')
});

const investmentUpdateSchema = investmentSchema.partial();

export function validateInvestmentInput(data) {
  try {
    investmentSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export function validateInvestmentUpdateInput(data) {
  try {
    investmentUpdateSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}