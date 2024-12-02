import { create } from 'zustand';
import { Investment } from '../types';

interface InvestmentState {
  investments: Investment[];
  isLoading: boolean;
  error: string | null;
  addInvestment: (data: Omit<Investment, 'id' | 'userId'>) => void;
  updateInvestment: (id: number, data: Partial<Omit<Investment, 'id' | 'userId'>>) => void;
  deleteInvestment: (id: number) => void;
}

// Mock data
const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 1,
    category: 'Élevage',
    typeOfInvestment: 'Bovins',
    initialAmount: 5000000,
    currentValue: 7500000,
    dateOfInvestment: new Date('2023-01-15'),
    locationId: 1,
    userId: 1,
    status: 'actif',
  },
  {
    id: 2,
    category: 'Agriculture',
    typeOfInvestment: 'Riz',
    initialAmount: 3000000,
    currentValue: 4500000,
    dateOfInvestment: new Date('2023-03-20'),
    locationId: 2,
    userId: 1,
    status: 'actif',
  },
];

export const useInvestmentStore = create<InvestmentState>()((set) => ({
  investments: MOCK_INVESTMENTS,
  isLoading: false,
  error: null,
  addInvestment: (data) => {
    set((state) => ({
      investments: [
        ...state.investments,
        {
          ...data,
          id: Math.max(...state.investments.map(i => i.id), 0) + 1,
          userId: 1,
          dateOfInvestment: new Date(data.dateOfInvestment),
        },
      ],
    }));
  },
  updateInvestment: (id, data) => {
    set((state) => ({
      investments: state.investments.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              dateOfInvestment: data.dateOfInvestment ? new Date(data.dateOfInvestment) : item.dateOfInvestment,
            }
          : item
      ),
    }));
  },
  deleteInvestment: (id) => {
    set((state) => ({
      investments: state.investments.filter((item) => item.id !== id),
    }));
  },
}));