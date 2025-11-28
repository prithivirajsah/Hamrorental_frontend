import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, FileText, Shield, Edit, Lock, Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function Profile() {
  const [activeTab, setActiveTab] = useState('details');
  const [kycStatus, setKycStatus] = useState('pending'); // 'pending', 'verified', 'rejected'
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const tabs = [
    { id: 'details', name: 'My Details', icon: User },
    { id: 'posts', name: 'My Posts', icon: FileText },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    document.getElementById('photo-upload').click();
  };

  const handleCancelPhoto = () => {
    setProfileImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.value = '';
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="animate-fadeIn "> 
            <div className="bg-white rounded-xl shadow-xl p-6 mb-0.5 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">P</span>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#695ED9] rounded-full flex items-center justify-center text-white hover:bg-[#5a4fc4] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  {imagePreview && (
                    <button 
                      onClick={handleCancelPhoto}
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
                <div>
                  <h2 className="text-2xl font-bold mb-2">Prithivi Raj Sah</h2>
                  <p className="text-black">prithivirajsah584@gmail.com</p>
                  {profileImage && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <AiOutlineCheckCircle className="w-4 h-4" />
                      Photo uploaded
                    </p>
                  )}
                   
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Prithivi Raj Sah" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue="prithivirajsah584@gmail.com" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Add your phone number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Counrty</label>
                  <input 
                    type="text" 
                    placeholder="Add your location" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Location</label>
                  <input 
                    type="text" 
                    placeholder="Add your location" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium dark:text-gray-3000 mb-2">KYC Status</label>
                  {renderKycStatus()}
                </div>
              </div>

              {/* KYC Section */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Complete Your KYC Verification</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      To access all features and increase your trust score, please complete your KYC verification by uploading the required documents.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Upload Documents
                      </button>
                      
                      {/* Demo buttons to test different KYC statuses */}
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setKycStatus('pending')}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Pending
                        </button>
                        <button 
                          onClick={() => setKycStatus('verified')}
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Verified
                        </button>
                        <button 
                          onClick={() => setKycStatus('rejected')}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Rejected
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="animate-slideIn">
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">My Posts</h3>
              <div className="space-y-4">
                {[1, 2].map((post) => (
                  <div key={post} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Toyota Camry 2023 - Available for Rent</h4>
                      <span className="text-sm text-green-600 bg-green-100  px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Well-maintained sedan perfect for city drives and long trips. Available for daily, weekly, and monthly rentals.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#695ED9] font-semibold">Rs. 8,000/day</span>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors">
                  + Add New Post
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="animate-fadeIn ">
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4">Security Settings</h3>
              
              <div className="space-y-6  ">
                <div >
                  <h4 className="text-lg font-semibold mb-3 ">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-gray-3000 mb-2">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-gray-3000 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button className="bg-[#695ED9] hover:bg-[#5a4fc4] text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Recent Login Activity */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold mb-3">Recent Login Activity</h4>
                  <div className="space-y-2">
                    {['Today, 10:30 AM - Chrome on MacOS', 'Yesterday, 2:15 PM - Safari on iPhone', '2 days ago, 9:45 AM - Chrome on Windows'].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                        <span className="text-sm">{activity}</span>
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
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
        <div className="max-w-8xl">
          {renderTabContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
