import axios from "axios";
import config from "../config/config.js";

const apiBaseUrls = config.API_BASE_URLS || [config.API_BASE_URL].filter(Boolean);

const axiosInstance = axios.create({
  baseURL: apiBaseUrls[0],
  timeout: config.REQUEST_TIMEOUT,
});

// Auto-add token to every request
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    requestConfig.headers = requestConfig.headers || {};

    // Let the browser set multipart boundaries automatically for FormData.
    if (requestConfig.data instanceof FormData) {
      if (requestConfig.headers) {
        delete requestConfig.headers['Content-Type'];
        delete requestConfig.headers['content-type'];
      }
    } else if (requestConfig.headers && !requestConfig.headers['Content-Type']) {
      requestConfig.headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem("token");
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.baseURL + requestConfig.url,
        headers: requestConfig.headers,
        data: requestConfig.data,
      });
    }
    
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and other errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('API Response Success:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
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

    const requestConfig = error.config || {};
    const retryableNetworkError =
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK' ||
      (!error.response && error.request) ||
      error.response?.status >= 500;

    if (!requestConfig.__triedApiFallback && retryableNetworkError && apiBaseUrls.length > 1) {
      requestConfig.__triedApiFallback = true;

      for (const fallbackBaseUrl of apiBaseUrls.slice(1)) {
        try {
          const retryConfig = {
            ...requestConfig,
            baseURL: fallbackBaseUrl,
          };

          if (import.meta.env.DEV) {
            console.warn('Retrying API request with fallback base URL:', fallbackBaseUrl);
          }

          return await axiosInstance.request(retryConfig);
        } catch (fallbackError) {
          if (fallbackError?.response || (fallbackError?.code !== 'ECONNREFUSED' && fallbackError?.code !== 'ERR_NETWORK')) {
            throw fallbackError;
          }
        }
      }
    }

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
