// Authentication utilities for admin access
import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:3001';

// Local storage keys
const ADMIN_AUTH_KEY = 'maitri_admin_auth';

export interface AdminAuth {
  isAuthenticated: boolean;
  username: string;
  email: string;
  token: string;
}

// Check if user is authenticated as admin
export function isAdminAuthenticated(): boolean {
  const authData = localStorage.getItem(ADMIN_AUTH_KEY);
  if (!authData) return false;
  
  try {
    const auth = JSON.parse(authData) as AdminAuth;
    return auth.isAuthenticated === true && !!auth.token;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return false;
  }
}

// Get device information for login tracking
export function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  let deviceInfo = {
    browser: 'Unknown',
    device: 'Unknown',
    os: 'Unknown',
    ip: 'Unknown'
  };
  
  // Simple browser detection
  if (userAgent.indexOf('Chrome') > -1) {
    deviceInfo.browser = 'Chrome';
  } else if (userAgent.indexOf('Firefox') > -1) {
    deviceInfo.browser = 'Firefox';
  } else if (userAgent.indexOf('Safari') > -1) {
    deviceInfo.browser = 'Safari';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    deviceInfo.browser = 'Internet Explorer';
  } else if (userAgent.indexOf('Edge') > -1) {
    deviceInfo.browser = 'Edge';
  }
  
  // Simple OS detection
  if (userAgent.indexOf('Windows') > -1) {
    deviceInfo.os = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    deviceInfo.os = 'macOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    deviceInfo.os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    deviceInfo.os = 'Android';
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    deviceInfo.os = 'iOS';
  }
  
  // Device type detection
  if (userAgent.indexOf('Mobile') > -1 || userAgent.indexOf('Android') > -1 && userAgent.indexOf('Mozilla/5.0') > -1) {
    deviceInfo.device = 'Mobile';
  } else if (userAgent.indexOf('iPad') > -1) {
    deviceInfo.device = 'Tablet';
  } else {
    deviceInfo.device = 'Desktop';
  }
  
  return deviceInfo;
}

// Validate admin credentials and request OTP
export async function validateAdminCredentials(email: string, username: string, password: string): Promise<{
  success: boolean;
  message: string;
  expiresIn?: number;
}> {
  try {
    const deviceInfo = getDeviceInfo();
    
    const response = await axios.post(`${API_BASE_URL}/api/admin/validate-credentials`, {
      email,
      username,
      password,
      deviceInfo
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating admin credentials:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Authentication failed'
      };
    }
    return {
      success: false,
      message: 'Network error, please try again'
    };
  }
}

// Verify OTP and complete login
export async function verifyAdminOTP(email: string, otp: string): Promise<{
  success: boolean;
  message: string;
  token?: string;
  admin?: {
    email: string;
    username: string;
  };
}> {
  try {
    const deviceInfo = getDeviceInfo();
    
    const response = await axios.post(`${API_BASE_URL}/api/admin/verify-otp`, {
      email,
      otp,
      deviceInfo
    });
    
    if (response.data.success && response.data.token) {
      // Store authentication data
      const authData: AdminAuth = {
        isAuthenticated: true,
        username: response.data.admin.username,
        email: response.data.admin.email,
        token: response.data.token
      };
      
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authData));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Verification failed'
      };
    }
    return {
      success: false,
      message: 'Network error, please try again'
    };
  }
}

// Logout admin
export function adminLogout(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY);
} 