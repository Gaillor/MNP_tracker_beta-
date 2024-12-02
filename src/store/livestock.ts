import { create } from 'zustand';
import { Livestock } from '../types/livestock';

interface LivestockState {
  livestock: Livestock[];
  isLoading: boolean;
  error: string | null;
  addLivestock: (data: Omit<Livestock, 'id'>) => void;
  updateLivestock: (id: number, data: Partial<Omit<Livestock, 'id'>>) => void;
  deleteLivestock: (id: number) => void;
}

// Mock data
const MOCK_LIVESTOCK: Livestock[] = [
  {
    id: 1,
    uniqueIdentifier: 'BOV-001',
    type: 'cattle',
    race: 'Zébu',
    dateOfBirth: new Date('2022-01-15'),
    gender: 'female',
    acquisitionDate: new Date('2022-03-01'),
    acquisitionPrice: 1500000,
    currentStatus: 'healthy',
    investmentId: 1,
  },
  {
    id: 2,
    uniqueIdentifier: 'BOV-002',
    type: 'cattle',
    race: 'Zébu',
    dateOfBirth: new Date('2022-02-20'),
    gender: 'male',
    acquisitionDate: new Date('2022-03-01'),
    acquisitionPrice: 1800000,
    currentStatus: 'healthy',
    investmentId: 1,
  },
];

export const useLivestockStore = create<LivestockState>()((set) => ({
  livestock: MOCK_LIVESTOCK,
  isLoading: false,
  error: null,
  addLivestock: (data) => {
    set((state) => ({
      livestock: [
        ...state.livestock,
        {
          ...data,
          id: Math.max(...state.livestock.map(l => l.id), 0) + 1,
          dateOfBirth: new Date(data.dateOfBirth),
          acquisitionDate: new Date(data.acquisitionDate),
        },
      ],
    }));
  },
  updateLivestock: (id, data) => {
    set((state) => ({
      livestock: state.livestock.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : item.dateOfBirth,
              acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : item.acquisitionDate,
            }
          : item
      ),
    }));
  },
  deleteLivestock: (id) => {
    set((state) => ({
      livestock: state.livestock.filter((item) => item.id !== id),
    }));
  },
}));