import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (data: Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: number, data: Partial<Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: number) => void;
}

// Mock data
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Vaccination des bovins',
    description: 'Procéder à la vaccination trimestrielle du cheptel',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-03-21'),
    status: 'pending',
    priority: 'high',
    assignedTo: 1,
    investmentId: 1,
    createdBy: 1,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 2,
    title: 'Maintenance des clôtures',
    description: 'Vérifier et réparer les clôtures du pâturage',
    startDate: new Date('2024-03-22'),
    endDate: new Date('2024-03-23'),
    status: 'pending',
    priority: 'medium',
    assignedTo: 1,
    investmentId: 1,
    createdBy: 1,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
];

export const useTaskStore = create<TaskState>()((set) => ({
  tasks: MOCK_TASKS,
  isLoading: false,
  error: null,
  addTask: (data) => {
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...data,
          id: Math.max(...state.tasks.map(t => t.id), 0) + 1,
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
      ],
    }));
  },
  updateTask: (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...data,
              updatedAt: new Date(),
              startDate: data.startDate ? new Date(data.startDate) : task.startDate,
              endDate: data.endDate ? new Date(data.endDate) : task.endDate,
            }
          : task
      ),
    }));
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
}));