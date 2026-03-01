import axiosInstance from "./lib/axios.js";

const api = {
  // Authentication endpoints
  async register(data) {
    console.log('Sending registration data:', JSON.stringify(data, null, 2));
    try {
      const response = await axiosInstance.post("/auth/register", data);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  async login(email, password) {
    // Backend expects form-encoded data for OAuth2 login
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await axiosInstance.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log('res', response.data)
    // Save token
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    console.log(response.data.user)

    // Extract role safely from backend response
    const role =
      response.data?.user?.role ||
      response.data?.role ||               // backup
      response.data?.user_role ||          // backup
      null;

    console.log("Logged-in role:", role);

    // Redirect based on role
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "driver") {
      window.location.href = "/driver";
    } else if (role === "user") {
      window.location.href = "/";
    } else {
      // Fallback (if backend returned no role)
      window.location.href = "/";
    }

    return response.data;
  },

  async googleAuth(idToken) {
    const response = await axiosInstance.post("/auth/google", {
      id_token: idToken,
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },


  async getProfile() {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  async updateProfile(data) {
    const response = await axiosInstance.put("/users/me", data);
    return response.data;
  },

  // Vehicle endpoints (will be implemented when backend has them)
  async getVehicles(params = {}) {
    const response = await axiosInstance.get("/vehicles", { params });
    return response.data;
  },

  // Wishlist endpoints (will be implemented when backend has them)
  async getWishlist() {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
  },

  // Contact/Support endpoints (will be implemented when backend has them)
  async sendContactMessage(data) {
    const response = await axiosInstance.post("/contact", data);
    return response.data;
  },

  // Password validation endpoint
  async validatePassword(password, confirmPassword = null) {
    const response = await axiosInstance.post("/auth/validate-password", {
      password,
      confirm_password: confirmPassword
    });
    return response.data;
  },

  // Utility methods
  async logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  // Test backend connection
  async testConnection() {
    try {
      const response = await axiosInstance.get("/");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Home page content endpoint
  async getHomePage() {
    const response = await axiosInstance.get("/home");
    return response.data;
  },
};

export default api;