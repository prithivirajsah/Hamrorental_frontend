import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import bgImage from '../assets/bg.png';
import { ToastContainer, toast } from 'react-toastify';


export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert('Please agree to the Terms and Policies');
      return;
    }
    console.log('Registration attempt:', { fullName, email, password });
  };

  const handleGoogleSignup = () => {
    console.log('Google signup attempt');
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Registration Card Container */}
      <div className="relative z-10 flex items-center justify-start min-h-screen px-6 md:px-12 lg:px-20">
        {/* Glassmorphism Card */}
        <div className="w-full max-w-md lg:max-w-lg backdrop-blur-sm bg-transparent rounded-[32px] shadow-2xl p-8 md:p-12 border border-white/10 transition-all duration-500 hover:border-white/20">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center justify-center text-center">
            Create your account
          </h1>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder:text-gray-400 border-b border-gray-500 focus:border-white pl-12 pr-4 transition-all duration-300 outline-none"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder:text-gray-400 border-b border-gray-500 focus:border-white pl-12 pr-4 transition-all duration-300 outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder:text-gray-400 border-b border-gray-500 focus:border-white pl-12 pr-12 transition-all duration-300 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength
                        ? level === 1
                          ? 'bg-red-500'
                          : level === 2
                          ? 'bg-yellow-500'
                          : level === 3
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 text-right">Password Strength</p>
            </div>

            {/* Terms and Policies Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent appearance-none cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-all"
                />
                {agreeToTerms && (
                  <Check className="w-4 h-4 text-white absolute pointer-events-none" />
                )}
              </div>
              <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer leading-tight">
                I agree to all the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Privacy Policies
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mt-6"
            >
              Create my account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="text-white font-medium">Sign up with Google</span>
          </button>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                 Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-transparent to-black/20 pointer-events-none"></div>
    </div>
  );
}