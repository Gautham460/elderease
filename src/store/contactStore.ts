import { create } from 'zustand';
import type { FamilyMember, EmergencyContact } from '../types';
import { userDataService } from '../services/userDataService';

interface ContactStore {
  familyMembers: FamilyMember[];
  emergencyContacts: EmergencyContact[];
  
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  
  addEmergencyContact: (contact: EmergencyContact) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => Promise<void>;
  fetchContactData: (userId: string) => Promise<void>;
}

export const useContactStore = create<ContactStore>((set, get) => {
  return {
    familyMembers: [],
    emergencyContacts: [],

    fetchContactData: async (userId: string) => {
      try {
        const data = await userDataService.getUserData(userId);
        if (data) {
          set({
            familyMembers: data.familyMembers || [],
            emergencyContacts: data.emergencyContacts || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      }
    },

    addFamilyMember: async (member: FamilyMember) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMembers = [...get().familyMembers, member];
        set({ familyMembers: newMembers });
        if (userId) await userDataService.updateUserData(userId, { familyMembers: newMembers });
      } catch (error) {
        console.error('Failed to add family member', error);
      }
    },

    removeFamilyMember: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMembers = get().familyMembers.filter((m) => m.id !== id);
        set({ familyMembers: newMembers });
        if (userId) await userDataService.updateUserData(userId, { familyMembers: newMembers });
      } catch (error) {
        console.error('Failed to remove family member', error);
      }
    },

    updateFamilyMember: async (id: string, updates: Partial<FamilyMember>) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newMembers = get().familyMembers.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        set({ familyMembers: newMembers });
        if (userId) await userDataService.updateUserData(userId, { familyMembers: newMembers });
      } catch (error) {
        console.error('Failed to update family member', error);
      }
    },

    addEmergencyContact: async (contact: EmergencyContact) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newContacts = [...get().emergencyContacts, contact];
        set({ emergencyContacts: newContacts });
        if (userId) await userDataService.updateUserData(userId, { emergencyContacts: newContacts });
      } catch (error) {
        console.error('Failed to add emergency contact', error);
      }
    },

    removeEmergencyContact: async (id: string) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newContacts = get().emergencyContacts.filter((c) => c.id !== id);
        set({ emergencyContacts: newContacts });
        if (userId) await userDataService.updateUserData(userId, { emergencyContacts: newContacts });
      } catch (error) {
        console.error('Failed to remove emergency contact', error);
      }
    },

    updateEmergencyContact: async (id: string, updates: Partial<EmergencyContact>) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newContacts = get().emergencyContacts.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        set({ emergencyContacts: newContacts });
        if (userId) await userDataService.updateUserData(userId, { emergencyContacts: newContacts });
      } catch (error) {
        console.error('Failed to update emergency contact', error);
      }
    },
  };
});
