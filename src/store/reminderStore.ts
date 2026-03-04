import { create } from 'zustand';
import type { HealthReminder, HydrationEntry } from '../types';

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
  // Load from localStorage
  const savedReminders = localStorage.getItem('eldereaseReminders');
  const savedHydration = localStorage.getItem('eldereaseHydration');
  const savedGoal = localStorage.getItem('eldereaseHydrationGoal');

  return {
    reminders: savedReminders ? JSON.parse(savedReminders) : DEFAULT_REMINDERS,
    hydrationEntries: savedHydration ? JSON.parse(savedHydration) : [],
    hydrationGoal: savedGoal ? parseInt(savedGoal) : 2000, // Default 2L

    addReminder: (reminder: HealthReminder) => {
      set((state) => {
        const newReminders = [...state.reminders, reminder];
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    updateReminder: (id: string, updates: Partial<HealthReminder>) => {
      set((state) => {
        const newReminders = state.reminders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        );
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    removeReminder: (id: string) => {
      set((state) => {
        const newReminders = state.reminders.filter((r) => r.id !== id);
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    toggleReminder: (id: string) => {
      set((state) => {
        const newReminders = state.reminders.map((r) =>
          r.id === id ? { ...r, enabled: !r.enabled } : r
        );
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    addHydrationEntry: (amount: number) => {
      set((state) => {
        const entry: HydrationEntry = {
          id: Date.now().toString(),
          amount,
          timestamp: new Date(),
        };
        const newEntries = [...state.hydrationEntries, entry];
        localStorage.setItem('eldereaseHydration', JSON.stringify(newEntries));
        return { hydrationEntries: newEntries };
      });
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

    resetDailyHydration: () => {
      set({ hydrationEntries: [] });
      localStorage.setItem('eldereaseHydration', JSON.stringify([]));
    },
  };
});
