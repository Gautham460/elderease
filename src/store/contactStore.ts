import { create } from 'zustand';
import type { FamilyMember, EmergencyContact } from '../types';

interface ContactStore {
  familyMembers: FamilyMember[];
  emergencyContacts: EmergencyContact[];
  
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => void;
}

export const useContactStore = create<ContactStore>((set) => {
  const savedFamily = localStorage.getItem('eldereaseFamily');
  const savedEmergency = localStorage.getItem('eldereaseEmergencyContacts');

  return {
    familyMembers: savedFamily ? JSON.parse(savedFamily) : [],
    emergencyContacts: savedEmergency ? JSON.parse(savedEmergency) : [],

    addFamilyMember: (member: FamilyMember) => {
      set((state) => {
        const newMembers = [...state.familyMembers, member];
        localStorage.setItem('eldereaseFamily', JSON.stringify(newMembers));
        return { familyMembers: newMembers };
      });
    },

    removeFamilyMember: (id: string) => {
      set((state) => {
        const newMembers = state.familyMembers.filter((m) => m.id !== id);
        localStorage.setItem('eldereaseFamily', JSON.stringify(newMembers));
        return { familyMembers: newMembers };
      });
    },

    updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => {
      set((state) => {
        const newMembers = state.familyMembers.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        localStorage.setItem('eldereaseFamily', JSON.stringify(newMembers));
        return { familyMembers: newMembers };
      });
    },

    addEmergencyContact: (contact: EmergencyContact) => {
      set((state) => {
        const newContacts = [...state.emergencyContacts, contact];
        localStorage.setItem('eldereaseEmergencyContacts', JSON.stringify(newContacts));
        return { emergencyContacts: newContacts };
      });
    },

    removeEmergencyContact: (id: string) => {
      set((state) => {
        const newContacts = state.emergencyContacts.filter((c) => c.id !== id);
        localStorage.setItem('eldereaseEmergencyContacts', JSON.stringify(newContacts));
        return { emergencyContacts: newContacts };
      });
    },

    updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => {
      set((state) => {
        const newContacts = state.emergencyContacts.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        localStorage.setItem('eldereaseEmergencyContacts', JSON.stringify(newContacts));
        return { emergencyContacts: newContacts };
      });
    },
  };
});
