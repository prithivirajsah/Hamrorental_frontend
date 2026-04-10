import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';
import bgImage from '../assets/bg.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token is missing or invalid. Please request a new link.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.resetPassword(token, password, confirmPassword);
      toast.success(response?.message || 'Password reset successful. Please log in.');
      navigate('/login');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error(message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md backdrop-blur-sm bg-transparent rounded-[32px] shadow-2xl p-8 border border-white/10">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Reset Password</h1>
          <p className="text-sm text-gray-300 text-center mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-transparent text-white placeholder:text-gray-400 border-b border-white/40 focus:border-white/90 pl-10 pr-12 outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-14 bg-transparent text-white placeholder:text-gray-400 border-b border-white/40 focus:border-white/90 pl-10 pr-12 outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                isSubmitting
                  ? 'opacity-80 cursor-not-allowed'
                  : 'hover:from-blue-700 hover:to-violet-700 hover:shadow-xl transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
