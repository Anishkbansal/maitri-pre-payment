// Admin login OTP email template
export function getAdminLoginOTPEmailTemplate(email, otp, deviceInfo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Login OTP</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .email-container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin-top: 20px;
        }
        .header {
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #3f51b5;
          margin: 0;
        }
        .otp-box {
          background-color: #f5f5f5;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #3f51b5;
        }
        .expiry-note {
          margin-top: 10px;
          font-size: 14px;
          color: #757575;
        }
        .device-info {
          background-color: #fff9c4;
          border-left: 4px solid #fbc02d;
          padding: 15px;
          margin: 20px 0;
        }
        .warning {
          color: #d32f2f;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Admin Login Verification</h1>
        </div>
        
        <p>Hello,</p>
        
        <p>You are attempting to log in to the admin dashboard. To complete your login, please use the following OTP code:</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="expiry-note">This code will expire in 10 minutes.</div>
        </div>
        
        <div class="device-info">
          <p><strong>Login Attempt Details:</strong></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Browser:</strong> ${deviceInfo.browser || 'Unknown'}</p>
          <p><strong>Operating System:</strong> ${deviceInfo.os || 'Unknown'}</p>
          <p><strong>IP Address:</strong> ${deviceInfo.ip || 'Unknown'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p class="warning">If you did not attempt to log in, please ignore this email and contact the system administrator immediately as your account may be compromised.</p>
        
        <p>Thank you,</p>
        <p>Admin System</p>
        
        <div class="footer">
          <p>This is an automated security email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Admin login alert email template
export function getAdminLoginAlertEmailTemplate(loginData) {
  const loginStatus = loginData.success ? 
    { text: 'Successful Login', color: '#4caf50' } : 
    { text: 'Failed Login Attempt', color: '#f44336' };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin ${loginStatus.text}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .email-container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin-top: 20px;
        }
        .header {
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 20px;
        }
        .header h1 {
          color: ${loginStatus.color};
          margin: 0;
        }
        .login-details {
          background-color: #f5f5f5;
          border-left: 4px solid ${loginStatus.color};
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Admin ${loginStatus.text}</h1>
        </div>
        
        <p>This is an automated security alert for the admin dashboard.</p>
        
        <div class="login-details">
          <p><strong>Login Details:</strong></p>
          <p><strong>Email:</strong> ${loginData.email}</p>
          <p><strong>Status:</strong> ${loginStatus.text}</p>
          <p><strong>Time:</strong> ${new Date(loginData.timestamp).toLocaleString()}</p>
          <p><strong>Browser:</strong> ${loginData.deviceInfo.browser || 'Unknown'}</p>
          <p><strong>Operating System:</strong> ${loginData.deviceInfo.os || 'Unknown'}</p>
          <p><strong>IP Address:</strong> ${loginData.deviceInfo.ip || 'Unknown'}</p>
          ${loginData.success ? '' : `<p><strong>Reason:</strong> ${loginData.reason || 'Unknown error'}</p>`}
        </div>
        
        ${!loginData.success ? `
          <p style="color: #f44336; font-weight: bold;">
            If this was not you, please secure your account immediately and contact the system administrator.
          </p>
        ` : ''}
        
        <p>Thank you,</p>
        <p>Admin Security System</p>
        
        <div class="footer">
          <p>This is an automated security notification. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  getAdminLoginOTPEmailTemplate,
  getAdminLoginAlertEmailTemplate
}; 