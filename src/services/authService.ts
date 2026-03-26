import api from './api';

export const authService = {
  login: async (email: string, password: string, role?: string, caregiverId?: string) => {
    const response = await api.post('/auth/login', { email, password, role, caregiverId });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  googleLogin: async (googleData: { token: string; name: string; email: string; profileImage: string }) => {
    const response = await api.post('/auth/google', googleData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
