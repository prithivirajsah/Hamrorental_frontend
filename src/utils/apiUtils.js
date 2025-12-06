import { toast } from 'react-toastify';

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = getErrorMessage(error);
  
  console.error('API Error:', {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message,
  });
  
  toast.error(message || defaultMessage);
  
  return message;
};

/**
 * Handle API success with toast notifications
 */
export const handleApiSuccess = (message = 'Operation successful', data = null) => {
  toast.success(message);
  
  if (data) {
    console.log('API Success:', data);
  }
  
  return data;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 422;
};

/**
 * Check if error is a server error
 */
export const isServerError = (error) => {
  return error.response?.status >= 500;
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (error) => {
  if (!isValidationError(error)) return null;
  
  const errors = error.response?.data?.detail;
  
  if (Array.isArray(errors)) {
    return errors.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
  }
  
  return getErrorMessage(error);
};

/**
 * Retry mechanism for API calls
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication or client errors
      if (isAuthError(error) || (error.response?.status >= 400 && error.response?.status < 500)) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (i === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError;
};

export default {
  getErrorMessage,
  handleApiError,
  handleApiSuccess,
  isNetworkError,
  isAuthError,
  isValidationError,
  isServerError,
  formatValidationErrors,
  retryApiCall,
};
