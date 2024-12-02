import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de début invalide'
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de fin invalide'
  }),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priorité invalide' })
  }),
  assignedTo: z.number().positive('L\'ID de l\'utilisateur assigné est requis'),
  investmentId: z.number().positive('L\'ID de l\'investissement est requis')
});

const taskUpdateSchema = taskSchema.partial();

export function validateTaskInput(data) {
  try {
    taskSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export function validateTaskUpdateInput(data) {
  try {
    taskUpdateSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}