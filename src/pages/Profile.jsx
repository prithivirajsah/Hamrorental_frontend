import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, FileText, Shield, Edit, Lock, Camera, CheckCircle, XCircle, Clock, Calendar, MapPin, Mail, Phone, Key, Activity, LogIn, Globe, Smartphone, Trash2, Plus, Loader2 } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useAuth } from '../contexts/AuthContext';
import api from '../api.js';
import { handleApiError, handleApiSuccess } from '../utils/apiUtils';
import { toast } from 'react-toastify';
import UserAddPost from './UserAddPost';
import { config } from '../config/config';

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [kycStatus, setKycStatus] = useState('pending');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    country: '',
    date_of_birth: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [kycDocuments, setKycDocuments] = useState({
    document_type: 'National ID',
    document_number: '',
    front_file: null,
  });
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Posts state
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const buildFormDataFromUser = (currentUser) => ({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    country: currentUser?.country || 'Nepal',
    date_of_birth: currentUser?.date_of_birth || ''
  });

  const loadMyPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const posts = await api.getMyPosts();
      setMyPosts(posts);
    } catch (error) {
      toast.error('Failed to load your posts');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingPostId(postId);
    try {
      await api.deletePost(postId);
      toast.success('Post deleted successfully');
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      handleApiError(error, 'Failed to delete post');
    } finally {
      setDeletingPostId(null);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${config.API_BASE_URL}${url}`;
  };

  // Mock login activity data (in real app, this would come from backend)
  const [loginActivity] = useState([
    {
      id: 1,
      timestamp: new Date(),
      device: 'Chrome on MacOS',
      location: 'Kathmandu, Nepal',
      ip: '103.10.28.xxx',
      status: 'success'
    },
  ]);

  // Initialize form data with user information
  useEffect(() => {
    if (user) {
      setFormData(buildFormDataFromUser(user));
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'posts') {
      loadMyPosts();
    }
  }, [activeTab, loadMyPosts]);

  useEffect(() => {
    const loadKycStatus = async () => {
      if (!user) return;
      try {
        const latestDoc = await api.getMyKycDocument();
        if (latestDoc?.verification_status === 'approved') {
          setKycStatus('verified');
        } else if (latestDoc?.verification_status === 'rejected') {
          setKycStatus('rejected');
        } else {
          setKycStatus('pending');
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          setKycStatus('pending');
          return;
        }
        setKycStatus('pending');
      }
    };

    loadKycStatus();
  }, [user]);

  const tabs = [
    { id: 'details', name: 'My Details', icon: User },
    { id: 'security', name: 'Security & Login', icon: Shield },
    { id: 'posts', name: 'My Posts', icon: FileText },
    { id: 'activity', name: 'Login Activity', icon: Activity }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsUpdating(true);
    try {
      await api.updateProfile({
        full_name: formData.full_name,
        phone: formData.phone || null,
        location: formData.location || null,
        country: formData.country || null,
        date_of_birth: formData.date_of_birth || null,
      });
      await refreshUser();
      handleApiSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsUpdating(true);
    try {
      // In real app, you'd have an API endpoint for password change
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      handleApiSuccess('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      handleApiError(error, 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKycFieldChange = (field, value) => {
    setKycDocuments((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKycSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit documents');
      return;
    }

    if (!kycDocuments.document_number.trim()) {
      toast.error('Document number is required');
      return;
    }

    if (!kycDocuments.front_file) {
      toast.error('Please upload front document image');
      return;
    }

    setIsSubmittingKyc(true);
    try {
      const form = new FormData();
      form.append('document_type', kycDocuments.document_type);
      form.append('document_number', kycDocuments.document_number.trim());
      form.append('front_file', kycDocuments.front_file);

      await api.uploadKycDocument(form);

      setKycStatus('pending');
      setKycDocuments({
        document_type: 'National ID',
        document_number: '',
        front_file: null,
      });
      setIsKycModalOpen(false);
      handleApiSuccess('Documents submitted successfully. Verification is pending.');
    } catch (error) {
      handleApiError(error, 'Failed to submit KYC documents');
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  const renderKycStatus = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <div className="w-full px-3 py-2 border border-green-300 rounded-md bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 font-medium">Verified</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Your identity has been successfully verified</p>
          </div>
        );
      case 'rejected':
        return (
          <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 font-medium">Verification Failed</span>
            </div>
            <p className="text-xs text-red-600 mt-1">Documents rejected. Please resubmit valid documents</p>
          </div>
        );
      default:
        return (
          <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-700 font-medium">Pending Verification</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">Upload required documents to complete verification</p>
          </div>
        );
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200">
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {user?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => document.getElementById('photo-upload').click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#695ED9] rounded-full flex items-center justify-center text-white hover:bg-[#5a4fc4] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  {imagePreview && (
                    <button 
                      onClick={() => {
                        setProfileImage(null);
                        setImagePreview(null);
                        document.getElementById('photo-upload').value = '';
                      }}
                      className="absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <CloseIcon style={{ fontSize: '16px', color: 'black' }} />
                    </button>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{user?.full_name || 'User Name'}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {formatDate(user?.created_at)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active Account</span>
                  </div>
                  {profileImage && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <AiOutlineCheckCircle className="w-4 h-4" />
                      Photo uploaded
                    </p>
                  )}
                </div>
              </div>
              
              {/* Account Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Add your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    readOnly={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Your country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">KYC Status</label>
                  {renderKycStatus()}
                  <button
                    type="button"
                    onClick={() => setIsKycModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Upload KYC Documents
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account ID</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-gray-600 text-sm">#{user?.id}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? (isUpdating ? 'Updating...' : 'Save Changes') : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button 
                    onClick={() => {
                      setFormData(buildFormDataFromUser(user));
                      setIsEditing(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </h3>
              
              {/* Login Information */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Current Session Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span><strong>Last Login:</strong> {getRelativeTime(new Date())}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span><strong>Browser:</strong> Chrome on MacOS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span><strong>Location:</strong> Kathmandu, Nepal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span><strong>Token Status:</strong> Active</span>
                  </div>
                </div>
              </div>
              
              {/* Change Password Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </h4>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.current_password}
                      onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.new_password}
                      onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirm_password}
                      onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button 
                    onClick={handlePasswordUpdate}
                    disabled={isUpdating || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                    className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold mb-3">Account Actions</h4>
                <div className="space-y-3">
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign Out of All Devices
                  </button>
                  <p className="text-sm text-gray-600">This will log you out from all devices and browsers.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Login Activity
              </h3>
              <p className="text-gray-600 mb-6">Monitor your account's login activity to ensure security.</p>
              
              <div className="space-y-4">
                {loginActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.device.includes('iPhone') ? (
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Globe className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.device}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </p>
                        <p className="text-xs text-gray-500">IP: {activity.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{getRelativeTime(activity.timestamp)}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'success' ? '✓ Successful' : '✗ Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-yellow-800 mb-1">Security Tip</h5>
                    <p className="text-sm text-yellow-700">
                      If you notice any suspicious login activity, please change your password immediately and contact support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Posts
              </h3>

              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#4e19d2]" />
                </div>
              ) : myPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No posts yet</p>
                  <p className="text-sm mt-1">Create your first vehicle listing to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-3">
                        {post.image_urls && post.image_urls.length > 0 && (
                          <img
                            src={getImageUrl(post.image_urls[0])}
                            alt={post.post_title}
                            className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold truncate pr-2">{post.post_title}</h4>
                            <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded flex-shrink-0">Active</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[#695ED9] font-semibold text-sm">Rs. {post.price_per_day.toLocaleString()}/day</span>
                            <div className="flex gap-3">
                              <button
                                onClick={() => { setEditingPost(post); setIsAddPostOpen(true); }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deletingPostId === post.id}
                                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                              >
                                {deletingPostId === post.id ? <Loader2 className="w-3 h-3 animate-spin text-[#4e19d2]" /> : null}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => { setEditingPost(null); setIsAddPostOpen(true); }}
                  className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Post
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'text-[#695ED9] border-[#695ED9]'
                      : 'text-gray-500 border-transparent hover:text-[#695ED9] hover:border-[#695ED9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl">
          {renderTabContent()}
        </div>
      </main>

      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-bold text-gray-900">KYC Document Upload</h3>
              <button
                type="button"
                onClick={() => setIsKycModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <CloseIcon style={{ fontSize: '18px', color: '#374151' }} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Document Type</label>
                <select
                  value={kycDocuments.document_type}
                  onChange={(e) => handleKycFieldChange('document_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="National ID">National ID</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Document Number</label>
                <input
                  type="text"
                  value={kycDocuments.document_number}
                  onChange={(e) => handleKycFieldChange('document_number', e.target.value)}
                  placeholder="Enter document number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">Front Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleKycFieldChange('front_file', e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <div className="md:col-span-2 pt-1">
                <button
                  type="button"
                  onClick={handleKycSubmit}
                  disabled={isSubmittingKyc}
                  className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmittingKyc ? 'Submitting Documents...' : 'Submit Documents'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isAddPostOpen && (
        <UserAddPost
          asModal={true}
          initialPost={editingPost}
          onClose={() => { setIsAddPostOpen(false); setEditingPost(null); }}
          onSuccess={() => {
            setIsAddPostOpen(false);
            setEditingPost(null);
            loadMyPosts();
          }}
        />
      )}
      <Footer />
    </div>
  );
}