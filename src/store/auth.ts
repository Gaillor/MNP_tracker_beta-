import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Simulated user data for testing
const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  lastLogin: new Date(),
  createdAt: new Date(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // TODO: Replace with actual API call
        if (email === 'admin@example.com' && password === 'admin123') {
          set({
            user: MOCK_USER,
            token: 'mock-jwt-token',
            isAuthenticated: true,
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);