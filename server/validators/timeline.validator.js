import { z } from 'zod';

const timelineEventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de l\'événement invalide'
  }),
  type: z.enum(['investment', 'livestock', 'task', 'financial', 'general'], {
    errorMap: () => ({ message: 'Type invalide' })
  }),
  category: z.enum(['creation', 'update', 'completion', 'milestone', 'alert', 'other'], {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  investmentId: z.number().optional(),
  livestockId: z.number().optional(),
  locationId: z.number().optional(),
  mediaUrls: z.array(z.string().url('URL invalide')).optional(),
  visibilityLevel: z.enum(['public', 'private', 'team'], {
    errorMap: () => ({ message: 'Niveau de visibilité invalide' })
  })
});

const timelineEventUpdateSchema = timelineEventSchema.partial();

export function validateTimelineEventInput(data) {
  try {
    timelineEventSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export function validateTimelineEventUpdateInput(data) {
  try {
    timelineEventUpdateSchema.parse(data);
    return { error: null };
  } catch (error) {
    return { error };
  }
}