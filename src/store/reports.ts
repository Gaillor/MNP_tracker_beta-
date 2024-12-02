import { create } from 'zustand';
import { FinancialMetric, InvestmentPerformance } from '../types/report';

interface ReportsState {
  financialMetrics: FinancialMetric[];
  investmentPerformances: InvestmentPerformance[];
  isLoading: boolean;
  error: string | null;
}

// Mock data
const MOCK_METRICS: FinancialMetric[] = [
  {
    id: 1,
    investmentId: 1,
    type: 'revenue',
    amount: 1500000,
    date: new Date('2024-03-01'),
    period: 'monthly',
  },
  {
    id: 2,
    investmentId: 1,
    type: 'expense',
    amount: 500000,
    date: new Date('2024-03-01'),
    period: 'monthly',
  },
];

const MOCK_PERFORMANCES: InvestmentPerformance[] = [
  {
    id: 1,
    investmentId: 1,
    initialValue: 5000000,
    currentValue: 7500000,
    profitLoss: 2500000,
    profitLossPercentage: 50,
    period: '2024-03',
  },
];

export const useReportsStore = create<ReportsState>()((set) => ({
  financialMetrics: MOCK_METRICS,
  investmentPerformances: MOCK_PERFORMANCES,
  isLoading: false,
  error: null,
}));