import api from './api';

export const userDataService = {
  getUserData: async (userId: string) => {
    const response = await api.get(`/user-data/${userId}`);
    return response.data;
  },
  
  updateUserData: async (userId: string, data: any) => {
    const response = await api.patch(`/user-data/${userId}`, data);
    return response.data;
  }
};
