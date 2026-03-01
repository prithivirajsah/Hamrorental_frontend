import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check, X, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import bgImage from '../assets/bg.png';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../api.js';
import { getGoogleIdToken } from '../lib/googleIdentity.js';
import 'react-toastify/dist/ReactToastify.css';

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  return strength;
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    isValidating: false,
    isValid: null,
    errors: [],
    suggestions: []
  });
  
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({
    isValidating: false,
    isValid: null,
    message: ''
  });

  const { register, googleAuth } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength
  const passwordStrength = calculatePasswordStrength(password);
  
  // Debounced values for API calls
  const debouncedPassword = useDebounce(password, 500);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

  // Validate password via API
  const validatePasswordAPI = useCallback(async (passwordToValidate) => {
    if (!passwordToValidate || passwordToValidate.length < 3) {
      setPasswordValidation({
        isValidating: false,
        isValid: null,
        errors: [],
        suggestions: []
      });
      return;
    }

    setPasswordValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      const result = await api.validatePassword(passwordToValidate);
      setPasswordValidation({
        isValidating: false,
        isValid: result.is_valid,
        errors: result.errors || [],
        suggestions: result.suggestions || []
      });
    } catch (error) {
      console.error('Password validation error:', error);
      // Fallback to client-side validation
      setPasswordValidation({
        isValidating: false,
        isValid: passwordStrength >= 2,
        errors: passwordStrength < 2 ? ['Password is too weak'] : [],
        suggestions: passwordStrength < 2 ? ['Use a combination of uppercase, lowercase, numbers, and special characters'] : []
      });
    }
  }, [passwordStrength]);

  // Validate password confirmation via API
  const validateConfirmPasswordAPI = useCallback(async (passwordToValidate, confirmPasswordToValidate) => {
    if (!passwordToValidate || !confirmPasswordToValidate) {
      setConfirmPasswordValidation({
        isValidating: false,
        isValid: null,
        message: ''
      });
      return;
    }

    setConfirmPasswordValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      const result = await api.validatePassword(passwordToValidate, confirmPasswordToValidate);
      setConfirmPasswordValidation({
        isValidating: false,
        isValid: result.passwords_match,
        message: result.passwords_match ? 'Passwords match' : 'Passwords do not match'
      });
    } catch (error) {
      console.error('Password confirmation validation error:', error);
      // Fallback to client-side validation
      const isMatching = passwordToValidate === confirmPasswordToValidate;
      setConfirmPasswordValidation({
        isValidating: false,
        isValid: isMatching,
        message: isMatching ? 'Passwords match' : 'Passwords do not match'
      });
    }
  }, []);

  // Effect for password validation
  useEffect(() => {
    validatePasswordAPI(debouncedPassword);
  }, [debouncedPassword, validatePasswordAPI]);

  // Effect for confirm password validation
  useEffect(() => {
    if (debouncedPassword && debouncedConfirmPassword) {
      validateConfirmPasswordAPI(debouncedPassword, debouncedConfirmPassword);
    }
  }, [debouncedPassword, debouncedConfirmPassword, validateConfirmPasswordAPI]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (fullName.trim().length < 2) {
      toast.error('Full name must be at least 2 characters long');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    if (!confirmPassword) {
      toast.error('Please confirm your password');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Check API validation results
    if (passwordValidation.isValid === false) {
      toast.error('Please fix password validation errors before proceeding');
      return;
    }
    
    if (confirmPasswordValidation.isValid === false) {
      toast.error('Password confirmation does not match');
      return;
    }
    
    if (passwordStrength < 2) {
      toast.error('Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters');
      return;
    }
    
    if (!agreeToTerms) {
      toast.error('Please agree to the Terms and Privacy Policies');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        confirm_password: confirmPassword
      });

      if (result.success) {
        toast.success('Account created successfully! You can now log in.');
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeToTerms(false);
        // Reset validation states
        setPasswordValidation({ isValidating: false, isValid: null, errors: [], suggestions: [] });
        setConfirmPasswordValidation({ isValidating: false, isValid: null, message: '' });
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      const result = await googleAuth(idToken);
      if (!result.success) {
        toast.error(result.error || 'Google signup failed.');
        return;
      }

      toast.success('Google sign up successful!');
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'Google signup failed.');
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
          
          {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder:text-gray-400 border-b border-gray-500 focus:border-white pl-12 pr-12 transition-all duration-300 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
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
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Fair'}
                    {passwordStrength === 3 && 'Good'}
                    {passwordStrength === 4 && 'Strong'}
                  </p>
                  <p className="text-xs text-gray-400">Password Strength</p>
                </div>
                {passwordStrength < 2 && (
                  <p className="text-xs text-red-400">
                    Password should include: uppercase, lowercase, numbers, and special characters
                  </p>
                )}
              </div>
            )}

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="text-xs">
                {password === confirmPassword ? (
                  <p className="text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Passwords match
                  </p>
                ) : (
                  <p className="text-red-400">Passwords do not match</p>
                )}
              </div>
            )}

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
              disabled={isLoading || passwordValidation.isValidating || confirmPasswordValidation.isValidating}
              className={`w-full h-12 font-semibold rounded-xl shadow-lg transition-all duration-300 mt-6 ${
                isLoading || passwordValidation.isValidating || confirmPasswordValidation.isValidating
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-[1.02]'
              } text-white`}
            >
              {isLoading ? 'Creating account...' : 'Create my account'}
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