#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function updateAdminEmails() {
  try {
    console.log('Admin Email Configuration Update Tool');
    console.log('====================================');
    
    // Load current .env file
    const envPath = path.resolve(rootDir, '.env');
    let envContent;
    
    try {
      envContent = await fs.readFile(envPath, 'utf8');
      console.log('Current .env file loaded');
    } catch (err) {
      console.log('No .env file found, creating a new one');
      envContent = '';
    }
    
    // Parse current env
    const envConfig = dotenv.parse(envContent);
    
    // Get current admin emails
    const currentAdminEmails = envConfig.ADMIN_EMAILS || '';
    console.log(`Current admin emails: ${currentAdminEmails || 'None'}`);
    
    // Ask for new admin emails
    const newAdminEmails = await promptUser('Enter new admin emails (comma-separated): ');
    
    // Update env config
    envConfig.ADMIN_EMAILS = newAdminEmails;
    
    // Convert back to env file format
    const newEnvContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Write back to .env file
    await fs.writeFile(envPath, newEnvContent);
    
    console.log('====================================');
    console.log(`Admin emails updated to: ${newAdminEmails}`);
    console.log('Configuration saved to .env file');
    
  } catch (error) {
    console.error('Error updating admin emails:', error);
  } finally {
    rl.close();
  }
}

updateAdminEmails(); 