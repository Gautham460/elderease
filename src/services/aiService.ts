import api from './api';

export const aiService = {
  analyzeHealth: async (metrics: any, user: any) => {
    const response = await api.post('/ai/analyze', { metrics, user });
    return response.data;
  },
  getMedicationAdvice: async (medications: any, query: string) => {
    const response = await api.post('/ai/medication-assistant', { medications, query });
    return response.data;
  }
};
