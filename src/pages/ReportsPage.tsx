import React from 'react';
import { BarChart2, TrendingUp, Calendar, Download, Share2, FileText } from 'lucide-react';
import { Card, StatCard, Badge } from '../components/common/Card';
import { useHealthStore } from '../store/healthStore';
import { MainLayout } from '../components/layout/MainLayout';

export const ReportsPage: React.FC = () => {
  const { metrics, reminders } = useHealthStore();

  const medicationAdherence = reminders.length > 0
    ? Math.round((reminders.filter((r) => r.taken).length / reminders.length) * 100)
    : 0;

  const thisWeekMetrics = metrics.filter((m) => {
    const date = new Date(m.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const last30DaysMetrics = metrics.filter((m) => {
    const date = new Date(m.timestamp);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return date >= monthAgo;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-xl flex items-center justify-center">
              <BarChart2 className="text-white" size={24} />
            </div>
            Health Reports & Analytics
          </h1>
          <p className="text-neutral-600 text-lg">
            📊 View your health trends and medication adherence
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Medication Adherence"
            value={`${medicationAdherence}%`}
            icon={<TrendingUp size={24} />}
            color="green"
            trendValue={`${reminders.filter((r) => r.taken).length}/${reminders.length} taken`}
          />
          <StatCard
            label="Metrics This Week"
            value={thisWeekMetrics.length}
            icon={<Calendar size={24} />}
            color="blue"
            trendValue={`vs ${last30DaysMetrics.length} this month`}
          />
          <StatCard
            label="Avg Readings/Day"
            value={(metrics.length / 30).toFixed(1)}
            icon={<BarChart2 size={24} />}
            color="orange"
            trendValue="Last 30 days"
          />
          <StatCard
            label="Active Metrics"
            value={new Set(metrics.map((m) => m.type)).size}
            icon={<TrendingUp size={24} />}
            color="purple"
            trendValue="Tracked types"
          />
        </div>

        {/* Report Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* This Week */}
          <Card title="This Week" variant="primary" subtitle={`${thisWeekMetrics.length} readings`}>
            {thisWeekMetrics.length > 0 ? (
              <div className="space-y-3">
                {thisWeekMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl hover:shadow-card transition-all duration-300 border border-neutral-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-semibold text-neutral-900 capitalize">
                          {metric.type.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-neutral-500 mt-1">
                          📅 {new Date(metric.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {metric.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600 font-medium">No data this week</p>
              </div>
            )}
          </Card>

          {/* Last Month */}
          <Card title="Last 30 Days" variant="success" subtitle={`${last30DaysMetrics.length} readings`}>
            {last30DaysMetrics.length > 0 ? (
              <div className="space-y-3">
                {last30DaysMetrics.slice(0, 5).map((metric) => (
                  <div
                    key={metric.id}
                    className="p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl hover:shadow-card transition-all duration-300 border border-success-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-semibold text-neutral-900 capitalize">
                          {metric.type.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-neutral-600 mt-1">
                          📅 {new Date(metric.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                        {metric.value}
                      </span>
                    </div>
                  </div>
                ))}
                {last30DaysMetrics.length > 5 && (
                  <div className="text-xs text-neutral-500 text-center py-2 pt-3 border-t border-success-200">
                    <span className="bg-success-100 text-success-700 px-3 py-1 rounded-full inline-block font-medium">
                      +{last30DaysMetrics.length - 5} more readings
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600 font-medium">No data this month</p>
              </div>
            )}
          </Card>

          {/* Summary */}
          <Card title="Health Summary" variant="secondary">
            <div className="space-y-5">
              {/* Medication Adherence Progress */}
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-neutral-800">
                    💊 Medication Adherence
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                    {medicationAdherence}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      medicationAdherence >= 80
                        ? 'bg-gradient-to-r from-success-500 to-success-600'
                        : medicationAdherence >= 60
                        ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                        : 'bg-gradient-to-r from-accent-500 to-accent-600'
                    }`}
                    style={{ width: `${medicationAdherence}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  {medicationAdherence >= 80 ? '✓ Excellent adherence!' : medicationAdherence >= 60 ? '⚠️ Good progress' : '❌ Needs improvement'}
                </p>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <p className="font-semibold text-neutral-800 mb-3">
                  📍 Top Metrics Tracked
                </p>
                <div className="space-y-2">
                  {Array.from(
                    { length: Math.min(3, new Set(metrics.map((m) => m.type)).size) },
                    (_, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-secondary-50 rounded-lg">
                        <span className="text-sm text-neutral-700 font-medium">
                          Metric Type {i + 1}
                        </span>
                        <Badge status="secondary" size="sm">
                          Tracked
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <a
                  href="/health"
                  className="w-full block text-center text-sm font-bold text-secondary-600 hover:text-secondary-700 py-3 hover:bg-secondary-50 rounded-lg transition-colors"
                >
                  View Detailed Analytics →
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Section */}
        <Card title="Export & Share Your Data" variant="warning">
          <div className="space-y-4">
            <p className="text-neutral-700 font-medium">
              📥 Download your health data in various formats for backup or sharing with your healthcare provider.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 btn-primary-lg">
                <FileText size={18} />
                <span>PDF Report</span>
              </button>
              <button className="flex items-center justify-center gap-2 btn-secondary">
                <Download size={18} />
                <span>Export CSV</span>
              </button>
              <button className="flex items-center justify-center gap-2 btn-secondary">
                <Share2 size={18} />
                <span>Share Summary</span>
              </button>
            </div>
            <p className="text-xs text-neutral-600 mt-3 pt-3 border-t border-warning-200">
              💡 Your data is encrypted and secure. We never share your information without your consent.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
