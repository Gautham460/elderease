import api from './api';
import type { Appointment, MedicineOrder, ServiceRequest } from '../types';

export const healthcareService = {
  getAppointments: async (userId: string) => {
    const response = await api.get(`/healthcare/appointments/${userId}`);
    return response.data;
  },
  addAppointment: async (appointment: Omit<Appointment, 'id'> & { userId: string }) => {
    const response = await api.post('/healthcare/appointments', appointment);
    return response.data;
  },
  updateAppointment: async (id: string, status: string) => {
    const response = await api.patch(`/healthcare/appointments/${id}`, { status });
    return response.data;
  },
  getOrders: async (userId: string) => {
    const response = await api.get(`/healthcare/orders/${userId}`);
    return response.data;
  },
  addOrder: async (order: Omit<MedicineOrder, 'id'> & { userId: string }) => {
    const response = await api.post('/healthcare/orders', order);
    return response.data;
  },
  updateOrder: async (id: string, status: string) => {
    const response = await api.patch(`/healthcare/orders/${id}`, { status });
    return response.data;
  },
  getServiceRequests: async (userId: string) => {
    const response = await api.get(`/healthcare/service-requests/${userId}`);
    return response.data;
  },
  addServiceRequest: async (request: Omit<ServiceRequest, 'id'> & { userId: string }) => {
    const response = await api.post('/healthcare/service-requests', request);
    return response.data;
  },
  updateServiceRequest: async (id: string, status: string) => {
    const response = await api.patch(`/healthcare/service-requests/${id}`, { status });
    return response.data;
  }
};
