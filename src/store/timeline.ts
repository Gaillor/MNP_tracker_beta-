import { create } from 'zustand';
import { TimelineEvent } from '../types/timeline';

interface TimelineState {
  events: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
  addEvent: (data: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: number, data: Partial<Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEvent: (id: number) => void;
}

// Mock data
const MOCK_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    title: 'Nouveau lot de bovins',
    description: 'Acquisition de 5 nouveaux zébus pour l\'élevage',
    eventDate: new Date('2024-03-15'),
    type: 'livestock',
    category: 'creation',
    investmentId: 1,
    userId: 1,
    visibilityLevel: 'public',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 2,
    title: 'Début de la saison des semis',
    description: 'Démarrage des activités de semis pour la nouvelle saison',
    eventDate: new Date('2024-03-10'),
    type: 'investment',
    category: 'milestone',
    investmentId: 2,
    userId: 1,
    visibilityLevel: 'public',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

export const useTimelineStore = create<TimelineState>()((set) => ({
  events: MOCK_EVENTS,
  isLoading: false,
  error: null,
  addEvent: (data) => {
    set((state) => ({
      events: [
        {
          ...data,
          id: Math.max(...state.events.map(e => e.id), 0) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventDate: new Date(data.eventDate),
        },
        ...state.events,
      ],
    }));
  },
  updateEvent: (id, data) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? {
              ...event,
              ...data,
              updatedAt: new Date(),
              eventDate: data.eventDate ? new Date(data.eventDate) : event.eventDate,
            }
          : event
      ),
    }));
  },
  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },
}));