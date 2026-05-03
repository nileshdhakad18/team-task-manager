import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function normalizeServerPayload(data) {
  if (!data || typeof data !== 'object') return typeof data === 'string' ? data : null;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  if (Array.isArray(data.errors) && data.errors.length) return data.errors.map(String).join(', ');
  return null;
}

/** Use in catch blocks: user-friendly message (set by response interceptor when possible). */
export function getErrorMessage(error) {
  return error?.userMessage || normalizeServerPayload(error?.response?.data) || 'Something went wrong. Please try again.';
}

api.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      const err = new Error('MISSING_API_URL');
      err.userMessage =
        'The app is not configured with an API URL. Add VITE_API_URL to frontend/.env and restart the dev server.';
      return Promise.reject(err);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const serverMsg = normalizeServerPayload(error.response?.data);
    let message = serverMsg;

    if (!message) {
      if (error.code === 'ECONNABORTED') {
        message = 'Request timed out. Please try again.';
      } else if (error.message === 'Network Error' || error.response === undefined) {
        message = 'Unable to reach the server. Check your internet connection.';
      } else if (error.response?.status >= 500) {
        message = 'The server is temporarily unavailable. Please try again later.';
      } else if (error.response?.status === 401) {
        message = 'You need to sign in again.';
      } else if (error.response?.status === 403) {
        message = 'You do not have permission to do that.';
      } else if (error.response?.status === 404) {
        message = 'The requested resource was not found.';
      } else {
        message = 'Something went wrong. Please try again.';
      }
    }

    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default api;
