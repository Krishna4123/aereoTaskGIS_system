import axios, { AxiosInstance, AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Standardized logging and error forwarding
    console.warn(`[API] Error on ${error.config?.url || 'request'}:`, error.message);
    return Promise.reject(error);
  }
);

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${baseURL}/api/health`, { timeout: 2000 });
    return res.status === 200;
  } catch {
    return false;
  }
}
