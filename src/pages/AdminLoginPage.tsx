import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateAdminCredentials, verifyAdminOTP, isAdminAuthenticated } from '../utils/auth';
import { User, Mail, Key, Lock, Loader, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

// Enum for login steps
enum LoginStep {
  CREDENTIALS = 'credentials',
  OTP_VERIFICATION = 'otp'
}

const AdminLoginPage: React.FC = () => {
  // Credentials state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // UI state
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.CREDENTIALS);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Timer for OTP expiry countdown
  useEffect(() => {
    if (otpExpiry && timeLeft !== null) {
      if (timeLeft <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setError('Verification code has expired. Please request a new one.');
        return;
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [otpExpiry, timeLeft]);

  // Format time left for display
  const formatTimeLeft = () => {
    if (timeLeft === null) return '';
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // If user is already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Check if redirected from a security logout
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reason = params.get('reason');
    
    if (reason === 'security') {
      setError('You have been logged out for security reasons. All admin sessions have been terminated.');
    }
  }, [location]);

  // Handle credential submission
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    // Validate inputs
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    try {
      // Call API to validate credentials and request OTP
      const response = await validateAdminCredentials(email, username, password);
      
      if (response.success) {
        setSuccess('Verification code sent to your email');
        
        // Set OTP expiry timer
        if (response.expiresIn) {
          setOtpExpiry(Date.now() + response.expiresIn * 1000);
          setTimeLeft(response.expiresIn);
        }
        
        // Move to OTP verification step
        setCurrentStep(LoginStep.OTP_VERIFICATION);
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    // Validate OTP
    if (!otp.trim()) {
      setError('Verification code is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Call API to verify OTP
      const response = await verifyAdminOTP(email, otp);
      
      if (response.success) {
        setSuccess('Login successful!');
        
        // Navigate to admin dashboard
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
        }, 1000);
      } else {
        // More specific error message
        setError(response.message || 'Invalid verification code');
        console.log('OTP verification failed:', response);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error during OTP verification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Request new OTP
  const handleResendOtp = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      // Call API to request new OTP
      const response = await validateAdminCredentials(email, username, password);
      
      if (response.success) {
        setSuccess('New verification code sent to your email');
        
        // Reset OTP expiry timer
        if (response.expiresIn) {
          setOtpExpiry(Date.now() + response.expiresIn * 1000);
          setTimeLeft(response.expiresIn);
        }
        
        // Clear OTP input
        setOtp('');
      } else {
        setError(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to credentials step
  const handleBackToCredentials = () => {
    setCurrentStep(LoginStep.CREDENTIALS);
    setOtp('');
    setError(null);
    setSuccess(null);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setOtpExpiry(null);
    setTimeLeft(null);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {currentStep === LoginStep.CREDENTIALS ? 'Admin Login' : 'Verification'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {currentStep === LoginStep.CREDENTIALS ? (
        // Credentials Form
        <form onSubmit={handleCredentialsSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      ) : (
        // OTP Verification Form
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-4">
              We've sent a verification code to <strong>{email}</strong>. Please enter it below.
            </p>
            {timeLeft !== null && (
              <p className="text-xs text-gray-500 mb-2">
                Code expires in: <span className="font-mono font-medium">{formatTimeLeft()}</span>
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-center font-mono text-lg tracking-widest"
                placeholder="123456"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Login</span>
                </>
              )}
            </button>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBackToCredentials}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to login
              </button>
              
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading || (timeLeft !== null && timeLeft > 0)}
                className={`text-sm ${
                  isLoading || (timeLeft !== null && timeLeft > 0)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-yellow-600 hover:text-yellow-700'
                }`}
              >
                Resend code
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>This page is for administrators only.</p>
        <p>Please contact support if you need access.</p>
      </div>
    </div>
  );
};

export default AdminLoginPage; 