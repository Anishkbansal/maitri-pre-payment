import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

// Load environment variables
console.log('Loading environment variables from:', path.resolve(rootDir, '.env'));
const result = dotenv.config({ path: path.resolve(rootDir, '.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Debug environment variables
console.log('Environment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD ? '[PASSWORD SET]' : '[PASSWORD NOT SET]');
console.log('ADMIN_EMAILS:', process.env.ADMIN_EMAILS);
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME || '[NOT SET]');
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? '[HASH SET]' : '[HASH NOT SET]');

// Get admin emails from environment variable
export const adminEmails = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
  : [];

// Admin credentials
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Create email transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD
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

export const DB_PATH = path.join(rootDir, 'giftcards_db.json');
export const PRODUCTS_DB_PATH = path.join(rootDir, 'products_db.json');

// OTP related constants
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_LENGTH = 6;

export default {
  adminEmails,
  ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
  transporter,
  DB_PATH,
  PRODUCTS_DB_PATH,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
  rootDir
}; 