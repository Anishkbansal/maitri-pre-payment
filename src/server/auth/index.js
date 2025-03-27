import { adminEmails, OTP_LENGTH } from '../config/index.js';

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
  setOTP,
  verifyOTP,
}; 