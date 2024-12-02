export interface Task {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: number;
  investmentId: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TASK_STATUS = [
  { value: 'pending', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
];

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
];