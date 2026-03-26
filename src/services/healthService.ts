import api from './api';

export const healthService = {
  getHealthRecords: async (userId: string) => {
    const response = await api.get(`/health/${userId}`);
    return response.data;
  },
  addHealthRecord: async (recordData: any) => {
    const response = await api.post('/health', recordData);
    return response.data;
  },
  getMetrics: async (userId: string) => {
    const response = await api.get(`/health/metrics/${userId}`);
    return response.data;
  },
  updateMetric: async (id: string, metricData: any) => {
    const response = await api.patch(`/health/metrics/${id}`, metricData);
    return response.data;
  }
};
