import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, SystemHealth, Skill } from '../types';

// Compute base API URL:
// If VITE_API_URL is configured (e.g., https://skill-me-2.onrender.com), use it with /api/v1 path.
// Otherwise, fallback to '/api/v1' to leverage Vite proxy (http://localhost:8000) during local development.
export const getBaseApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
  }
  return '/api/v1';
};

export const api = axios.create({
  baseURL: getBaseApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response Interceptor for unified unwrapping and error capturing
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<any>) => {
    let message = 'Network communication failure';
    let details = undefined;

    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data.trim();
      } else if (error.response.data.error) {
        message = error.response.data.error.message || message;
        details = error.response.data.error.details;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Friendly message if a static host returns 404 instead of reaching backend
    if (error.response?.status === 404 && message.toLowerCase().includes('not be found')) {
      message = 'Backend API is currently offline or warming up. Please try again shortly.';
    }

    console.error(`[API Error ${error.response?.status || 'UNKNOWN'}]:`, message, details);
    return Promise.reject({
      status: error.response?.status,
      code: error.response?.data?.error?.code || (error.response?.status === 404 ? 'NOT_FOUND' : 'NETWORK_ERROR'),
      message,
      details,
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
