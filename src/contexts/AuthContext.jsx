import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Token might be invalid, remove it
          api.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      console.log('Attempting to register user:', { ...userData, password: '[HIDDEN]' });
      const response = await api.register(userData);
      console.log('Registration successful:', response);
      return { success: true, user: response };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed. Please try again.'
      };
    }
  };


  
  // Login Activity
  const login = async (email, password) => {
    try {
      console.log('Attempting to login user:', email);
      const response = await api.login(email, password);
      
      if (response.access_token) {
        console.log('Login successful, fetching user profile...');
        // Fetch user profile after successful login
        try {
          const userData = await api.getProfile();
          setUser(userData);
          console.log('User profile loaded:', userData);
          return { success: true, user: userData };
        } catch (profileError) {
          console.error('Failed to fetch profile after login:', profileError);
          // Login was successful but profile fetch failed
          // Still consider it a successful login
          return { success: true, warning: 'Login successful but failed to load profile' };
        }
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const googleAuth = async (idToken) => {
    try {
      const response = await api.googleAuth(idToken);
      if (response.access_token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
          return { success: true, user: userData };
        } catch (profileError) {
          console.error('Failed to fetch profile after Google auth:', profileError);
          return { success: true, user: response.user };
        }
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Google authentication failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    api.logout();
  };

  const isAuthenticated = () => {
    return !!user && api.isAuthenticated();
  };

  const value = {
    user,
    register,
    login,
    googleAuth,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
