import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Debug request/response
const debugRequest = (config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 [API] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });
  }
  return config;
};

const debugResponse = (response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ [API] Response:`, {
      status: response.status,
      data: response.data,
    });
  }
  return response;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    debugRequest(config);
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    debugResponse(response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Extract error details
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status;
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔥 [API] Error:', {
        message,
        status,
        error: error.response?.data || error,
      });
    }
    
    // Handle specific error cases
    switch (status) {
      case 401:
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later');
        break;
      default:
        if (!navigator.onLine) {
          toast.error('No internet connection. Please check your network.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timed out. Please try again.');
        } else {
          toast.error(message);
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;
