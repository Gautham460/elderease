import React, { useState, useEffect } from 'react';
import { MainLayout as Layout } from '../components/layout/MainLayout';
import { Shield, Check, X, Clock, User as UserIcon } from 'lucide-react';
import { AlertBox } from '../components/common/Card';

interface CaregiverRequest {
  _id: string;
  patientId: { name: string; email: string };
  caregiverId: { name: string; email: string; caregiverId: string };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<CaregiverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/admin/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch requests');
      
      const data = await response.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const token = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').token;
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req._id === id ? { ...req, status } : req
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Shield className="text-red-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-500">Manage caregiver authorizations and platform settings</p>
          </div>
        </div>

        {error && <AlertBox type="error" message={error} onClose={() => setError(null)} />}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Caregiver Requests</h2>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No requests found.</div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req._id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">Elder: {req.patientId?.name}</span>
                      <span className="text-sm text-gray-500">({req.patientId?.email})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} className="text-blue-400" />
                      <span className="font-medium text-gray-900">Requested Caregiver: {req.caregiverId?.name}</span>
                      <span className="text-sm text-gray-500">({req.caregiverId?.caregiverId})</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(req._id, 'approved')}
                          className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req._id, 'rejected')}
                          className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <X size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
