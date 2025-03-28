import { adminEmails, OTP_LENGTH, ADMIN_USERNAME, ADMIN_PASSWORD_HASH } from '../config/index.js';
import bcrypt from 'bcrypt';

// Generate a random OTP
export function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// Validate admin email
export function validateAdminEmail(email) {
  return adminEmails.includes(email);
}

// Validate admin credentials (username, password)
export async function validateAdminCredentials(username, password) {
  try {
    // Check if username matches
    if (username !== ADMIN_USERNAME) {
      return { valid: false, reason: 'Invalid username' };
    }
    
    // If no password hash is set, reject all login attempts
    if (!ADMIN_PASSWORD_HASH) {
      console.error('Admin password hash not set in .env file');
      return { valid: false, reason: 'Admin password not configured' };
    }
    
    // Verify the password against the stored hash
    const passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!passwordValid) {
      return { valid: false, reason: 'Invalid password' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating admin credentials:', error);
    return { valid: false, reason: 'Authentication error' };
  }
}

// Store active OTPs with expiry times
export const activeOTPs = new Map();

// Set OTP for an email
export function setOTP(email, otp, expiryMinutes = 10) {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
  
  activeOTPs.set(email, {
    otp,
    expiryTime,
  });
}

// Verify OTP for an email
export function verifyOTP(email, otp) {
  if (!activeOTPs.has(email)) {
    return { valid: false, reason: 'No OTP requested for this email' };
  }
  
  const otpData = activeOTPs.get(email);
  const now = new Date();
  
  if (now > otpData.expiryTime) {
    // Clean up expired OTP
    activeOTPs.delete(email);
    return { valid: false, reason: 'OTP expired' };
  }
  
  if (otpData.otp !== otp) {
    return { valid: false, reason: 'Invalid OTP' };
  }
  
  // Clean up used OTP
  activeOTPs.delete(email);
  return { valid: true };
}

export default {
  generateOTP,
  validateAdminEmail,
  validateAdminCredentials,
  setOTP,
  verifyOTP,
}; 