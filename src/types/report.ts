export interface FinancialMetric {
  id: number;
  investmentId: number;
  type: 'revenue' | 'expense' | 'profit';
  amount: number;
  date: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface InvestmentPerformance {
  id: number;
  investmentId: number;
  initialValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  period: string;
}

export const REPORT_PERIODS = [
  { value: 'daily', label: 'Journalier' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'yearly', label: 'Annuel' },
];