const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;
const apiBaseFromEnv = import.meta.env.VITE_API_BASE_URL;

// Environment configuration
export const config = {
  // Backend API URLs
  API_BASE_URL: apiBaseFromEnv || (isProd
    ? "https://hamrocarrental-backend.vercel.app"
    : "http://127.0.0.1:8001"),
  
  // Frontend URLs
  FRONTEND_URL: isProd
    ? "https://hamrorental-frontend.vercel.app"
    : "http://localhost:5173",
   
  // App settings
  APP_NAME: "Hamro Rental",
  VERSION: "1.0.0",
  
  // API endpoints
  ENDPOINTS: {
    // Auth
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    
    // User
    USER_PROFILE: "/users/me",
    
    // Vehicles
    VEHICLES: "/vehicles",
    
    // Wishlist
    WISHLIST: "/wishlist",
    
    // Bookings
    BOOKINGS: "/bookings",
    
    // Drivers
    DRIVERS: "/drivers",

    // Contact
    CONTACT: "/contact",
    
    // Health check
    HEALTH: "/health",
  },
  
  // Request timeouts (in milliseconds)
  REQUEST_TIMEOUT: 10000,
  
  // Token storage key
  TOKEN_KEY: "token",
  
  // Environment check
  isDevelopment: () => isDev,
  isProduction: () => isProd,
};

export default config;