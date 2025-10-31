import axios, { type AxiosError, type AxiosRequestHeaders } from 'axios';

// Read base URL from envs (support both). In the browser we prefer
// same-origin requests ('') so Next.js rewrites can proxy to the API.
const apiBaseEnv =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '';
const isBrowser = typeof window !== 'undefined';
const baseURL = isBrowser ? '' : apiBaseEnv;

const api = axios.create({ baseURL });

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = (config.headers ?? {}) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const status = err?.response?.status;
    if (typeof window !== 'undefined' && status === 401) {
      try {
        localStorage.removeItem('token');
      } catch {}
      // Hard redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
