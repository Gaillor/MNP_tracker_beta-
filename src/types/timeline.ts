export interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  eventDate: Date;
  type: TimelineEventType;
  category: TimelineEventCategory;
  investmentId?: number;
  livestockId?: number;
  locationId?: number;
  userId: number;
  mediaUrls?: string[];
  visibilityLevel: 'public' | 'private' | 'team';
  createdAt: Date;
  updatedAt: Date;
}

export type TimelineEventType = 
  | 'investment'
  | 'livestock'
  | 'task'
  | 'financial'
  | 'general';

export type TimelineEventCategory =
  | 'creation'
  | 'update'
  | 'completion'
  | 'milestone'
  | 'alert'
  | 'other';

export const EVENT_TYPES = [
  { value: 'investment', label: 'Investissement' },
  { value: 'livestock', label: 'Bétail' },
  { value: 'task', label: 'Tâche' },
  { value: 'financial', label: 'Financier' },
  { value: 'general', label: 'Général' },
];

export const EVENT_CATEGORIES = [
  { value: 'creation', label: 'Création' },
  { value: 'update', label: 'Mise à jour' },
  { value: 'completion', label: 'Achèvement' },
  { value: 'milestone', label: 'Étape importante' },
  { value: 'alert', label: 'Alerte' },
  { value: 'other', label: 'Autre' },
];

export const VISIBILITY_LEVELS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Privé' },
  { value: 'team', label: 'Équipe' },
];