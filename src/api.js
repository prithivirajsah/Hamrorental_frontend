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

  async registerDriver(data) {
    try {
      const response = await axiosInstance.post("/auth/register-driver", data);
      return response.data;
    } catch (error) {
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

    // Save token
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },

  async driverLogin(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await axiosInstance.post("/auth/driver-login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },

  async forgotPassword(email) {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password, confirmPassword) {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      password,
      confirm_password: confirmPassword,
    });
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

  async uploadProfilePhoto(formData) {
    const response = await axiosInstance.post("/users/me/profile-photo", formData);
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

  async getReviewReminders(params = {}) {
    const response = await axiosInstance.get('/reviews/reminders/me', { params });
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

  async getMyBookingsSummary() {
    const response = await axiosInstance.get('/bookings/me/summary');
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

  // Hire request and chat endpoints
  async createHireRequest(data) {
    const response = await axiosInstance.post('/hire-requests', data);
    return response.data;
  },

  async getMyHireRequests(params = {}) {
    const response = await axiosInstance.get('/hire-requests/me', { params });
    return response.data;
  },

  async getOwnerHireRequests(params = {}) {
    const response = await axiosInstance.get('/hire-requests/owner/me', { params });
    return response.data;
  },

  async updateHireRequestStatus(hireRequestId, data) {
    const response = await axiosInstance.patch(`/hire-requests/${hireRequestId}/status`, data);
    return response.data;
  },

  async acceptHireRequest(hireRequestId) {
    const response = await axiosInstance.patch(`/hire-requests/${hireRequestId}/accept`);
    return response.data;
  },

  async getHireRequestChats() {
    const response = await axiosInstance.get('/chats/me');
    return response.data;
  },

  async getHireRequestMessages(hireRequestId) {
    const response = await axiosInstance.get(`/chats/${hireRequestId}/messages`);
    return response.data;
  },

  async sendHireRequestMessage(hireRequestId, data) {
    const response = await axiosInstance.post(`/chats/${hireRequestId}/messages`, data);
    return response.data;
  },

  // Support chat endpoints (user <-> admin)
  async getOrCreateSupportConversation(createNew = false) {
    const response = await axiosInstance.post('/support-chat/conversations/me/active', {
      create_new: Boolean(createNew),
    });
    return response.data;
  },

  async getMySupportConversations() {
    const response = await axiosInstance.get('/support-chat/conversations/me');
    return response.data;
  },

  async getAdminSupportConversations() {
    const response = await axiosInstance.get('/support-chat/admin/conversations');
    return response.data;
  },

  async getAdminSupportConversationMessages(conversationId) {
    const response = await axiosInstance.get(`/support-chat/admin/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendAdminSupportConversationMessage(conversationId, data) {
    const response = await axiosInstance.post(`/support-chat/admin/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  async markAdminSupportConversationRead(conversationId) {
    const response = await axiosInstance.patch(`/support-chat/admin/conversations/${conversationId}/read`);
    return response.data;
  },

  async getSupportConversationMessages(conversationId) {
    const response = await axiosInstance.get(`/support-chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendSupportConversationMessage(conversationId, data) {
    const response = await axiosInstance.post(`/support-chat/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  async markSupportConversationRead(conversationId) {
    const response = await axiosInstance.patch(`/support-chat/conversations/${conversationId}/read`);
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

  async cancelBooking(bookingId) {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
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

  async getAdminUsers(params = {}) {
    const response = await axiosInstance.get("/admin/users", { params });
    return response.data;
  },

  // Driver License Verification endpoints
  async getPendingDriverLicenses(params = {}) {
    const response = await axiosInstance.get("/admin/driver-licenses/pending", { params });
    return response.data;
  },

  async getAllDriverLicenses(params = {}) {
    const response = await axiosInstance.get("/admin/driver-licenses", { params });
    return response.data;
  },

  async verifyDriverLicense(licenseId, action, rejectionReason = null) {
    const response = await axiosInstance.post("/admin/driver-license/verify", {
      license_id: licenseId,
      action: action,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  async getAdminDriverLicenseImage(licenseId) {
    const response = await axiosInstance.get(`/admin/driver-licenses/${licenseId}/image`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async uploadDriverLicense(licenseData) {
    const response = await axiosInstance.post("/users/driver/license", licenseData);
    return response.data;
  },

  async getMyDriverLicense() {
    const response = await axiosInstance.get("/users/driver/license");
    return response.data;
  },

  async uploadKycDocument(formData) {
    const response = await axiosInstance.post("/users/kyc-documents", formData);
    return response.data;
  },

  async getMyKycDocument() {
    const response = await axiosInstance.get("/users/kyc-documents/me");
    return response.data;
  },

  async getMyVerification() {
    const response = await axiosInstance.get("/users/me/verification");
    return response.data;
  },

  async getAdminKycDocuments(params = {}) {
    const response = await axiosInstance.get("/admin/kyc-documents", { params });
    return response.data;
  },

  async updateAdminKycStatus(documentId, data) {
    const response = await axiosInstance.patch(`/admin/kyc-documents/${documentId}/status`, data);
    return response.data;
  },

  async getAdminKycDocumentImage(documentId, side = 'front') {
    const normalizedSide = side === 'back' ? 'back' : 'front';
    const response = await axiosInstance.get(`/admin/kyc-documents/${documentId}/${normalizedSide}-image`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getAdminMessages(params = {}) {
    const response = await axiosInstance.get("/admin/messages", { params });
    return response.data;
  },
};


export default api;