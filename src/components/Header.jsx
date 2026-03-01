import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { User, Heart, LogOut } from 'lucide-react';
import HeaderIcon from '../assets/Headericon.png';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleLogout = () => {
    logout();
    setShowProfilePopup(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Social Icons, Logo, and Action Buttons */}
        <div className="flex items-center justify-between h-16">
          {/* Left: Social Media Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.facebook.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://www.instagram.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://x.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://www.youtube.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
          </div>

          {/* Center: Logo/Brand */}
          <div className="flex items-center gap-2">
            <img 
              src={HeaderIcon} 
              alt="Hamro Rental Logo" 
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Add Post and Profile (when logged in) or Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated() ? (
              <>
                {/* Add Post Button */}
                <button 
                  className="px-4 sm:px-6 py-2 rounded-xl border font-medium transition-colors"
                  style={{
                    backgroundColor: '#695ED920',
                    borderColor: '#695ED9',
                    color: '#695ED9'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#695ED930'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#695ED920'}
                >
                  Add Post
                </button>
                
                {/* Profile Icon */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfilePopup}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: '#695ED920',
                      borderColor: '#695ED9'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#695ED930'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#695ED920'}
                    aria-label="Profile"
                  >
                    <User className="w-5 h-5" style={{ color: '#695ED9' }} />
                  </button>

                  {/* Profile Popup */}
                  {showProfilePopup && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      {/* Profile Header */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-6 text-center">
                        <div className="relative inline-block mb-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-4 border-purple-400">
                            <User className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <h3 className="text-gray-900 font-semibold text-lg mb-1">
                          {user?.full_name || user?.username || 'User'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowProfilePopup(false)}
                        >
                          <User className="w-5 h-5" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link 
                          to="/wishlist" 
                          className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowProfilePopup(false)}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Wishlist</span>
                        </Link>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Bottom Row: Navigation Menu */}
        <div className="border-t border-gray-300 animate-fadeIn">
          <nav className="flex items-center justify-center gap-8 py-3 ">
            <Link 
              to="/" 
              className="text-gray-700 hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/vehicles" 
              className="text-gray-700 hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group"
            >
              Vehicles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/hire-a-driver" 
              className="text-gray-700 hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group"
            >
              Hire a Driver
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/faqs" 
              className="text-gray-700 hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group"
            >
              FAQs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}