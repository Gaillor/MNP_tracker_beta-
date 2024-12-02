import { create } from 'zustand';
import { User } from '../types/user';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  addUser: (data: Omit<User, 'id' | 'lastLogin' | 'createdAt'>) => void;
  updateUser: (id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  deleteUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    lastLogin: new Date(),
    createdAt: new Date(),
    isActive: true,
    permissions: ['manage_users', 'manage_investments', 'manage_livestock', 'manage_tasks', 'view_reports', 'manage_settings'],
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    lastLogin: new Date(),
    createdAt: new Date(),
    isActive: true,
    permissions: ['manage_investments', 'manage_livestock', 'manage_tasks'],
  },
];

export const useUsersStore = create<UsersState>()((set) => ({
  users: MOCK_USERS,
  isLoading: false,
  error: null,
  addUser: (data) => {
    set((state) => ({
      users: [
        ...state.users,
        {
          ...data,
          id: Math.max(...state.users.map(u => u.id), 0) + 1,
          lastLogin: new Date(),
          createdAt: new Date(),
        },
      ],
    }));
  },
  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? {
              ...user,
              ...data,
              lastLogin: data.lastLogin ? new Date(data.lastLogin) : user.lastLogin,
            }
          : user
      ),
    }));
  },
  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },
  toggleUserStatus: (id) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? { ...user, isActive: !user.isActive }
          : user
      ),
    }));
  },
}));