// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'elder' | 'caregiver' | 'admin';
  profileImage?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  emergencyContacts?: EmergencyContact[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Health types
export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_glucose' | 'weight';
  value: string;
  unit: string;
  timestamp: Date;
  notes?: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface HealthRecord {
  id: string;
  userId: string;
  date: Date;
  metrics: HealthMetric[];
  notes?: string;
}

// Medication types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'three_times' | 'four_times' | 'as_needed';
  time: string[];
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  sideEffects?: string[];
  notes?: string;
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: Date;
  dosage: string;
  taken: boolean;
  takenAt?: Date;
  notes?: string;
}

// Emergency Alert types
export interface EmergencyAlert {
  id: string;
  userId: string;
  type: 'fall' | 'health_issue' | 'security_concern' | 'manual_call';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'resolved';
  responder?: string;
  resolvedAt?: Date;
}

// Contact types
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
  role: 'caregiver' | 'family';
  permission: 'full' | 'view_only' | 'alerts_only';
  added: Date;
}

// Activity Log types
export interface ActivityLog {
  id: string;
  userId: string;
  type: 'medication' | 'health_check' | 'alert' | 'contact' | 'system';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Report types
export interface HealthReport {
  id: string;
  userId: string;
  period: 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  metrics: {
    bloodPressure: { avg: string; min: string; max: string };
    heartRate: { avg: number; min: number; max: number };
    temperature: { avg: number; min: number; max: number };
    weight: { current: number; change: number };
  };
  medicationAdherence: number;
  alerts: number;
  notes?: string;
  generatedAt: Date;
}

// Dashboard types
export interface DashboardStats {
  totalMetrics: number;
  upcomingMedications: number;
  activeAlerts: number;
  familyMembers: number;
  metricsThisWeek: HealthMetric[];
  upcomingReminders: MedicationReminder[];
  recentAlerts: EmergencyAlert[];
}

// Hydration types
export interface HydrationEntry {
  id: string;
  amount: number; // in ml
  timestamp: Date;
}

export interface HydrationGoal {
  daily: number; // in ml
}

export interface HydrationState {
  entries: HydrationEntry[];
  goal: HydrationGoal;
  addEntry: (entry: HydrationEntry) => void;
  getTodayTotal: () => number;
  getProgress: () => number;
}

// Reminder types
export interface HealthReminder {
  id: string;
  type: 'medication' | 'hydration' | 'exercise' | 'sleep' | 'meal';
  title: string;
  description: string;
  time: string; // HH:mm format
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
}

export interface ReminderSettings {
  reminders: HealthReminder[];
  addReminder: (reminder: HealthReminder) => void;
  updateReminder: (id: string, updates: Partial<HealthReminder>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
}

// Voice Command types
export interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  description: string;
}

export interface VoiceState {
  isListening: boolean;
  transcript: string;
  lastCommand: VoiceCommand | null;
  isSupported: boolean;
  error: string | null;
}

// Healthcare Service types
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number; // in km
  rating: number;
  specialties: string[];
  isOpen: boolean;
  emergencyAvailable: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  hospitalName: string;
  specialty: string;
  availability: DayAvailability[];
  rating: number;
  experience: number; // years
  consultationFee: number;
}

export interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  specialty: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  deliveryAvailable: boolean;
}

export interface MedicineOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  medicines: OrderedMedicine[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderedAt: Date;
  estimatedDelivery?: Date;
}

export interface OrderedMedicine {
  name: string;
  quantity: number;
  price: number;
}

// Home Assistance types
export interface HomeHelper {
  id: string;
  name: string;
  photo: string;
  services: HomeService[];
  rating: number;
  verified: boolean;
  experience: number;
  hourlyRate: number;
  availability: string;
  phone: string;
}

export interface HomeService {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: 'per_hour' | 'per_visit' | 'per_month';
}

export interface ServiceRequest {
  id: string;
  helperId: string;
  helperName: string;
  serviceId: string;
  serviceName: string;
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  totalAmount: number;
}

// Emergency SOS types
export interface SOSAlert {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'manual' | 'fall' | 'heart_rate' | 'blood_pressure' | 'custom';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  medicalInfo: MedicalInfo;
  status: 'sent' | 'acknowledged' | 'responded' | 'resolved';
  respondersNotified: string[];
}

export interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  emergencyNotes: string;
}
