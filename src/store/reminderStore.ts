import { create } from 'zustand';
import type { HealthReminder, HydrationEntry } from '../types';
import { userDataService } from '../services/userDataService';

interface ReminderStore {
  // Health Reminders
  reminders: HealthReminder[];
  
  // Hydration Tracking
  hydrationEntries: HydrationEntry[];
  hydrationGoal: number; // in ml
  
  // Reminder Actions
  addReminder: (reminder: HealthReminder) => void;
  updateReminder: (id: string, updates: Partial<HealthReminder>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  
  // Hydration Actions
  addHydrationEntry: (amount: number) => void;
  getTodayHydration: () => number;
  getHydrationProgress: () => number;
  resetDailyHydration: () => void;
  fetchReminderData: (userId: string) => Promise<void>;
}

const DEFAULT_REMINDERS: HealthReminder[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Morning Medication',
    description: 'Take your morning medications',
    time: '08:00',
    enabled: true,
    frequency: 'daily',
  },
  {
    id: '2',
    type: 'hydration',
    title: 'Morning Hydration',
    description: 'Drink a glass of water',
    time: '07:00',
    enabled: true,
    frequency: 'daily',
  },
  {
    id: '3',
    type: 'exercise',
    title: 'Morning Walk',
    description: 'Take a 15-minute walk',
    time: '09:00',
    enabled: true,
    frequency: 'daily',
  },
  {
    id: '4',
    type: 'hydration',
    title: 'Afternoon Hydration',
    description: 'Drink water to stay hydrated',
    time: '14:00',
    enabled: true,
    frequency: 'daily',
  },
  {
    id: '5',
    type: 'medication',
    title: 'Evening Medication',
    description: 'Take your evening medications',
    time: '20:00',
    enabled: true,
    frequency: 'daily',
  },
];

export const useReminderStore = create<ReminderStore>((set, get) => {
  return {
    reminders: DEFAULT_REMINDERS,
    hydrationEntries: [],
    hydrationGoal: 2000, // Default 2L

    fetchReminderData: async (userId: string) => {
      try {
        const data = await userDataService.getUserData(userId);
        if (data) {
          set({
            reminders: data.healthReminders?.length ? data.healthReminders : DEFAULT_REMINDERS,
            hydrationEntries: data.hydrationEntries || [],
            hydrationGoal: data.hydrationGoal || 2000,
          });
        }
      } catch (error) {
        console.error('Failed to fetch reminder data:', error);
      }
    },

    addReminder: async (reminder: HealthReminder) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = [...get().reminders, reminder];
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { healthReminders: newReminders });
      } catch(error) {
        console.error('Failed to add reminder', error);
      }
    },

    updateReminder: async (id: string, updates: Partial<HealthReminder>) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = get().reminders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        );
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { healthReminders: newReminders });
      } catch(error) {
        console.error('Failed to update reminder', error);
      }
    },

    removeReminder: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = get().reminders.filter((r) => r.id !== id);
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { healthReminders: newReminders });
      } catch(error) {
        console.error('Failed to remove reminder', error);
      }
    },

    toggleReminder: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = get().reminders.map((r) =>
          r.id === id ? { ...r, enabled: !r.enabled } : r
        );
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { healthReminders: newReminders });
      } catch(error) {
        console.error('Failed to toggle reminder', error);
      }
    },

    addHydrationEntry: async (amount: number) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const entry: HydrationEntry = {
          id: Date.now().toString(),
          amount,
          timestamp: new Date(),
        };
        const newEntries = [...get().hydrationEntries, entry];
        set({ hydrationEntries: newEntries });
        if (userId) await userDataService.updateUserData(userId, { hydrationEntries: newEntries });
      } catch(error) {
        console.error('Failed to add hydration entry', error);
      }
    },

    getTodayHydration: () => {
      const { hydrationEntries } = get();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return hydrationEntries
        .filter((entry) => new Date(entry.timestamp) >= today)
        .reduce((total, entry) => total + entry.amount, 0);
    },

    getHydrationProgress: () => {
      const { hydrationGoal } = get();
      const todayTotal = get().getTodayHydration();
      return Math.min(100, Math.round((todayTotal / hydrationGoal) * 100));
    },

    resetDailyHydration: async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        set({ hydrationEntries: [] });
        if (userId) await userDataService.updateUserData(userId, { hydrationEntries: [] });
      } catch(error) {
        console.error('Failed to reset hydration', error);
      }
    },
  };
});
