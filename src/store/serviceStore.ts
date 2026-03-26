import { create } from 'zustand';
import type { Hospital, Doctor, Appointment, Pharmacy, MedicineOrder, HomeHelper, ServiceRequest, SOSAlert, MedicalInfo } from '../types';
import api from '../services/api';
import { healthcareService } from '../services/healthcareService';
import { userDataService } from '../services/userDataService';

// Mock data for hospitals
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    distance: 2.5,
    rating: 4.5,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    isOpen: true,
    emergencyAvailable: true,
  },
  {
    id: '2',
    name: 'Sunrise Medical Center',
    address: '456 Oak Avenue, Westside',
    phone: '+1 (555) 234-5678',
    distance: 4.2,
    rating: 4.8,
    specialties: ['Cardiology', 'Oncology', 'General Surgery'],
    isOpen: true,
    emergencyAvailable: true,
  },
  {
    id: '3',
    name: 'Community Health Clinic',
    address: '789 Elm Street, Northside',
    phone: '+1 (555) 345-6789',
    distance: 1.8,
    rating: 4.2,
    specialties: ['General Medicine', 'Dental', 'Eye Care'],
    isOpen: true,
    emergencyAvailable: false,
  },
];

// Mock data for doctors
const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    specialty: 'Cardiology',
    availability: [
      { day: 'Monday', slots: [{ time: '09:00', available: true }, { time: '10:00', available: true }, { time: '14:00', available: false }] },
      { day: 'Tuesday', slots: [{ time: '09:00', available: true }, { time: '11:00', available: true }] },
      { day: 'Wednesday', slots: [{ time: '10:00', available: true }, { time: '15:00', available: true }] },
      { day: 'Thursday', slots: [{ time: '09:00', available: false }, { time: '14:00', available: true }] },
      { day: 'Friday', slots: [{ time: '10:00', available: true }, { time: '16:00', available: true }] },
    ],
    rating: 4.8,
    experience: 15,
    consultationFee: 150,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    specialty: 'Neurology',
    availability: [
      { day: 'Monday', slots: [{ time: '11:00', available: true }, { time: '14:00', available: true }] },
      { day: 'Tuesday', slots: [{ time: '09:00', available: true }] },
      { day: 'Wednesday', slots: [{ time: '10:00', available: false }, { time: '15:00', available: true }] },
      { day: 'Thursday', slots: [{ time: '11:00', available: true }] },
      { day: 'Friday', slots: [{ time: '09:00', available: true }, { time: '14:00', available: true }] },
    ],
    rating: 4.9,
    experience: 20,
    consultationFee: 200,
  },
  {
    id: '3',
    name: 'Dr. Emily Williams',
    hospitalId: '2',
    hospitalName: 'Sunrise Medical Center',
    specialty: 'General Medicine',
    availability: [
      { day: 'Monday', slots: [{ time: '08:00', available: true }, { time: '12:00', available: true }] },
      { day: 'Tuesday', slots: [{ time: '08:00', available: true }, { time: '16:00', available: true }] },
      { day: 'Wednesday', slots: [{ time: '09:00', available: true }] },
      { day: 'Thursday', slots: [{ time: '08:00', available: true }, { time: '15:00', available: true }] },
      { day: 'Friday', slots: [{ time: '10:00', available: true }] },
    ],
    rating: 4.6,
    experience: 10,
    consultationFee: 100,
  },
];

// Mock data for pharmacies
const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'QuickCare Pharmacy',
    address: '321 Main Street, Downtown',
    phone: '+1 (555) 111-2222',
    distance: 1.2,
    rating: 4.5,
    isOpen: true,
    deliveryAvailable: true,
  },
  {
    id: '2',
    name: 'MedPlus Drugstore',
    address: '654 Oak Avenue, Westside',
    phone: '+1 (555) 333-4444',
    distance: 3.5,
    rating: 4.3,
    isOpen: true,
    deliveryAvailable: true,
  },
  {
    id: '3',
    name: 'HealthFirst Pharmacy',
    address: '987 Elm Street, Northside',
    phone: '+1 (555) 555-6666',
    distance: 2.0,
    rating: 4.7,
    isOpen: false,
    deliveryAvailable: true,
  },
];

// Mock data for home helpers
const MOCK_HOME_HELPERS: HomeHelper[] = [
  {
    id: '1',
    name: 'Robert Martinez',
    photo: '',
    services: [
      { id: '1', name: 'Cooking', description: 'Meal preparation according to dietary needs', price: 500, unit: 'per_visit' },
      { id: '2', name: 'CleaningGeneral home cleaning services', description: '', price: 300, unit: 'per_hour' },
    ],
    rating: 4.7,
    verified: true,
    experience: 5,
    hourlyRate: 300,
    availability: 'Mon-Sat',
    phone: '+1 (555) 777-8888',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    photo: '',
    services: [
      { id: '1', name: 'Cooking', description: 'Healthy meal preparation', price: 450, unit: 'per_visit' },
      { id: '3', name: 'Laundry', description: 'Washing, drying, and folding', price: 200, unit: 'per_visit' },
    ],
    rating: 4.9,
    verified: true,
    experience: 8,
    hourlyRate: 350,
    availability: 'Mon-Fri',
    phone: '+1 (555) 999-0000',
  },
  {
    id: '3',
    name: 'James Wilson',
    photo: '',
    services: [
      { id: '2', name: 'Cleaning', description: 'Deep cleaning services', price: 400, unit: 'per_hour' },
      { id: '4', name: 'General Maintenance', description: 'Minor repairs and maintenance', price: 500, unit: 'per_visit' },
    ],
    rating: 4.5,
    verified: true,
    experience: 3,
    hourlyRate: 250,
    availability: 'Mon-Sun',
    phone: '+1 (555) 121-3434',
  },
];

interface ServiceStore {
  // Healthcare
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  pharmacies: Pharmacy[];
  medicineOrders: MedicineOrder[];
  
  // Home Assistance
  homeHelpers: HomeHelper[];
  serviceRequests: ServiceRequest[];
  
  // Emergency SOS
  sosAlerts: SOSAlert[];
  medicalInfo: MedicalInfo | null;
  
  // Actions - Healthcare
  searchHospitals: (query: string) => Hospital[];
  searchDoctors: (specialty?: string) => Doctor[];
  bookAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  
  searchPharmacies: (query: string) => Pharmacy[];
  orderMedicine: (order: MedicineOrder) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  
  // Actions - Home Assistance
  searchHomeHelpers: (service?: string) => HomeHelper[];
  requestService: (request: ServiceRequest) => Promise<void>;
  cancelServiceRequest: (id: string) => Promise<void>;
  
  // Actions - Emergency SOS
  triggerSOS: (type: SOSAlert['type'], location?: SOSAlert['location']) => Promise<void>;
  updateMedicalInfo: (info: MedicalInfo) => void;

  // New Init Action
  fetchHealthcareData: (userId: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set, get) => {
  // Load local state strictly for unauthenticated fallback or SOS info
  const savedSOSAlerts = localStorage.getItem('eldereaseSOSAlerts');
  const savedMedicalInfo = localStorage.getItem('eldereaseMedicalInfo');

  return {
    hospitals: MOCK_HOSPITALS,
    doctors: MOCK_DOCTORS,
    appointments: [],
    pharmacies: MOCK_PHARMACIES,
    medicineOrders: [],
    homeHelpers: MOCK_HOME_HELPERS,
    serviceRequests: [],
    sosAlerts: savedSOSAlerts ? JSON.parse(savedSOSAlerts) : [],
    medicalInfo: savedMedicalInfo ? JSON.parse(savedMedicalInfo) : null,

    fetchHealthcareData: async (userId: string) => {
      try {
        const [appointments, orders, requests, userData] = await Promise.all([
          healthcareService.getAppointments(userId),
          healthcareService.getOrders(userId),
          healthcareService.getServiceRequests(userId),
          userDataService.getUserData(userId)
        ]);
        set({
          appointments: appointments || [],
          medicineOrders: orders || [],
          serviceRequests: requests || [],
          sosAlerts: userData?.sosAlerts || [],
          medicalInfo: userData?.medicalInfo || null,
        });
      } catch (error) {
        console.error("Failed to fetch healthcare data:", error);
      }
    },

    searchHospitals: (query: string) => {
      const { hospitals } = get();
      if (!query) return hospitals;
      return hospitals.filter(h => 
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    },

    searchDoctors: (specialty?: string) => {
      const { doctors } = get();
      if (!specialty) return doctors;
      return doctors.filter(d => 
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    },

    bookAppointment: async (appointment: Appointment) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newAppointment = await healthcareService.addAppointment({
          ...appointment,
          userId,
        });
        set((state) => ({ appointments: [...state.appointments, newAppointment] }));
      } catch (error) {
        console.error('Failed to book appointment', error);
      }
    },

    cancelAppointment: async (id: string) => {
      try {
        await healthcareService.updateAppointment(id, 'cancelled');
        set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, status: 'cancelled' as const } : a
          )
        }));
      } catch (error) {
        console.error('Failed to cancel appointment', error);
      }
    },

    searchPharmacies: (query: string) => {
      const { pharmacies } = get();
      if (!query) return pharmacies;
      return pharmacies.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    },

    orderMedicine: async (order: MedicineOrder) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newOrder = await healthcareService.addOrder({
          ...order,
          userId,
        });
        set((state) => ({ medicineOrders: [...state.medicineOrders, newOrder] }));
      } catch (error) {
        console.error('Failed to order medicine', error);
      }
    },

    cancelOrder: async (id: string) => {
      try {
        await healthcareService.updateOrder(id, 'cancelled');
        set((state) => ({
          medicineOrders: state.medicineOrders.map(o =>
            o.id === id ? { ...o, status: 'cancelled' as const } : o
          )
        }));
      } catch (error) {
        console.error('Failed to cancel order', error);
      }
    },

    searchHomeHelpers: (service?: string) => {
      const { homeHelpers } = get();
      if (!service) return homeHelpers;
      return homeHelpers.filter(h => 
        h.services.some(s => s.name.toLowerCase().includes(service.toLowerCase()))
      );
    },

    requestService: async (request: ServiceRequest) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        const newRequest = await healthcareService.addServiceRequest({
          ...request,
          userId,
        });
        set((state) => ({ serviceRequests: [...state.serviceRequests, newRequest] }));
      } catch (error) {
        console.error('Failed to request service', error);
      }
    },

    cancelServiceRequest: async (id: string) => {
      try {
        await healthcareService.updateServiceRequest(id, 'cancelled');
        set((state) => ({
          serviceRequests: state.serviceRequests.map(r =>
            r.id === id ? { ...r, status: 'cancelled' as const } : r
          )
        }));
      } catch (error) {
        console.error('Failed to cancel service request', error);
      }
    },

    triggerSOS: async (type: SOSAlert['type'], customLocation?: SOSAlert['location']) => {
      const { medicalInfo } = get();
      
      // Default / Fallback location
      const location = customLocation || {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main Street, Downtown',
      };

      const userStr = localStorage.getItem('eldereaseUser');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || 'current_user';
      
      const sosAlert: SOSAlert = {
        id: Date.now().toString(),
        userId,
        timestamp: new Date(),
        type,
        location,
        medicalInfo: medicalInfo || {
          bloodType: 'Unknown',
          allergies: [],
          medications: [],
          medicalConditions: [],
          emergencyNotes: '',
        },
        status: 'sent',
        respondersNotified: [],
      };
      
      try {
        const newAlerts = [sosAlert, ...get().sosAlerts];
        set({ sosAlerts: newAlerts });
        localStorage.setItem('eldereaseSOSAlerts', JSON.stringify(newAlerts));

        // 1. Sync to MongoDB
        if (userId !== 'current_user') {
          await userDataService.updateUserData(userId, { sosAlerts: newAlerts });
        }

        // 2. Trigger Auto-Email via Backend
        await api.post('/sos/email', {
          patientName: user?.name || 'Elderly Patient',
          patientEmail: user?.email,
          sosType: type,
          medicalInfo: sosAlert.medicalInfo,
          location: sosAlert.location
        });

      } catch (error) {
        console.error('Failed to process SOS alert', error);
      }
    },

    updateMedicalInfo: async (info: MedicalInfo) => {
      try {
        const userId = JSON.parse(localStorage.getItem('eldereaseUser') || '{}').id;
        set({ medicalInfo: info });
        localStorage.setItem('eldereaseMedicalInfo', JSON.stringify(info));

        if (userId) {
          await userDataService.updateUserData(userId, { medicalInfo: info });
        }
      } catch (error) {
        console.error('Failed to update medical info', error);
      }
    },
  };
});
