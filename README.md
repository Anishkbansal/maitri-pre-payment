# Harmonizer E-commerce Website

This project is an e-commerce website for selling the Chakra Model Harmonizer product.

## Features

- Product showcase with detailed information
- Shopping cart functionality
- Checkout system with form validation
- Dynamic shipping cost (free for UK, £16 for international)
- Country and city selection with validation
- Order confirmation emails for customers and administrators
- Restricted countries shipping list

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the email service:
   - Create a `.env` file based on the `.env.example` file
   - Add your Gmail email address and app password
   - Add admin email addresses (comma-separated) to receive order notifications
4. Start the email server:
   ```
   node start-server.js
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Email Configuration

The application uses a server to send order confirmation emails to customers and notifications to administrators. You need to provide your email credentials in the `.env` file:

```
# Server Configuration
PORT=3001

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Admin Email Addresses (comma-separated)
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### App Password for Gmail

To use a Gmail account for sending emails, you need to create an app password:

1. Go to your Google Account (https://myaccount.google.com/)
2. Select Security
3. Under "Signing in to Google," select 2-Step Verification
4. At the bottom of the page, select App passwords
5. Enter a name to identify the app password (e.g., "Harmonizer Shop")
6. Select Generate
7. Use the generated 16-character code as the password in the `.env` file

## Development

### Project Structure

- `src/pages/` - Main application pages
- `src/components/` - Reusable React components
- `src/utils/` - Utility functions
- `server.js` - Express server for email functionality
- `.env` - Environment variables for email configuration

### API Endpoints

The server exposes the following API endpoint:

- `POST /api/send-order-emails` - Send order confirmation emails to customer and notifications to admins

## Customization

### Email Templates

Email templates can be customized in the `server.js` file:

- `getCustomerEmailTemplate` - Template for customer order confirmation emails
- `getAdminEmailTemplate` - Template for admin notification emails 