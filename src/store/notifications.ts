import { create } from 'zustand';
import api from '../services/api';
import { Notification } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/notifications');
      set({
        notifications: response.data.notifications,
        unreadCount: response.data.unreadCount,
      });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des notifications' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: response.data.unreadCount,
      }));
    } catch (error) {
      set({ error: 'Erreur lors du marquage de la notification' });
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/mark-all-read');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({ error: 'Erreur lors du marquage des notifications' });
    }
  },

  deleteNotification: async (id: number) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: response.data.unreadCount,
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la suppression de la notification' });
    }
  },
}));