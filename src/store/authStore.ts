import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Notification } from '../types';
import { MOCK_USERS, DEMO_PASSWORDS, MOCK_NOTIFICATIONS } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      notifications: MOCK_NOTIFICATIONS,

      login: async (email, password) => {
        // Simulate API call delay
        await new Promise(r => setTimeout(r, 800));

        const mockUser = MOCK_USERS.find(u => u.email === email);
        const correctPassword = DEMO_PASSWORDS[email];

        if (!mockUser || password !== correctPassword) {
          return { success: false, error: 'Invalid email or password. Try demo credentials.' };
        }

        set({ user: mockUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      signup: async (data) => {
        await new Promise(r => setTimeout(r, 1000));

        const newUser: User = {
          id: `u_${Date.now()}`,
          name: data.name || 'New User',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'citizen',
          department: data.department,
          city: data.city || 'Mumbai',
          ward: data.ward,
          points: 100,
          badges: [{ id: 'b_welcome', name: 'Welcome!', icon: '🎉', description: 'Joined PS-CRM', earnedAt: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
        };

        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
        }));
      },

      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true }))
        }));
      },

      addNotification: (notif) => {
        const n: Notification = {
          ...notif,
          id: `n_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [n, ...state.notifications] }));
      },
    }),
    {
      name: 'pscrm-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
