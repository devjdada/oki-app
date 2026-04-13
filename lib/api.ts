import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth';

// Use 10.0.2.2 for Android emulator to reach localhost on host machine
// Use localhost for iOS simulator
const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000/api/v1' 
  : Platform.OS === 'web'
    ? 'http://localhost:8000/api/v1'
    : 'http://192.168.0.160:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add auth token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching token from state', error);
  }

  return config;
});

// Interceptor to handle common errors (like 401 Unauthenticated)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear store on authentication error
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
