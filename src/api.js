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

  async getSession() {
    const response = await axiosInstance.get("/auth/session");
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

  // Post endpoints
  async createPost(formData) {
    const response = await axiosInstance.post("/posts", formData);
    return response.data;
  },

  async getPosts(params = {}) {
    const response = await axiosInstance.get("/posts", { params });
    return response.data;
  },

  async getPostCategories() {
    const response = await axiosInstance.get("/posts/categories");
    return response.data;
  },

  async getMyPosts(params = {}) {
    const response = await axiosInstance.get("/posts/me", { params });
    return response.data;
  },

  async getPostById(postId) {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  },

  async updatePost(postId, formData) {
    const response = await axiosInstance.put(`/posts/${postId}`, formData);
    return response.data;
  },

  async deletePost(postId) {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },

  // Review endpoints
  async createReview(data) {
    const response = await axiosInstance.post('/reviews', data);
    return response.data;
  },

  async getReviews(params = {}) {
    const response = await axiosInstance.get('/reviews', { params });
    return response.data;
  },

  async getMyReviews(params = {}) {
    const response = await axiosInstance.get('/reviews/me', { params });
    return response.data;
  },

  async updateReview(reviewId, data) {
    const response = await axiosInstance.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },

  async updateReviewLikes(reviewId, delta) {
    const response = await axiosInstance.patch(`/reviews/${reviewId}/likes`, { delta });
    return response.data;
  },

  async deleteReview(reviewId) {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Booking endpoints
  async createBooking(data) {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  async getBookings(params = {}) {
    const response = await axiosInstance.get('/bookings', { params });
    return response.data;
  },

  async getMyBookings(params = {}) {
    const response = await axiosInstance.get('/bookings/me', { params });
    return response.data;
  },

  async getBookingById(bookingId) {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data;
  },

  async getOwnerBookings(params = {}) {
    const response = await axiosInstance.get('/bookings/owner/me', { params });
    return response.data;
  },

  async getBookingAvailability(postId, startDate, endDate) {
    const response = await axiosInstance.get('/bookings/availability', {
      params: {
        post_id: postId,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  async updateBookingStatus(bookingId, status) {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/status`, { status });
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

  async getAdminDashboard(params = {}) {
    const response = await axiosInstance.get("/admin/dashboard", { params });
    return response.data;
  },

  async getAdminPosts(params = {}) {
    const response = await axiosInstance.get("/admin/posts", { params });
    return response.data;
  },
};

export default api;