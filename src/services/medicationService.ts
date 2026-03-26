import api from './api';

export const medicationService = {
  getMedications: async (userId: string) => {
    const response = await api.get(`/medications/${userId}`);
    return response.data;
  },
  addMedication: async (medicationData: any) => {
    const response = await api.post('/medications', medicationData);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/medications/${id}`, { status });
    return response.data;
  }
};
