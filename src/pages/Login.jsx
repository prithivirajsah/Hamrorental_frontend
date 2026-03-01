import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import bgImage from '../assets/bg.png';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getGoogleIdToken } from '../lib/googleIdentity.js';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email.trim().toLowerCase(), password);

      if (result.success) {
        toast.success('Login successful!');
        setTimeout(() => {
          const role = result.user?.role;
          if (role === "admin") {
            navigate('/admin')
          } else if (role === "driver") {
            navigate('/driver')
          } else {
            navigate('/')
          }
        }, 1000);
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      const result = await googleAuth(idToken);

      if (!result.success) {
        toast.error(result.error || 'Google login failed.');
        return;
      }

      toast.success('Google login successful!');
      setTimeout(() => {
        const role = result.user?.role;
        if (role === "admin") {
          navigate('/admin');
        } else if (role === "driver") {
          navigate('/driver');
        } else {
          navigate('/');
        }
      }, 600);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Login Card Container */}
      <div className="relative z-10 flex items-center justify-start min-h-screen px-6 md:px-12 lg:px-20">
        {/* Glassmorphism Card */}
        <div className="w-full max-w-md lg:max-w-lg backdrop-blur-sm bg-transparent rounded-[32px] shadow-2xl p-8 md:p-12 border border-white/10 transition-all duration-500 hover:border-white/20">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight flex items-center justify-center text-center">
            Log In
          </h1>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-transparent text-white placeholder:text-gray-400 border-b border-white/40 focus:border-white/90 pl-10 pr-4 outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-transparent text-white placeholder:text-gray-400 border-b border-white/40 focus:border-white/90 pl-10 pr-12 outline-none transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button 
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-blue-400 hover:text-blue-300 font-semibold text-xs transition-colors duration-300"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 hover:shadow-xl transform hover:scale-[1.02]'
              } text-white`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="text-white font-medium">Continue with Google</span>
          </button>
          

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay on the right */}
      <div className=" hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-transparent to-black/20 pointer-events-none"></div>
      {showResetModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-transparent border border-white/10 p-6 shadow-2xl text-white relative backdrop-blur-xl">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-center mb-3">Reset Password</h2>
            <p className="text-sm text-gray-300 text-center mb-6">
              Enter the email that you used when you signed up to recover your password.
              You will receive a password reset link.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Reset password for:', resetEmail);
                setShowResetModal(false);
                setResetEmail('');
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="Your Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full h-14 bg-transparent text-white placeholder:text-gray-400 border-b border-white/40 focus:border-white/90 pl-10 pr-4 outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send reset link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
