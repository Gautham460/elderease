import { create } from 'zustand';
import type { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (email: string, password?: string, role?: string) => Promise<void>;
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

    login: async (email: string, password?: string, role?: string) => {
      set({ loading: true, error: null });
      try {
        const data = await authService.login(email, password || 'password', role); // pass role down
        
        const mockUser: User = {
          ...data.user,
          token: data.token,
        };

        set({
          isAuthenticated: true,
          user: mockUser,
          loading: false,
          error: null,
        });

        localStorage.setItem('eldereaseUser', JSON.stringify(mockUser));
      } catch (error: any) {
        set({
          loading: false,
          error: error.response?.data?.message || 'Login failed. Please try again.',
          isAuthenticated: false,
        });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string, role: string) => {
      set({ loading: true, error: null });
      try {
        const data = await authService.register({ name, email, password, role });

        const newUser: User = {
          ...data.user,
          token: data.token,
        };

        set({
          isAuthenticated: true,
          user: newUser,
          loading: false,
          error: null,
        });

        localStorage.setItem('eldereaseUser', JSON.stringify(newUser));
      } catch (error: any) {
        set({
          loading: false,
          error: error.response?.data?.message || 'Registration failed. Please try again.',
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
