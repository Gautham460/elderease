import React, { useState } from 'react';
import { Plus, Phone, Mail, Trash2, Users, Stethoscope, Heart } from 'lucide-react';
import { Card, Badge } from '../components/common/Card';
import { useContactStore } from '../store/contactStore';
import { MainLayout } from '../components/layout/MainLayout';
import type { FamilyMember } from '../types';

export const ContactsPage: React.FC = () => {
  const { familyMembers, addFamilyMember, removeFamilyMember } = useContactStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    role: 'caregiver' as 'caregiver' | 'family',
    permission: 'view_only' as 'full' | 'view_only' | 'alerts_only',
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      relationship: formData.relationship,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      permission: formData.permission,
      added: new Date(),
    };

    addFamilyMember(newMember);
    setFormData({
      name: '',
      relationship: '',
      email: '',
      phone: '',
      role: 'caregiver',
      permission: 'view_only',
    });
    setShowForm(false);
  };

  const caregivers: FamilyMember[] = familyMembers.filter((m: FamilyMember) => m.role === 'caregiver');
  const family: FamilyMember[] = familyMembers.filter((m: FamilyMember) => m.role === 'family');

  const getPermissionBadgeStatus = (permission: string) => {
    if (permission === 'full') return 'danger';
    if (permission === 'view_only') return 'info';
    if (permission === 'alerts_only') return 'warning';
    return 'info';
  };

  const getPermissionLabel = (permission: string) => {
    if (permission === 'full') return '🔓 Full Access';
    if (permission === 'view_only') return '👁️ View Only';
    if (permission === 'alerts_only') return '⚠️ Alerts Only';
    return permission.replace('_', ' ');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              Family & Contacts
            </h1>
            <p className="text-neutral-600 text-lg">
              👥 Manage your family members and emergency contacts
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Add Member Form */}
        {showForm && (
          <Card title="Add Family Member or Caregiver" variant="primary">
            <form onSubmit={handleAddMember} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Name <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({ ...formData, relationship: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., Son, Daughter, Nurse"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email <span className="text-accent-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="+1-234-567-8900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'caregiver' | 'family',
                      })
                    }
                    className="input-field"
                  >
                    <option value="caregiver">🩺 Caregiver</option>
                    <option value="family">👨‍👩‍👧 Family Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Permission Level
                  </label>
                  <select
                    value={formData.permission}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        permission: e.target.value as
                          | 'full'
                          | 'view_only'
                          | 'alerts_only',
                      })
                    }
                    className="input-field"
                  >
                    <option value="full">🔓 Full Access</option>
                    <option value="view_only">👁️ View Only</option>
                    <option value="alerts_only">⚠️ Alerts Only</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary-lg flex-1">
                  Add Member
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

        {/* Caregivers Section */}
        {caregivers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                  <Stethoscope className="text-accent-600" size={28} />
                  Caregivers
                </h2>
                <p className="text-neutral-600 text-sm mt-1">{caregivers.length} caregiver{caregivers.length !== 1 ? 's' : ''} assigned</p>
              </div>
              <Badge status="danger" size="lg">{caregivers.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {caregivers.map((member: FamilyMember) => (
                <Card key={member.id} className="bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:shadow-card transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-white/60 rounded-lg">
                        <Stethoscope className="text-accent-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1">
                          {member.relationship || 'Caregiver'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="flex-shrink-0 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 p-2.5 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
                    >
                      <Mail size={16} className="text-primary-600 group-hover:text-primary-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500">Email</p>
                        <p className="text-sm text-neutral-800 truncate group-hover:text-primary-700 font-medium">{member.email}</p>
                      </div>
                    </a>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-3 p-2.5 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
                      >
                        <Phone size={16} className="text-success-600 group-hover:text-success-700" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500">Phone</p>
                          <p className="text-sm text-neutral-800 truncate group-hover:text-success-700 font-medium">{member.phone}</p>
                        </div>
                      </a>
                    )}
                  </div>

                  <div className="pt-3 border-t border-accent-200">
                    <Badge status={getPermissionBadgeStatus(member.permission)} size="sm">
                      {getPermissionLabel(member.permission)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Family Members Section */}
        {family.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                  <Heart className="text-secondary-600" size={28} />
                  Family Members
                </h2>
                <p className="text-neutral-600 text-sm mt-1">{family.length} family member{family.length !== 1 ? 's' : ''} added</p>
              </div>
              <Badge status="secondary" size="lg">{family.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {family.map((member: FamilyMember) => (
                <Card key={member.id} className="bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 hover:shadow-card transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-white/60 rounded-lg">
                        <Heart className="text-secondary-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1">
                          {member.relationship || 'Family Member'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="flex-shrink-0 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 p-2.5 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
                    >
                      <Mail size={16} className="text-primary-600 group-hover:text-primary-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500">Email</p>
                        <p className="text-sm text-neutral-800 truncate group-hover:text-primary-700 font-medium">{member.email}</p>
                      </div>
                    </a>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-3 p-2.5 bg-white/40 rounded-lg hover:bg-white/60 transition-colors group"
                      >
                        <Phone size={16} className="text-success-600 group-hover:text-success-700" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500">Phone</p>
                          <p className="text-sm text-neutral-800 truncate group-hover:text-success-700 font-medium">{member.phone}</p>
                        </div>
                      </a>
                    )}
                  </div>

                  <div className="pt-3 border-t border-secondary-200">
                    <Badge status={getPermissionBadgeStatus(member.permission)} size="sm">
                      {getPermissionLabel(member.permission)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {familyMembers.length === 0 && (
          <Card className="text-center bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200">
            <div className="py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-neutral-500" />
              </div>
              <p className="text-neutral-800 font-semibold text-lg mb-2">No family members added yet</p>
              <p className="text-neutral-600 text-sm mb-6 max-w-sm mx-auto">
                Click the "Add Member" button above to invite a caregiver or family member to ElderEase
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary-lg mx-auto"
              >
                <Plus size={18} className="inline mr-2" />
                Add Your First Contact
              </button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
