// Environment configuration
export const config = {
  // Backend API URLs
  API_BASE_URL: process.env.NODE_ENV === "production"
    ? "https://hamrorental-backend.onrender.com"
    : "http://127.0.0.1:8000", 
    // Use local mock server for development
  
  // Frontend URLs
  FRONTEND_URL: process.env.NODE_ENV === "production"
    ? "https://your-frontend-domain.com"
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
  isDevelopment: () => process.env.NODE_ENV === "development",
  isProduction: () => process.env.NODE_ENV === "production",
};

export default config;
