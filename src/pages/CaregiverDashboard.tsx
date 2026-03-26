import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userDataService } from '../services/userDataService';
import { Card } from '../components/common/Card';
import { Activity, Droplets, Pill, Bell, RefreshCw, LogOut } from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPatientData = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await userDataService.getUserData(id);
      setPatientData(data);
    } catch (err: any) {
      setError('Patient not found or error loading data. Check the patient ID.');
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatientData(patientId);
  };

  // Optional: Auto polling for live sync (every 10 seconds)
  useEffect(() => {
    if (!patientId || !patientData) return;
    const interval = setInterval(() => {
      fetchPatientData(patientId);
    }, 10000);
    return () => clearInterval(interval);
  }, [patientId, patientData]);

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Caregiver Top Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-lg border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <p className="text-white font-bold text-base">ElderEase</p>
                <p className="text-xs text-neutral-400">Caregiver Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-neutral-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Caregiver Portal
        </h1>
        <p className="text-neutral-600 mt-2">Welcome back, {user?.name}. Monitor your patients' live metrics.</p>
      </div>

      {/* Patient Search */}
      <Card className="mb-8 p-6 bg-white shadow-elegant border-l-4 border-l-primary-500">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Patient ID to Monitor
            </label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter Patient's Database ID..."
              className="input-field w-full"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
            Fetch Data
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </Card>

      {/* Analytics Dashboard */}
      {patientData && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-800">Live Analytics: Patient {patientId}</h2>
            <span className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vitals Overview */}
            <Card className="p-5 shadow-sm border border-neutral-100 bg-gradient-to-br from-red-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <Activity size={24} />
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Vitals</span>
              </div>
              <h3 className="text-neutral-500 text-sm font-medium mb-1">Total Health Logs</h3>
              <p className="text-2xl font-bold text-neutral-900">{patientData.metrics?.length || 0}</p>
            </Card>

            {/* Hydration */}
            <Card className="p-5 shadow-sm border border-neutral-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Droplets size={24} />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">Hydration</span>
              </div>
              <h3 className="text-neutral-500 text-sm font-medium mb-1">Entries Today</h3>
              <p className="text-2xl font-bold text-neutral-900">{patientData.hydrationEntries?.length || 0}</p>
            </Card>

            {/* Meds */}
            <Card className="p-5 shadow-sm border border-neutral-100 bg-gradient-to-br from-yellow-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                  <Pill size={24} />
                </div>
              </div>
              <h3 className="text-neutral-500 text-sm font-medium mb-1">Active Reminders</h3>
              <p className="text-2xl font-bold text-neutral-900">{patientData.healthReminders?.length || 0}</p>
            </Card>

            {/* SOS */}
            <Card className="p-5 shadow-sm border border-neutral-100 bg-gradient-to-br from-accent-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent-100 text-accent-600 rounded-xl">
                  <Bell size={24} />
                </div>
                <span className="text-xs font-bold text-accent-600 bg-accent-100 px-2 py-1 rounded-lg">Emergencies</span>
              </div>
              <h3 className="text-neutral-500 text-sm font-medium mb-1">SOS Alerts Triggered</h3>
              <p className="text-2xl font-bold text-neutral-900">{patientData.sosAlerts?.length || 0}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 border-b pb-2">Medical Profile</h3>
              {patientData.medicalInfo ? (
                <div className="space-y-3">
                  <p><span className="font-semibold">Blood Type:</span> {patientData.medicalInfo.bloodType || 'N/A'}</p>
                  <p><span className="font-semibold">Allergies:</span> {patientData.medicalInfo.allergies?.join(', ') || 'None'}</p>
                  <p><span className="font-semibold">Conditions:</span> {patientData.medicalInfo.medicalConditions?.join(', ') || 'None'}</p>
                  <p><span className="font-semibold border-t pt-2 block mt-2">Emergency Notes:</span> {patientData.medicalInfo.emergencyNotes || 'None'}</p>
                </div>
              ) : (
                <p className="text-neutral-500">No medical profile recorded.</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 border-b pb-2">Recent Emergency Alerts</h3>
              {patientData.sosAlerts && patientData.sosAlerts.length > 0 ? (
                <div className="space-y-3">
                  {patientData.sosAlerts.slice(0, 3).map((alert: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg">
                      <Bell size={16} />
                      <div>
                        <p className="font-semibold text-sm">Type: {alert.type}</p>
                        <p className="text-xs opacity-80">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No emergency alerts recorded.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
