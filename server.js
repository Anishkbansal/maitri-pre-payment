import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
console.log('Loading environment variables from:', path.resolve(__dirname, '.env'));
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Debug environment variables
console.log('Environment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[PASSWORD SET]' : '[PASSWORD NOT SET]');
console.log('ADMIN_EMAILS:', process.env.ADMIN_EMAILS);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get admin emails from environment variable
const adminEmails = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
  : [];

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // This should be an app password for Gmail
  }
});

// Test email connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email server connection error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Customer email template
function getCustomerEmailTemplate(orderData) {
  const { formData, quantity, totalPrice, shippingCost, subtotal, isUKDelivery } = orderData;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p style="font-size: 16px; color: #666;">Thank you for your order!</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Order Details</h2>
        <p><strong>Order Number:</strong> ${Date.now()}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Product:</strong> Chakra Model Harmonizer</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Subtotal:</strong> £${subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${isUKDelivery ? '£0.00 (Free)' : `£${shippingCost.toFixed(2)}`}</p>
        <p><strong>Total:</strong> £${totalPrice.toFixed(2)}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Shipping Information</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Address:</strong> ${formData.address}</p>
        <p><strong>City:</strong> ${formData.city}</p>
        ${formData.state ? `<p><strong>State/Province:</strong> ${formData.state}</p>` : ''}
        <p><strong>Postal Code:</strong> ${formData.postcode}</p>
        <p><strong>Country:</strong> ${formData.country}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Contact Information</h2>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">If you have any questions about your order, please contact our customer service team.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Harmonizer. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Admin email template
function getAdminEmailTemplate(orderData) {
  const { formData, quantity, totalPrice, shippingCost, subtotal, isUKDelivery } = orderData;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333;">New Order Received</h1>
        <p style="font-size: 16px; color: #666;">A new order has been placed</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Order Details</h2>
        <p><strong>Order Number:</strong> ${Date.now()}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Product:</strong> Chakra Model Harmonizer</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Subtotal:</strong> £${subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${isUKDelivery ? '£0.00 (Free)' : `£${shippingCost.toFixed(2)}`}</p>
        <p><strong>Total:</strong> £${totalPrice.toFixed(2)}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Customer Information</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Shipping Information</h2>
        <p><strong>Address:</strong> ${formData.address}</p>
        <p><strong>City:</strong> ${formData.city}</p>
        ${formData.state ? `<p><strong>State/Province:</strong> ${formData.state}</p>` : ''}
        <p><strong>Postal Code:</strong> ${formData.postcode}</p>
        <p><strong>Country:</strong> ${formData.country}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">Payment Information</h2>
        <p><strong>Card Number:</strong> **** **** **** ${formData.cardNumber.slice(-4)}</p>
        <p><strong>Cardholder Name:</strong> ${formData.cardName}</p>
      </div>
    </div>
  `;
}

// Send emails
app.post('/api/send-order-emails', async (req, res) => {
  try {
    const { formData, quantity, totalPrice, isUKDelivery } = req.body;
    const shippingCost = isUKDelivery ? 0 : 16;
    const subtotal = totalPrice - (isUKDelivery ? 0 : shippingCost);
    
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email configuration is missing. Please check .env file.' 
      });
    }

    // Order data for email templates
    const orderData = {
      formData,
      quantity,
      totalPrice,
      shippingCost,
      subtotal,
      isUKDelivery
    };

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Your Order Confirmation - Harmonizer',
      html: getCustomerEmailTemplate(orderData)
    });

    // Send emails to admins if configured
    if (adminEmails.length > 0) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmails.join(', '),
        subject: 'New Order Received - Harmonizer',
        html: getAdminEmailTemplate(orderData)
      });
    }

    res.status(200).json({ success: true, message: 'Order confirmation emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ success: false, message: `Error sending emails: ${error.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
  console.log(`Admin emails: ${adminEmails.length > 0 ? adminEmails.join(', ') : 'None configured'}`);
}); 