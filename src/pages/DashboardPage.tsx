import React, { useState, useEffect } from 'react';
import { Heart, Pill, AlertCircle, Users, Activity, ChevronRight, Droplets, Mic, MicOff, Volume2, Plus, Check, X, Clock } from 'lucide-react';
import { Card, StatCard, Badge } from '../components/common/Card';
import { useHealthStore } from '../store/healthStore';
import { useContactStore } from '../store/contactStore';
import { useReminderStore } from '../store/reminderStore';
import { useVoiceCommand } from '../hooks/useVoiceCommand';
import { MainLayout } from '../components/layout/MainLayout';

export const DashboardPage: React.FC = () => {
  const { metrics, reminders, alerts } = useHealthStore();
  const { familyMembers } = useContactStore();
  const { reminders: healthReminders, hydrationGoal, addHydrationEntry, getTodayHydration, getHydrationProgress } = useReminderStore();
  const [upcomingReminders, setUpcomingReminders] = useState(0);
  
  // Voice Command Hook
  const { 
    isListening, 
    transcript, 
    isSupported: isVoiceSupported, 
    error: voiceError,
    recognizedCommand,
    startListening, 
    stopListening,
    resetTranscript 
  } = useVoiceCommand();
  
  // Hydration quick add state
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [hydrationAmount, setHydrationAmount] = useState(250);

  useEffect(() => {
    // Count upcoming reminders (not taken)
    setUpcomingReminders(reminders.filter((r: any) => !r.taken).length);
  }, [reminders]);

  // Handle voice command recognition
  useEffect(() => {
    if (recognizedCommand) {
      switch (recognizedCommand.action) {
        case 'hydration':
          addHydrationEntry(250);
          break;
        case 'add_medication':
          window.location.href = '/medications';
          break;
        case 'log_health':
          window.location.href = '/health';
          break;
        case 'emergency':
          // Trigger emergency alert
          break;
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'show_medications':
          window.location.href = '/medications';
          break;
        case 'show_health':
          window.location.href = '/health';
          break;
        case 'add_contact':
          window.location.href = '/contacts';
          break;
      }
      resetTranscript();
    }
  }, [recognizedCommand, addHydrationEntry, resetTranscript]);

  const activeAlerts = alerts.filter((a) => a.status === 'pending').length;
  const healthMetricsThisWeek = metrics.length;
  
  // Hydration calculations
  const todayHydration = getTodayHydration();
  const hydrationPercent = getHydrationProgress();

  // Get today's reminders
  const todayReminders = healthReminders.filter((r) => r.enabled);

  const handleAddHydration = () => {
    addHydrationEntry(hydrationAmount);
    setShowHydrationModal(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-8 text-white shadow-elegant">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-primary-100 text-lg">
                Here's your health overview for today
              </p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-primary-100">Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            
            {/* Voice Command Button */}
            {isVoiceSupported && (
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 animate-pulse shadow-lg' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title={isListening ? 'Stop listening' : 'Voice command - Press and speak'}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <span className="text-xs text-white/80">
                  {isListening ? 'Listening...' : 'Hold to speak'}
                </span>
              </div>
            )}
          </div>
          
          {/* Voice Transcript Display */}
          {(transcript || recognizedCommand) && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              {recognizedCommand ? (
                <div className="flex items-center gap-2 text-green-300">
                  <Check size={20} />
                  <span>Command recognized: <strong>{recognizedCommand.description}</strong></span>
                </div>
              ) : isListening ? (
                <div className="flex items-center gap-2">
                  <Volume2 size={20} className="animate-pulse" />
                  <span>"{transcript}"</span>
                </div>
              ) : null}
            </div>
          )}
          
          {voiceError && (
            <div className="mt-2 p-2 bg-red-500/30 rounded text-sm">
              Voice error: {voiceError}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            label="Health Metrics"
            value={healthMetricsThisWeek}
            icon={<Heart size={24} />}
            color="red"
            trendValue={`+${Math.max(0, healthMetricsThisWeek - 2)}`}
            trend="up"
          />
          <StatCard
            label="Upcoming Meds"
            value={upcomingReminders}
            icon={<Pill size={24} />}
            color="orange"
            trendValue={`${reminders.length} total`}
            trend="neutral"
          />
          <StatCard
            label="Active Alerts"
            value={activeAlerts}
            icon={<AlertCircle size={24} />}
            color={activeAlerts > 0 ? 'red' : 'green'}
            trend={activeAlerts > 0 ? 'up' : 'down'}
            trendValue={activeAlerts > 0 ? '⚠️ Attention needed' : '✓ All clear'}
          />
          <StatCard
            label="Family Members"
            value={familyMembers.length}
            icon={<Users size={24} />}
            color="blue"
            trend="neutral"
            trendValue={`${familyMembers.filter((f: any) => f.role === 'caregiver').length} caregivers`}
          />
          {/* Hydration Stat */}
          <div 
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 cursor-pointer hover:shadow-card transition-all duration-300"
            onClick={() => setShowHydrationModal(true)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Droplets size={20} className="text-white" />
              </div>
              <span className="text-xs text-blue-600 font-medium">{hydrationPercent}%</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{todayHydration}ml</p>
            <p className="text-sm text-blue-600">of {hydrationGoal}ml goal</p>
            <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min(100, hydrationPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Health Metrics */}
            <Card title="Recent Health Metrics" variant="primary" subtitle="Your latest health readings">
              {metrics.length > 0 ? (
                <div className="space-y-3">
                  {metrics.slice(0, 5).map((metric: any) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl hover:shadow-card transition-all duration-300 border border-neutral-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900 capitalize">
                          {metric.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(metric.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {metric.value} {metric.unit}
                        </p>
                        <Badge
                          status={metric.status === 'normal' ? 'success' : metric.status === 'warning' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity size={40} className="mx-auto text-neutral-400 mb-3" />
                  <p className="text-neutral-600 font-medium">No health metrics yet</p>
                  <p className="text-sm text-neutral-500 mt-1">Start logging your health data</p>
                </div>
              )}
            </Card>

            {/* Upcoming Medications */}
            <Card title="Upcoming Medications" variant="success" subtitle="Next 5 medication reminders">
              {reminders.filter((r: any) => !r.taken).length > 0 ? (
                <div className="space-y-3">
                  {reminders
                    .filter((r: any) => !r.taken)
                    .slice(0, 5)
                    .map((reminder: any) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl hover:shadow-card transition-all duration-300"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-900">{reminder.medicationName}</p>
                          <p className="text-sm text-neutral-600 mt-1">
                            💊 Dosage: {reminder.dosage}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">
                                {new Date(reminder.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">Today</p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                              Mark Taken
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Pill size={40} className="mx-auto text-neutral-400 mb-3" />
                  <p className="text-neutral-600 font-medium">No upcoming medications</p>
                  <p className="text-sm text-neutral-500 mt-1">You're all caught up! 🎉</p>
                </div>
              )}
            </Card>

            {/* Health & Medication Reminders */}
            <Card title="Daily Reminders" variant="secondary" subtitle="Your scheduled health reminders">
              {todayReminders.length > 0 ? (
                <div className="space-y-3">
                  {todayReminders.slice(0, 6).map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200 rounded-xl hover:shadow-card transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          reminder.type === 'medication' ? 'bg-orange-100' :
                          reminder.type === 'hydration' ? 'bg-blue-100' :
                          reminder.type === 'exercise' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          {reminder.type === 'medication' ? <Pill size={18} className="text-orange-600" /> :
                           reminder.type === 'hydration' ? <Droplets size={18} className="text-blue-600" /> :
                           reminder.type === 'exercise' ? <Activity size={18} className="text-green-600" /> :
                           <Clock size={18} className="text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{reminder.title}</p>
                          <p className="text-xs text-neutral-500">{reminder.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-secondary-200 text-secondary-700 rounded-full text-sm font-medium">
                          {reminder.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock size={40} className="mx-auto text-neutral-400 mb-3" />
                  <p className="text-neutral-600 font-medium">No reminders set</p>
                  <p className="text-sm text-neutral-500 mt-1">Add health reminders to stay on track</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <Card title="Active Alerts" variant={activeAlerts > 0 ? 'warning' : 'success'}>
              {activeAlerts > 0 ? (
                <div className="space-y-3">
                  {alerts
                    .filter((a: any) => a.status === 'pending')
                    .slice(0, 3)
                    .map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                          alert.severity === 'critical'
                            ? 'bg-red-50 border-l-red-600 hover:shadow-lg'
                            : alert.severity === 'high'
                            ? 'bg-orange-50 border-l-orange-600 hover:shadow-lg'
                            : 'bg-yellow-50 border-l-yellow-600 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle size={18} className={
                            alert.severity === 'critical'
                              ? 'text-red-600'
                              : alert.severity === 'high'
                              ? 'text-orange-600'
                              : 'text-yellow-600'
                          } />
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900 capitalize">
                              {alert.type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">{alert.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity size={32} className="text-success-600" />
                  </div>
                  <p className="text-success-700 font-semibold text-lg">All is well! 🎉</p>
                  <p className="text-sm text-neutral-600 mt-2">No active alerts</p>
                </div>
              )}
            </Card>

            {/* Quick Hydration Add */}
            <Card title="Quick Hydration" variant="primary">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                      <Droplets size={40} className="text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                      <button 
                        onClick={() => setShowHydrationModal(true)}
                        className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-neutral-900">{todayHydration}ml</p>
                  <p className="text-sm text-neutral-500">of {hydrationGoal}ml daily goal</p>
                </div>
                
                {/* Quick add buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[100, 200, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => addHydrationEntry(amount)}
                      className="p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                    >
                      +{amount}ml
                    </button>
                  ))}
                </div>
                
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, hydrationPercent)}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" variant="secondary">
              <div className="space-y-2">
                <a
                  href="/health"
                  className="flex items-center justify-between px-4 py-3 text-neutral-700 hover:bg-secondary-50 rounded-xl transition-all duration-200 group"
                >
                  <span className="font-semibold">+ Log Health Metric</span>
                  <ChevronRight size={18} className="text-neutral-400 group-hover:text-secondary-600 transition-colors" />
                </a>
                <a
                  href="/medications"
                  className="flex items-center justify-between px-4 py-3 text-neutral-700 hover:bg-secondary-50 rounded-xl transition-all duration-200 group"
                >
                  <span className="font-semibold">+ Add Medication</span>
                  <ChevronRight size={18} className="text-neutral-400 group-hover:text-secondary-600 transition-colors" />
                </a>
                <a
                  href="/contacts"
                  className="flex items-center justify-between px-4 py-3 text-neutral-700 hover:bg-secondary-50 rounded-xl transition-all duration-200 group"
                >
                  <span className="font-semibold">+ Add Family Member</span>
                  <ChevronRight size={18} className="text-neutral-400 group-hover:text-secondary-600 transition-colors" />
                </a>
              </div>
            </Card>

            {/* Voice Commands Help */}
            {isVoiceSupported && (
              <Card title="Voice Commands" variant="primary">
                <div className="space-y-2 text-sm">
                  <p className="text-neutral-600 mb-3">Try saying:</p>
                  <div className="space-y-1">
                    <p className="text-neutral-700">• "Add water" - Log water intake</p>
                    <p className="text-neutral-700">• "Add medication" - Go to medications</p>
                    <p className="text-neutral-700">• "Log health" - Log health metric</p>
                    <p className="text-neutral-700">• "Show dashboard" - Go to dashboard</p>
                    <p className="text-neutral-700">• "Call emergency" - Emergency alert</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hydration Modal */}
      {showHydrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neutral-900">Add Water Intake</h3>
              <button 
                onClick={() => setShowHydrationModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Droplets size={36} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">{hydrationAmount}ml</p>
              </div>
              
              <div className="flex gap-2 justify-center">
                {[100, 200, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setHydrationAmount(amount)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      hydrationAmount === amount
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {amount}ml
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleAddHydration}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Add Water
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
