import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

// Setup email configuration
router.post('/email-config', async (req, res) => {
  try {
    const { email, password, adminEmails } = req.body;
    
    if (!email || !password || !adminEmails || !adminEmails.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and at least one admin email are required' 
      });
    }
    
    // Validate the email credentials by creating a test transporter
    const testTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });
    
    // Verify connection
    try {
      await new Promise((resolve, reject) => {
        testTransporter.verify((error, success) => {
          if (error) {
            console.error('Email verification failed:', error);
            reject(error);
          } else {
            console.log('Email credentials verified successfully');
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email verification failed. Please check your credentials.',
        error: verifyError.message
      });
    }
    
    // Read the current .env file
    const envPath = path.resolve(rootDir, '.env');
    let envContent;
    
    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch (fileError) {
      console.error('Error reading .env file:', fileError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error reading configuration file',
        error: fileError.message
      });
    }
    
    // Update the email-related environment variables
    const updatedEnvContent = envContent
      .replace(/^EMAIL_USER=.*$/m, `EMAIL_USER=${email}`)
      .replace(/^EMAIL_PASS=.*$/m, `EMAIL_PASS=${password}`)
      .replace(/^EMAIL_PASSWORD=.*$/m, `EMAIL_PASSWORD=${password}`)
      .replace(/^ADMIN_EMAILS=.*$/m, `ADMIN_EMAILS=${adminEmails.join(', ')}`);
    
    // Write the updated .env file
    try {
      await fs.writeFile(envPath, updatedEnvContent, 'utf8');
      console.log('Email configuration updated in .env file');
      
      // Reload environment variables
      dotenv.config({ path: envPath });
      
      return res.json({ 
        success: true, 
        message: 'Email configuration set up successfully' 
      });
    } catch (writeError) {
      console.error('Error writing .env file:', writeError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error updating configuration file',
        error: writeError.message
      });
    }
  } catch (error) {
    console.error('Error setting up email configuration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router; 