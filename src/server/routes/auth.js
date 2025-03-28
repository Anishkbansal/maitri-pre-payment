import express from 'express';
import auth from '../auth/index.js';
import * as emailService from '../emails/index.js';
import { OTP_EXPIRY_MINUTES } from '../config/index.js';
import crypto from 'crypto';

const router = express.Router();

// Store active security tokens with their expiry
const securityTokens = new Map();

// API endpoint to validate admin credentials and send OTP
router.post('/validate-credentials', async (req, res) => {
  try {
    const { email, username, password, deviceInfo } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and password are required'
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
    
    // Validate username and password
    const credentialCheck = await auth.validateAdminCredentials(username, password);
    
    if (!credentialCheck.valid) {
      console.log(`Failed login attempt for ${email}: ${credentialCheck.reason}`);
      
      // Send login alert for failed attempt
      try {
        await emailService.sendAdminLoginAlertEmail({
          email,
          success: false,
          timestamp: new Date(),
          deviceInfo: deviceInfo || { browser: 'Unknown', os: 'Unknown', ip: 'Unknown' },
          reason: credentialCheck.reason
        });
      } catch (emailError) {
        console.error('Error sending login alert email:', emailError);
      }
      
      return res.status(401).json({
        success: false,
        message: credentialCheck.reason
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
        expiresIn: OTP_EXPIRY_MINUTES * 60 // Convert to seconds
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
      admin: {
        email,
        username: email.split('@')[0] // Use part before @ as the username
      }
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

// API endpoint to force logout all admins
router.get('/security/logout-all', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Security token is required'
      });
    }
    
    // Check if token exists and is valid
    if (!securityTokens.has(token)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired security token'
      });
    }
    
    const tokenData = securityTokens.get(token);
    
    // Check if token is already used
    if (tokenData.used) {
      return res.status(400).json({
        success: false,
        message: 'This security action has already been performed'
      });
    }
    
    // Check if token is expired
    if (new Date() > tokenData.expiryTime) {
      securityTokens.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Security token has expired'
      });
    }
    
    // Mark token as used
    tokenData.used = true;
    
    // Set global forced logout timestamp
    // This timestamp will be checked by clients to determine if they should logout
    global.FORCED_LOGOUT_TIMESTAMP = Date.now();
    
    console.log(`Force logout triggered at ${new Date().toISOString()} using token ${token}`);
    
    // Send response - HTML page with a message
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Security Action Confirmed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
          }
          .success-icon {
            color: #4caf50;
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #4caf50;
          }
          .action-button {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="success-icon">✓</div>
        <h1>Security Action Confirmed</h1>
        <p>All admin users have been logged out of the system.</p>
        <p>If you didn't request this action, please contact the system administrator immediately.</p>
        <a href="/admin/login" class="action-button">Return to Login</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error processing security logout:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the security request'
    });
  }
});

// API endpoint to check if there's been a forced logout
router.get('/check-forced-logout', (req, res) => {
  const forcedLogoutTimestamp = global.FORCED_LOGOUT_TIMESTAMP || 0;
  
  res.json({
    forcedLogout: forcedLogoutTimestamp > 0,
    timestamp: forcedLogoutTimestamp
  });
});

// Function to generate a security token for logout functionality
export function generateSecurityToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 24); // Token valid for 24 hours
  
  securityTokens.set(token, {
    expiryTime,
    used: false
  });
  
  return token;
}

export default router; 