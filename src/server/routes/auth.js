import express from 'express';
import auth from '../auth/index.js';
import emailService from '../emails/index.js';
import { OTP_EXPIRY_MINUTES } from '../config/index.js';

const router = express.Router();

// API endpoint to validate admin credentials and send OTP
router.post('/validate-credentials', async (req, res) => {
  try {
    const { email, deviceInfo } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Validate that the email is authorized as admin
    const isAdmin = auth.validateAdminEmail(email);
    
    if (!isAdmin) {
      console.log(`Failed login attempt for unauthorized email: ${email}`);
      
      // Send login alert for failed attempt
      try {
        await emailService.sendAdminLoginAlertEmail({
          email,
          success: false,
          timestamp: new Date(),
          deviceInfo: deviceInfo || { browser: 'Unknown', os: 'Unknown', ip: 'Unknown' },
          reason: 'Email not authorized as admin'
        });
      } catch (emailError) {
        console.error('Error sending login alert email:', emailError);
      }
      
      return res.status(401).json({
        success: false,
        message: 'Email not authorized for admin access'
      });
    }
    
    // Generate OTP for this admin
    const otp = auth.generateOTP();
    
    // Store OTP with expiry time
    auth.setOTP(email, otp, OTP_EXPIRY_MINUTES);
    
    // Send OTP via email
    try {
      await emailService.sendAdminLoginOTPEmail(
        email, 
        otp, 
        deviceInfo || { browser: 'Unknown', os: 'Unknown', ip: 'Unknown' }
      );
      
      res.status(200).json({
        success: true,
        message: 'OTP sent to email',
        expiresInMinutes: OTP_EXPIRY_MINUTES
      });
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (error) {
    console.error('Error validating admin credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// API endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, deviceInfo } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    // Verify the OTP
    const verification = auth.verifyOTP(email, otp);
    
    if (!verification.valid) {
      console.log(`Failed OTP verification for ${email}: ${verification.reason}`);
      
      // Send login alert for failed attempt
      try {
        await emailService.sendAdminLoginAlertEmail({
          email,
          success: false,
          timestamp: new Date(),
          deviceInfo: deviceInfo || { browser: 'Unknown', os: 'Unknown', ip: 'Unknown' },
          reason: verification.reason
        });
      } catch (emailError) {
        console.error('Error sending login alert email:', emailError);
      }
      
      return res.status(401).json({
        success: false,
        message: verification.reason
      });
    }
    
    // Generate a session token (in a real app, this would be a JWT or other secure token)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    // Send login success alert
    try {
      await emailService.sendAdminLoginAlertEmail({
        email,
        success: true,
        timestamp: new Date(),
        deviceInfo: deviceInfo || { browser: 'Unknown', os: 'Unknown', ip: 'Unknown' }
      });
    } catch (emailError) {
      console.error('Error sending login alert email:', emailError);
      // Continue even if alert email fails
    }
    
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      email,
      loginTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router; 