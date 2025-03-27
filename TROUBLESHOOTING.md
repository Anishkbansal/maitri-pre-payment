# Troubleshooting Guide

This document provides solutions for common issues you might encounter while setting up or using the Maitri Gift Card Application.

## Server Issues

### Server Won't Start

1. **Port Already in Use**
   - Error: `EADDRINUSE: address already in use :::3001`
   - Solution: Change the PORT in your .env file or terminate the process using port 3001

2. **Missing .env File**
   - Error: `.env file not found`
   - Solution: Create a .env file based on the .env.example file

3. **Database Errors**
   - Error: `Error reading gift cards database`
   - Solution: Check file permissions for the database files or delete and let them be recreated

### Email Sending Failures

1. **Invalid Email Credentials**
   - Error: `Invalid login: 535-5.7.8 Username and Password not accepted`
   - Solution: Verify your EMAIL_USER and EMAIL_PASS in the .env file

2. **Missing Email Configuration**
   - Error: `Email configuration not found`
   - Solution: Ensure all email-related variables are set in the .env file

3. **Gmail Security Settings**
   - If using Gmail, ensure you're using an App Password, not your regular password
   - Enable "Less secure app access" or create an App Password in Google Account settings

## Client Issues

### Client Won't Start

1. **Node Modules Missing**
   - Error: `Cannot find module 'react'`
   - Solution: Run `npm install` to install all dependencies

2. **Port Conflict**
   - Error: `Port 5173 is already in use`
   - Solution: Kill the process using the port or use a different port with `npm run dev -- --port 3000`

### API Connection Issues

1. **CORS Errors**
   - Error: `Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`
   - Solution: Ensure the server has proper CORS configuration and that CLIENT_URL in .env matches your client's URL

2. **Network Errors**
   - Error: `Failed to fetch` or `Network Error`
   - Solution: Verify the server is running and API_URL in .env is correct

## Database Issues

### Gift Card Database Corruption

1. **Malformed JSON**
   - Error: `Unexpected token in JSON at position X`
   - Solution: Run the fix script: `node fix-gift-card-data.js`

2. **Missing Properties**
   - Error: `Cannot read property 'X' of undefined`
   - Solution: Run the fix script: `node fix-gift-card-data.js`

### Data Not Persisting

1. **File Permission Issues**
   - Error: `EACCES: permission denied`
   - Solution: Check file permissions for the database files

2. **Database Path Issues**
   - Solution: Verify the path settings in .env file (GIFTCARDS_DB_PATH and PRODUCTS_DB_PATH)

## Performance Issues

1. **Slow API Responses**
   - As the database files grow, operations may slow down
   - Consider implementing pagination for large datasets
   - Regularly backup and clean up old data

## Getting Additional Help

If you encounter issues not covered in this guide:

1. Check the server logs for more detailed error messages
2. Look for errors in the browser console
3. Ensure all npm packages are up to date: `npm update`
4. Submit an issue in the project repository with detailed steps to reproduce