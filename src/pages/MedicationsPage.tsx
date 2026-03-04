import React, { useState } from 'react';
import { Plus, Pill, Check, Clock, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '../components/common/Card';
import { useHealthStore } from '../store/healthStore';
import { MainLayout } from '../components/layout/MainLayout';
import type { MedicationReminder } from '../types';

export const MedicationsPage: React.FC = () => {
  const { reminders, addReminder, markReminderTaken } = useHealthStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    scheduledTime: '',
  });

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicationName || !formData.dosage || !formData.scheduledTime) return;

    const newReminder: MedicationReminder = {
      id: Math.random().toString(36).substr(2, 9),
      medicationId: Math.random().toString(36).substr(2, 9),
      medicationName: formData.medicationName,
      scheduledTime: new Date(formData.scheduledTime),
      dosage: formData.dosage,
      taken: false,
    };

    addReminder(newReminder);
    setFormData({ medicationName: '', dosage: '', scheduledTime: '' });
    setShowForm(false);
  };

  const upcomingReminders = reminders.filter((r) => !r.taken);
  const takenReminders = reminders.filter((r) => r.taken);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-400 to-warning-600 rounded-xl flex items-center justify-center">
                <Pill className="text-white" size={24} />
              </div>
              Medications & Reminders
            </h1>
            <p className="text-neutral-600 text-lg">
              💊 Manage your medications and track adherence
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Reminder
          </button>
        </div>

        {/* Add Reminder Form */}
        {showForm && (
          <Card title="Add New Medication Reminder" variant="warning">
            <form onSubmit={handleAddReminder} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Medication Name <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) =>
                    setFormData({ ...formData, medicationName: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Dosage <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Scheduled Time <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledTime: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary-lg flex-1">
                  Add Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Upcoming Reminders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="text-warning-600" size={28} />
                Upcoming Reminders
              </h2>
              <p className="text-neutral-600 text-sm mt-1">{upcomingReminders.length} medications to take</p>
            </div>
            {upcomingReminders.length > 0 && (
              <Badge status="warning" size="lg">{upcomingReminders.length}</Badge>
            )}
          </div>
          
          {upcomingReminders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingReminders.map((reminder) => (
                <Card key={reminder.id} className="bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200 hover:shadow-card transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 bg-white/60 rounded-lg">
                        <Pill className="text-warning-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 truncate">
                          {reminder.medicationName}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1">
                          💊 {reminder.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-neutral-600 font-medium">Scheduled Time</p>
                    <p className="text-sm font-bold text-neutral-900 mt-1">
                      🕐 {new Date(reminder.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(reminder.scheduledTime).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => markReminderTaken(reminder.id)}
                    className="w-full btn-primary-lg flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Mark as Taken
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center bg-gradient-to-br from-success-50 to-success-100 border border-success-200">
              <div className="py-12">
                <CheckCircle2 size={48} className="mx-auto text-success-500 mb-3" />
                <p className="text-neutral-700 font-semibold text-lg mb-2">All caught up! 🎉</p>
                <p className="text-neutral-600 text-sm">No upcoming medication reminders</p>
              </div>
            </Card>
          )}
        </div>

        {/* Taken Reminders */}
        {takenReminders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                  <CheckCircle2 className="text-success-600" size={28} />
                  Completed Medications
                </h2>
                <p className="text-neutral-600 text-sm mt-1">{takenReminders.length} medications taken</p>
              </div>
              <Badge status="success" size="lg">{takenReminders.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {takenReminders.slice(0, 9).map((reminder) => (
                <Card
                  key={reminder.id}
                  className="bg-gradient-to-br from-success-50 to-success-100 border border-success-200 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 bg-white/60 rounded-lg">
                        <CheckCircle2 className="text-success-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 line-through opacity-70 truncate">
                          {reminder.medicationName}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1">
                          💊 {reminder.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs text-neutral-600 font-medium">Taken At</p>
                    <p className="text-sm font-bold text-success-700 mt-1">
                      ✓ {reminder.takenAt
                        ? new Date(reminder.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Completed'}
                    </p>
                    {reminder.takenAt && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(reminder.takenAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
            {takenReminders.length > 9 && (
              <div className="text-center mt-6">
                <p className="text-neutral-600 text-sm">
                  Showing 9 of {takenReminders.length} completed medications
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
