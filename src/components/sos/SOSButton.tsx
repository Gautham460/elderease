import React, { useState } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { useServiceStore } from '../../store/serviceStore';
import { useAuthStore } from '../../store/authStore';

export const SOSButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { triggerSOS, medicalInfo } = useServiceStore();
  useAuthStore();

  const handleSOSClick = (type: 'manual' | 'fall' | 'heart_rate' | 'blood_pressure') => {
    triggerSOS(type);
    setShowConfirm(false);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded ? (
          <div className="bg-neutral-800 rounded-2xl p-4 shadow-xl border border-neutral-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Emergency Options</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                <Phone size={20} />
                <span className="font-semibold">Call Emergency Services</span>
              </button>
              
              <button
                onClick={() => handleSOSClick('fall')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
              >
                <AlertTriangle size={20} />
                <span>Fall Detected</span>
              </button>
              
              <button
                onClick={() => handleSOSClick('heart_rate')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors"
              >
                <AlertTriangle size={20} />
                <span>Heart Rate Alert</span>
              </button>
              
              <button
                onClick={() => handleSOSClick('blood_pressure')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                <AlertTriangle size={20} />
                <span>Blood Pressure Alert</span>
              </button>
            </div>
            
            {/* Medical Info Preview */}
            {medicalInfo && (
              <div className="mt-3 pt-3 border-t border-neutral-700">
                <p className="text-xs text-neutral-400 mb-1">Medical Info Will Be Sent:</p>
                <p className="text-xs text-neutral-300">Blood Type: {medicalInfo.bloodType}</p>
                <p className="text-xs text-neutral-300">Allergies: {medicalInfo.allergies.length > 0 ? medicalInfo.allergies.join(', ') : 'None'}</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse"
          >
            <span className="text-white font-bold text-xl">SOS</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-neutral-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Call Emergency Services?</h3>
              <p className="text-neutral-400 mb-4">
                This will send your location and medical information to emergency services.
              </p>
              
              {medicalInfo && (
                <div className="bg-neutral-700 rounded-xl p-3 mb-4 text-left">
                  <p className="text-sm text-neutral-300"><strong>Blood Type:</strong> {medicalInfo.bloodType}</p>
                  <p className="text-sm text-neutral-300"><strong>Allergies:</strong> {medicalInfo.allergies.join(', ') || 'None'}</p>
                  <p className="text-sm text-neutral-300"><strong>Conditions:</strong> {medicalInfo.medicalConditions.join(', ') || 'None'}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 bg-neutral-700 text-white rounded-xl hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSOSClick('manual')}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold"
                >
                  Call 911
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
