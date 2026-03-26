import { create } from 'zustand';
import type { HealthMetric, HealthRecord, MedicationReminder, EmergencyAlert, ActivityLog } from '../types';
import { userDataService } from '../services/userDataService';

interface HealthStore {
  metrics: HealthMetric[];
  records: HealthRecord[];
  reminders: MedicationReminder[];
  alerts: EmergencyAlert[];
  activityLogs: ActivityLog[];
  
  addMetric: (metric: HealthMetric) => void;
  updateMetric: (id: string, metric: Partial<HealthMetric>) => void;
  removeMetric: (id: string) => void;
  
  addReminder: (reminder: MedicationReminder) => void;
  markReminderTaken: (id: string) => void;
  
  addAlert: (alert: EmergencyAlert) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  
  addActivityLog: (log: ActivityLog) => void;
  getRecentLogs: (limit: number) => ActivityLog[];
  fetchHealthData: (userId: string) => Promise<void>;
}

export const useHealthStore = create<HealthStore>((set, get) => {
  // Load from localStorage if available
  return {
    metrics: [],
    records: [],
    reminders: [],
    alerts: [],
    activityLogs: [],

    fetchHealthData: async (userId: string) => {
      try {
        const data = await userDataService.getUserData(userId);
        if (data) {
          set({
            metrics: data.metrics || [],
            reminders: data.reminders || [],
            alerts: data.sosAlerts || [], // Assuming mapping alerts to sosAlerts
            activityLogs: data.activityLogs || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    },

    addMetric: async (metric: HealthMetric) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMetrics = [...get().metrics, metric];
        set({ metrics: newMetrics });
        if (userId) await userDataService.updateUserData(userId, { metrics: newMetrics });
      } catch (error) {
        console.error('Failed to add metric', error);
      }
    },

    updateMetric: async (id: string, updates: Partial<HealthMetric>) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMetrics = get().metrics.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        set({ metrics: newMetrics });
        if (userId) await userDataService.updateUserData(userId, { metrics: newMetrics });
      } catch(error) {
        console.error('Failed to update metric', error);
      }
    },

    removeMetric: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMetrics = get().metrics.filter((m) => m.id !== id);
        set({ metrics: newMetrics });
        if (userId) await userDataService.updateUserData(userId, { metrics: newMetrics });
      } catch(error) {
        console.error('Failed to remove metric', error);
      }
    },

    addReminder: async (reminder: MedicationReminder) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = [...get().reminders, reminder];
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { reminders: newReminders });
      } catch(error) {
        console.error('Failed to add reminder', error);
      }
    },

    markReminderTaken: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newReminders = get().reminders.map((r) =>
          r.id === id ? { ...r, taken: true, takenAt: new Date() } : r
        );
        set({ reminders: newReminders });
        if (userId) await userDataService.updateUserData(userId, { reminders: newReminders });
      } catch(error) {
        console.error('Failed to mark reminder taken', error);
      }
    },

    addAlert: async (alert: EmergencyAlert) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newAlerts = [alert, ...get().alerts];
        set({ alerts: newAlerts });
        if (userId) await userDataService.updateUserData(userId, { sosAlerts: newAlerts });
      } catch(error) {
        console.error('Failed to add alert', error);
      }
    },

    acknowledgeAlert: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newAlerts = get().alerts.map((a) =>
          a.id === id ? { ...a, status: 'acknowledged' as const } : a
        );
        set({ alerts: newAlerts });
        if (userId) await userDataService.updateUserData(userId, { sosAlerts: newAlerts });
      } catch(error) {
        console.error('Failed to acknowledge alert', error);
      }
    },

    resolveAlert: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newAlerts = get().alerts.map((a) =>
          a.id === id ? { ...a, status: 'resolved' as const, resolvedAt: new Date() } : a
        );
        set({ alerts: newAlerts });
        if (userId) await userDataService.updateUserData(userId, { sosAlerts: newAlerts });
      } catch(error) {
        console.error('Failed to resolve alert', error);
      }
    },

    addActivityLog: async (log: ActivityLog) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newLogs = [log, ...get().activityLogs];
        set({ activityLogs: newLogs });
        if (userId) await userDataService.updateUserData(userId, { activityLogs: newLogs });
      } catch(error) {
        console.error('Failed to add activity log', error);
      }
    },

    getRecentLogs: (limit: number) => {
      return get().activityLogs.slice(0, limit);
    },
  };
});
