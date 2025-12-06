import axios from "axios";
import config from "../config/config.js";

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details in development
    if (process.env.NODE_ENV === "development") {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and other errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log('API Response Success:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      headers: error.config?.headers,
      code: error.code,
    });

    // Handle specific error types
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error(' Network Error: Cannot connect to backend server');
      console.error(' Check if backend is running on:', error.config?.baseURL);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        console.log(' Authentication failed, redirecting to login...');
        window.location.href = "/login";
      }
    }
    
    // Handle CORS errors
    if (!error.response && error.request) {
      console.error(' Possible CORS issue or network error');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
