import { create } from 'zustand';
import type { HealthMetric, HealthRecord, MedicationReminder, EmergencyAlert, ActivityLog } from '../types';

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
}

export const useHealthStore = create<HealthStore>((set, get) => {
  // Load from localStorage if available
  const savedMetrics = localStorage.getItem('eldereaseMetrics');
  const savedReminders = localStorage.getItem('eldereaseReminders');
  const savedAlerts = localStorage.getItem('eldereaseAlerts');
  const savedLogs = localStorage.getItem('eldereaseActivityLogs');

  return {
    metrics: savedMetrics ? JSON.parse(savedMetrics) : [],
    records: [],
    reminders: savedReminders ? JSON.parse(savedReminders) : [],
    alerts: savedAlerts ? JSON.parse(savedAlerts) : [],
    activityLogs: savedLogs ? JSON.parse(savedLogs) : [],

    addMetric: (metric: HealthMetric) => {
      set((state) => {
        const newMetrics = [...state.metrics, metric];
        localStorage.setItem('eldereaseMetrics', JSON.stringify(newMetrics));
        return { metrics: newMetrics };
      });
    },

    updateMetric: (id: string, updates: Partial<HealthMetric>) => {
      set((state) => {
        const newMetrics = state.metrics.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        localStorage.setItem('eldereaseMetrics', JSON.stringify(newMetrics));
        return { metrics: newMetrics };
      });
    },

    removeMetric: (id: string) => {
      set((state) => {
        const newMetrics = state.metrics.filter((m) => m.id !== id);
        localStorage.setItem('eldereaseMetrics', JSON.stringify(newMetrics));
        return { metrics: newMetrics };
      });
    },

    addReminder: (reminder: MedicationReminder) => {
      set((state) => {
        const newReminders = [...state.reminders, reminder];
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    markReminderTaken: (id: string) => {
      set((state) => {
        const newReminders = state.reminders.map((r) =>
          r.id === id ? { ...r, taken: true, takenAt: new Date() } : r
        );
        localStorage.setItem('eldereaseReminders', JSON.stringify(newReminders));
        return { reminders: newReminders };
      });
    },

    addAlert: (alert: EmergencyAlert) => {
      set((state) => {
        const newAlerts = [alert, ...state.alerts];
        localStorage.setItem('eldereaseAlerts', JSON.stringify(newAlerts));
        return { alerts: newAlerts };
      });
    },

    acknowledgeAlert: (id: string) => {
      set((state) => {
        const newAlerts = state.alerts.map((a) =>
          a.id === id ? { ...a, status: 'acknowledged' as const } : a
        );
        localStorage.setItem('eldereaseAlerts', JSON.stringify(newAlerts));
        return { alerts: newAlerts };
      });
    },

    resolveAlert: (id: string) => {
      set((state) => {
        const newAlerts = state.alerts.map((a) =>
          a.id === id ? { ...a, status: 'resolved' as const, resolvedAt: new Date() } : a
        );
        localStorage.setItem('eldereaseAlerts', JSON.stringify(newAlerts));
        return { alerts: newAlerts };
      });
    },

    addActivityLog: (log: ActivityLog) => {
      set((state) => {
        const newLogs = [log, ...state.activityLogs];
        localStorage.setItem('eldereaseActivityLogs', JSON.stringify(newLogs));
        return { activityLogs: newLogs };
      });
    },

    getRecentLogs: (limit: number) => {
      return get().activityLogs.slice(0, limit);
    },
  };
});
