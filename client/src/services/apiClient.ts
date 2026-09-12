import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, SystemHealth, Skill } from '../types';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response Interceptor for unified unwrapping and error capturing
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    const errorData = error.response?.data?.error;
    const message = errorData?.message || error.message || 'Network communication failure';
    console.error(`[API Error ${error.response?.status || 'UNKNOWN'}]:`, message, errorData?.details);
    return Promise.reject({
      status: error.response?.status,
      code: errorData?.code || 'NETWORK_ERROR',
      message,
      details: errorData?.details,
    });
  }
);

export const HealthService = {
  getHealth: async (): Promise<SystemHealth> => {
    const res = await api.get<ApiResponse<SystemHealth>>('/health');
    return res.data.data;
  },
};

export const SkillsService = {
  getAll: async (params?: { category?: string; level?: string; search?: string }): Promise<Skill[]> => {
    const res = await api.get<ApiResponse<Skill[]>>('/skills', { params });
    return res.data.data;
  },

  create: async (payload: Partial<Skill>): Promise<Skill> => {
    const res = await api.post<ApiResponse<Skill>>('/skills', payload);
    return res.data.data;
  },
};
