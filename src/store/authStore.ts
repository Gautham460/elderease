import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Try to restore auth state from localStorage
  const savedUser = localStorage.getItem('eldereaseUser');
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    isAuthenticated: !!savedUser,
    user: initialUser,
    loading: false,
    error: null,

    login: async (email: string) => {
      set({ loading: true, error: null });
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock user data - in production, this would come from your backend
        const mockUser: User = {
          id: '1',
          name: email.split('@')[0],
          email,
          role: 'elder',
          phone: '+1-234-567-8900',
          address: '123 Main St, Senior City, SC 12345',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        };

        set({
          isAuthenticated: true,
          user: mockUser,
          loading: false,
          error: null,
        });

        localStorage.setItem('eldereaseUser', JSON.stringify(mockUser));
      } catch (error) {
        set({
          loading: false,
          error: 'Login failed. Please try again.',
          isAuthenticated: false,
        });
        throw error;
      }
    },

    register: async (name: string, email: string, _password: string, role: string) => {
      set({ loading: true, error: null });
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role: (role as 'elder' | 'caregiver' | 'admin') || 'elder',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        };

        set({
          isAuthenticated: true,
          user: newUser,
          loading: false,
          error: null,
        });

        localStorage.setItem('eldereaseUser', JSON.stringify(newUser));
      } catch (error) {
        set({
          loading: false,
          error: 'Registration failed. Please try again.',
          isAuthenticated: false,
        });
        throw error;
      }
    },

    logout: () => {
      set({
        isAuthenticated: false,
        user: null,
        error: null,
      });
      localStorage.removeItem('eldereaseUser');
    },

    setUser: (user: User) => {
      set({ user, isAuthenticated: true });
      localStorage.setItem('eldereaseUser', JSON.stringify(user));
    },

    setError: (error: string | null) => {
      set({ error });
    },
  };
});
