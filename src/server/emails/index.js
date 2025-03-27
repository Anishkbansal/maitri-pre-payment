import { transporter } from '../config/index.js';
import * as giftCardEmails from './giftCardEmails.js';
import * as orderEmails from './orderEmails.js';
import * as authEmails from './authEmails.js';

// Send emails
export async function sendEmails(mailOptions) {
  // If mailOptions is an array, send all emails
  if (Array.isArray(mailOptions)) {
    const promises = mailOptions.map(option => sendSingleEmail(option));
    return Promise.all(promises);
  }
  
  // Otherwise, send a single email
  return sendSingleEmail(mailOptions);
}

// Send a single email
async function sendSingleEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
}

// Send gift card emails
export async function sendGiftCardEmails(giftCardData) {
  const emails = [];
  
  // Create email for buyer
  if (giftCardData.buyerEmail) {
    const buyerMailOptions = {
      from: process.env.EMAIL_USER,
      to: giftCardData.buyerEmail,
      subject: 'Your Gift Card Purchase',
      html: giftCardEmails.getGiftCardCustomerEmailTemplate(giftCardData)
    };
    emails.push(buyerMailOptions);
  }
  
  // Create email for recipient
  if (giftCardData.recipientEmail && giftCardData.recipientEmail !== giftCardData.buyerEmail) {
    const recipientMailOptions = {
      from: process.env.EMAIL_USER,
      to: giftCardData.recipientEmail,
      subject: 'You\'ve Received a Gift Card!',
      html: giftCardEmails.getGiftCardRecipientEmailTemplate(giftCardData)
    };
    emails.push(recipientMailOptions);
  }
  
  // Create email for admin
  if (process.env.ADMIN_EMAILS) {
    const adminEmails = process.env.ADMIN_EMAILS.split(',').map(email => email.trim());
    if (adminEmails.length > 0) {
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails.join(','),
        subject: 'New Gift Card Purchase - Admin Notification',
        html: giftCardEmails.getGiftCardAdminEmailTemplate(giftCardData)
      };
      emails.push(adminMailOptions);
    }
  }
  
  // Send all emails
  if (emails.length === 0) {
    console.log('No emails to send for gift card');
    return { success: true, message: 'No emails to send' };
  }
  
  try {
    await sendEmails(emails);
    return { success: true, message: `Sent ${emails.length} emails` };
  } catch (error) {
    console.error('Error sending gift card emails:', error);
    return { success: false, message: error.message };
  }
}

// Send gift card update email
export async function sendGiftCardUpdateEmail(giftCardData, updateType, updateDetails) {
  // Only send to buyer email
  if (!giftCardData.buyerEmail) {
    console.log('No buyer email to send update notification');
    return { success: true, message: 'No emails to send' };
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: giftCardData.buyerEmail,
    subject: `Gift Card Update - ${updateType === 'amount_update' ? 'Balance Updated' : 'Status Changed'}`,
    html: giftCardEmails.getGiftCardUpdateEmailTemplate(giftCardData, updateType, updateDetails)
  };
  
  try {
    await sendEmails(mailOptions);
    return { success: true, message: 'Sent update email to buyer' };
  } catch (error) {
    console.error('Error sending gift card update email:', error);
    return { success: false, message: error.message };
  }
}

// Send order confirmation emails
export async function sendOrderConfirmationEmails(orderData) {
  const emails = [];
  
  // Create email for customer
  if (orderData.customerEmail) {
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: orderData.customerEmail,
      subject: 'Order Confirmation',
      html: orderEmails.getCustomerEmailTemplate(orderData)
    };
    emails.push(customerMailOptions);
  }
  
  // Create email for admin
  if (process.env.ADMIN_EMAILS) {
    const adminEmails = process.env.ADMIN_EMAILS.split(',').map(email => email.trim());
    if (adminEmails.length > 0) {
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails.join(','),
        subject: 'New Order Notification',
        html: orderEmails.getAdminEmailTemplate(orderData)
      };
      emails.push(adminMailOptions);
    }
  }
  
  // Send all emails
  if (emails.length === 0) {
    console.log('No emails to send for order');
    return { success: true, message: 'No emails to send' };
  }
  
  try {
    await sendEmails(emails);
    return { success: true, message: `Sent ${emails.length} emails` };
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    return { success: false, message: error.message };
  }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(orderData) {
  // Only send to customer email
  if (!orderData.customerEmail) {
    console.log('No customer email to send status update');
    return { success: true, message: 'No emails to send' };
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: orderData.customerEmail,
    subject: `Order Status Update - ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`,
    html: orderEmails.getOrderStatusUpdateEmailTemplate(orderData)
  };
  
  try {
    await sendEmails(mailOptions);
    return { success: true, message: 'Sent status update email to customer' };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, message: error.message };
  }
}

// Send admin login OTP email
export async function sendAdminLoginOTPEmail(email, otp, deviceInfo) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Admin Login OTP Verification',
    html: authEmails.getAdminLoginOTPEmailTemplate(email, otp, deviceInfo)
  };
  
  try {
    await sendEmails(mailOptions);
    return { success: true, message: 'Sent OTP email to admin' };
  } catch (error) {
    console.error('Error sending admin login OTP email:', error);
    return { success: false, message: error.message };
  }
}

// Send admin login alert email
export async function sendAdminLoginAlertEmail(loginData) {
  // Send to all admin emails except the one logging in
  if (!process.env.ADMIN_EMAILS) {
    console.log('No admin emails configured for login alerts');
    return { success: true, message: 'No emails to send' };
  }
  
  const adminEmails = process.env.ADMIN_EMAILS
    .split(',')
    .map(email => email.trim())
    .filter(email => email !== loginData.email); // Don't send to the admin who's logging in
  
  if (adminEmails.length === 0) {
    console.log('No other admin emails to send login alert');
    return { success: true, message: 'No emails to send' };
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails.join(','),
    subject: `Admin ${loginData.success ? 'Login Success' : 'Login Attempt'} - ${loginData.email}`,
    html: authEmails.getAdminLoginAlertEmailTemplate(loginData)
  };
  
  try {
    await sendEmails(mailOptions);
    return { success: true, message: 'Sent login alert to admins' };
  } catch (error) {
    console.error('Error sending admin login alert email:', error);
    return { success: false, message: error.message };
  }
}

export default {
  sendEmails,
  sendGiftCardEmails,
  sendGiftCardUpdateEmail,
  sendOrderConfirmationEmails,
  sendOrderStatusUpdateEmail,
  sendAdminLoginOTPEmail,
  sendAdminLoginAlertEmail
}; 