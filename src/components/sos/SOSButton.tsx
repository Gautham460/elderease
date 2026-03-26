import React, { useState } from 'react';
import { AlertTriangle, Phone, X, Heart } from 'lucide-react';
import { useServiceStore } from '../../store/serviceStore';
import { useContactStore } from '../../store/contactStore';
import { useAuthStore } from '../../store/authStore';

export const SOSButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locating, setLocating] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [alertActive, setAlertActive] = useState(false);

  const { triggerSOS, medicalInfo } = useServiceStore();
  const { emergencyContacts } = useContactStore();
  const { user } = useAuthStore();

  const startCountdown = (type: 'manual' | 'fall' | 'heart_rate' | 'blood_pressure') => {
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          fireAlert(type);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  const fireAlert = (type: 'manual' | 'fall' | 'heart_rate' | 'blood_pressure') => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        triggerSOS(type, {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: `GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        });
        setLocating(false);
        setAlertActive(true);
        setIsExpanded(false);
      },
      () => {
        triggerSOS(type);
        setLocating(false);
        setAlertActive(true);
        setIsExpanded(false);
      },
      { timeout: 5000 }
    );
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setAlertActive(false);
  };

  if (user?.role === 'caregiver') return null;

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded ? (
          <div className="bg-neutral-900 rounded-2xl p-5 shadow-2xl border border-neutral-700 w-72">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold text-lg">🚨 Emergency Help</span>
              <button onClick={() => setIsExpanded(false)} className="p-1 text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Countdown bar */}
            {countdown !== null && (
              <div className="mb-4 p-3 bg-red-900/70 border border-red-500 rounded-xl text-center">
                <p className="text-red-300 text-sm font-semibold mb-1">Sending alert in {countdown}s...</p>
                <button
                  onClick={cancelCountdown}
                  className="text-xs px-3 py-1 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => startCountdown('manual')}
                disabled={locating || countdown !== null}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <Phone size={20} />
                <span className="font-semibold">Call Emergency (911)</span>
              </button>

              <button
                onClick={() => startCountdown('fall')}
                disabled={locating || countdown !== null}
                className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <AlertTriangle size={20} />
                <span>I Fell Down</span>
              </button>

              <button
                onClick={() => startCountdown('heart_rate')}
                disabled={locating || countdown !== null}
                className="w-full flex items-center gap-3 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <Heart size={20} />
                <span>Heart Rate Alert</span>
              </button>

              <button
                onClick={() => startCountdown('blood_pressure')}
                disabled={locating || countdown !== null}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <AlertTriangle size={20} />
                <span>Blood Pressure Alert</span>
              </button>
            </div>

            {/* Emergency contacts click-to-call */}
            {emergencyContacts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-700 space-y-2">
                <p className="text-xs text-neutral-400 font-semibold mb-1">Emergency Contacts</p>
                {emergencyContacts.slice(0, 3).map((contact: any) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-between px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-white">{contact.name}</span>
                    <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                      <Phone size={12} /> {contact.phone}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Medical Info Preview */}
            {medicalInfo && (
              <div className="mt-3 pt-3 border-t border-neutral-700 text-xs space-y-1">
                <p className="text-neutral-400 font-semibold">Your Medical Info (sent to responders):</p>
                <p className="text-neutral-300">🩸 Blood Type: {medicalInfo.bloodType}</p>
                <p className="text-neutral-300">⚠️ Allergies: {medicalInfo.allergies.length > 0 ? medicalInfo.allergies.join(', ') : 'None'}</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleExpand}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-500/50 transition-all animate-pulse"
          >
            <span className="text-white font-bold text-xl">SOS</span>
          </button>
        )}
      </div>

      {/* Active Alert Overlay */}
      {alertActive && (
        <div className="fixed inset-0 bg-red-900/60 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-neutral-900 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border-2 border-red-500 text-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertTriangle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">🚨 Emergency Alert Sent!</h2>
            <p className="text-neutral-400 text-sm mb-4">
              Your location and medical info have been logged. Call emergency services below:
            </p>

            <a
              href="tel:911"
              className="flex items-center justify-center gap-3 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl mb-3 text-lg transition-colors"
            >
              <Phone size={22} /> Call 911 Now
            </a>

            {emergencyContacts.slice(0, 2).map((contact: any) => (
              <a
                key={contact.id}
                href={`tel:${contact.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl mb-2 transition-colors"
              >
                <Phone size={16} /> Call {contact.name} ({contact.phone})
              </a>
            ))}

            {medicalInfo && (
              <div className="mt-4 p-3 bg-neutral-800 rounded-xl text-left text-sm space-y-1">
                <p className="text-neutral-300"><strong>Blood Type:</strong> {medicalInfo.bloodType}</p>
                <p className="text-neutral-300"><strong>Allergies:</strong> {medicalInfo.allergies.join(', ') || 'None'}</p>
                <p className="text-neutral-300"><strong>Conditions:</strong> {medicalInfo.medicalConditions.join(', ') || 'None'}</p>
              </div>
            )}

            <button
              onClick={() => setAlertActive(false)}
              className="mt-4 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};
