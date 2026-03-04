import React, { useState } from 'react';
import { Plus, Trash2, Heart, Activity, Thermometer, Droplet, Weight } from 'lucide-react';
import { Card, Badge } from '../components/common/Card';
import { useHealthStore } from '../store/healthStore';
import { MainLayout } from '../components/layout/MainLayout';
import type { HealthMetric } from '../types';

export const HealthPage: React.FC = () => {
  const { metrics, addMetric, removeMetric } = useHealthStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'blood_pressure' as const,
    value: '',
    unit: 'mmHg',
    notes: '',
  });

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value) return;

    const newMetric: HealthMetric = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      value: formData.value,
      unit: formData.unit,
      timestamp: new Date(),
      notes: formData.notes,
      status: 'normal',
    };

    addMetric(newMetric);
    setFormData({ type: 'blood_pressure', value: '', unit: 'mmHg', notes: '' });
    setShowForm(false);
  };

  const unitMap = {
    blood_pressure: 'mmHg',
    heart_rate: 'bpm',
    temperature: '°C',
    blood_glucose: 'mg/dL',
    weight: 'kg',
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart_rate':
        return <Activity className="text-red-500" size={24} />;
      case 'blood_pressure':
        return <Droplet className="text-blue-500" size={24} />;
      case 'temperature':
        return <Thermometer className="text-orange-500" size={24} />;
      case 'blood_glucose':
        return <Droplet className="text-amber-500" size={24} />;
      case 'weight':
        return <Weight className="text-purple-500" size={24} />;
      default:
        return <Heart className="text-red-500" size={24} />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'heart_rate':
        return 'from-red-100 to-red-50';
      case 'blood_pressure':
        return 'from-blue-100 to-blue-50';
      case 'temperature':
        return 'from-orange-100 to-orange-50';
      case 'blood_glucose':
        return 'from-amber-100 to-amber-50';
      case 'weight':
        return 'from-purple-100 to-purple-50';
      default:
        return 'from-neutral-100 to-neutral-50';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              Health Metrics
            </h1>
            <p className="text-neutral-600 text-lg">
              📊 Log and track your daily health measurements
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Metric
          </button>
        </div>

        {/* Add Metric Form */}
        {showForm && (
          <Card title="Add New Health Metric" variant="primary">
            <form onSubmit={handleAddMetric} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Metric Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                        unit: unitMap[e.target.value as keyof typeof unitMap],
                      })
                    }
                    className="input-field"
                  >
                    <option value="blood_pressure">🩸 Blood Pressure</option>
                    <option value="heart_rate">❤️ Heart Rate</option>
                    <option value="temperature">🌡️ Temperature</option>
                    <option value="blood_glucose">🍬 Blood Glucose</option>
                    <option value="weight">⚖️ Weight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Value <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., 120/80"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary-lg flex-1">
                  Save Metric
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

        {/* Metrics List */}
        {metrics.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Your Recent Readings</h2>
              <p className="text-neutral-600 text-sm mt-1">Total recorded: {metrics.length} metrics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {metrics.map((metric) => (
                <Card key={metric.id} className={`bg-gradient-to-br ${getMetricColor(metric.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/60 rounded-lg">
                          {getMetricIcon(metric.type)}
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 capitalize">
                          {metric.type.replace('_', ' ')}
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-gradient mb-1">
                        {metric.value}
                        <span className="text-sm text-neutral-600 ml-2">{metric.unit}</span>
                      </p>
                      <p className="text-xs text-neutral-600 mb-3">
                        🕐 {new Date(metric.timestamp).toLocaleString()}
                      </p>
                      {metric.notes && (
                        <div className="bg-white/40 rounded-lg p-2 mt-3">
                          <p className="text-xs text-neutral-700 font-medium">Notes:</p>
                          <p className="text-sm text-neutral-700 mt-1">{metric.notes}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeMetric(metric.id)}
                      className="flex-shrink-0 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors ml-2"
                      title="Delete metric"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <Badge
                      status={metric.status === 'normal' ? 'success' : metric.status === 'warning' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {metric.status === 'normal' ? '✓ Normal' : metric.status === 'warning' ? '⚠️ Warning' : '❌ Critical'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={48} className="text-red-500" />
            </div>
            <p className="text-neutral-700 font-semibold text-lg mb-2">No health metrics recorded yet</p>
            <p className="text-neutral-600 text-sm mb-6">
              Click the "Add Metric" button above to start tracking your health
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary-lg mx-auto"
            >
              <Plus size={18} className="inline mr-2" />
              Create First Metric
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
