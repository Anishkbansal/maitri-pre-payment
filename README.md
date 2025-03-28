# Maitri Wellness Center - Web Application

This application is for the Maitri Wellness Center, featuring product sales and gift card purchases with integrated payment processing.

## Features

- Product shop with checkout functionality
- Gift card purchase system
- Stripe payment integration (credit and debit cards)
- Klarna payment option for flexible payments (orders over £3)
- Email confirmation system
- Responsive design for all devices

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory with these variables:

```
# Server configuration
PORT=3001

# Email configuration (for order confirmation emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # For Gmail, use an App Password, not your regular password
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Stripe API keys (Test mode)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Klarna configuration
VITE_ENABLE_KLARNA=true
VITE_KLARNA_MIN_AMOUNT=300
```
Note: KLARNA_MIN_AMOUNT is in pence (300 = £3)

### Running the Application

1. Start the server:
   ```
  npm run server
  ```

2. In a separate terminal, start the client:
   ```
   npm run dev
   ```

3. Access the application at http://localhost:5173 (or the port shown in your terminal)

## Testing the Checkout Process

### Testing Credit/Debit Card Payments

Both credit and debit cards use the same test card numbers in Stripe's test mode. The system doesn't distinguish between them - Stripe accepts both types with the same card element.

1. Go to the Shop page and add products to your cart
2. Proceed to checkout and fill out all required fields
3. For payment testing, use these Stripe test cards:

   **For successful payments (credit or debit):**
   - Card Number: `4242 4242 4242 4242`
   - Expiration: Any future date (e.g., 12/28)
   - CVC: Any 3 digits (e.g., 123)
   - Name: Must match the name you entered in checkout

   **For declined payments (test failure scenario):**
   - Card Number: `4000 0000 0000 0002`
   - Expiration: Any future date
   - CVC: Any 3 digits

   **For 3D Secure authentication:**
   - Card Number: `4000 0000 0000 3063`
   - Use code `123456` when prompted for verification

4. Your shipping address information will automatically be used for the billing address

### Testing Klarna Payments

Klarna is only available for orders over £3 (300 pence) when shipping to supported countries.

1. Ensure your cart total is above £3
2. At checkout, select a supported country (UK, US, Germany, etc.)
   - For UK, use the country code "GB" or select "United Kingdom"
   - For US, select "United States"
   - For Germany, select "Germany" or "DE"
3. Complete the shipping and personal information
4. On the payment screen, select "Pay with Klarna"
   - Note: If Klarna isn't visible, check that:
     - Your order total is over £3
     - You've selected a supported country
     - VITE_ENABLE_KLARNA=true in your .env file
5. Click the Klarna payment button
6. You'll be redirected to Klarna's test environment
7. Follow these steps in the Klarna test environment:
   - Enter any personal details (use test data)
   - For verification codes, always use `123456`
   - Select "Pay Now" option for UK orders
   - Follow the on-screen instructions
   - After completing the Klarna flow, you'll return to the shop

## Klarna Configuration

Klarna payments are only offered when:
1. The order total is over £3 (controlled by VITE_KLARNA_MIN_AMOUNT in .env)
2. The customer's country is supported by Klarna
3. VITE_ENABLE_KLARNA is set to true in the .env file

Supported countries include:
- United Kingdom (GB)
- United States (US)
- Germany (DE)
- Spain (ES)
- Sweden (SE)
- Italy (IT)
- Austria (AT)
- Belgium (BE)
- Denmark (DK)
- Finland (FI)
- Netherlands (NL)
- Norway (NO)

## Common Issues and Troubleshooting

### Card Payment Issues

1. **"Card declined" error**
   - Check you're using the correct test card number
   - Ensure the cardholder name matches your checkout name
   - Verify you're in test mode with test Stripe keys

2. **"Invalid card number" error**
   - Ensure you're entering the number without spaces or dashes
   - Try a different test card number

3. **Card elements not loading**
   - Check your browser console for errors
   - Verify your Stripe public key is correctly set in the `.env` file

### Klarna Payment Issues

1. **Klarna not appearing as an option**
   - Verify your order total exceeds £3
   - Check you've selected a Klarna-supported country
   - Ensure VITE_ENABLE_KLARNA=true in your .env file
   - Check the browser console for any Klarna-related errors

2. **Country not recognized for Klarna**
   - For UK, make sure to use "United Kingdom" or "GB" 
   - Check the server logs to see if the country code is being properly detected
   - Verify the country is in the supported list

3. **Redirect issues with Klarna**
   - Klarna requires a secure return URL in production
   - In test mode, ensure you're staying on the same device/browser

4. **Klarna verification failing**
   - Always use '123456' for any verification codes in test mode
   - For phone verification, use any valid phone format

### Email Sending Issues

1. **Confirmation emails not being sent**
   - Verify email credentials are correct in the .env file
   - For Gmail, ensure you're using an App Password if 2FA is enabled
   - Check server logs for SMTP error messages
   - Make sure you use EMAIL_PASS (not EMAIL_PASSWORD) in your .env file
   
2. **Testing Email Configuration**
   - To test if your email configuration is working correctly, visit:
     ```
     http://localhost:3001/api/payments/test-email
     ```
   - This endpoint will attempt to send a test email and return detailed information about your email configuration
   - If the test fails, check your .env file and email service settings

## Development Guidelines

- Follow the existing code style and patterns
- Use TypeScript for type safety
- Test all changes thoroughly before deployment

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Email Configuration

The application uses Gmail for sending emails. To configure email functionality:

1. Set these environment variables in your `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAILS=admin1@example.com,admin2@example.com
   ```

2. For Gmail, you need to use an App Password rather than your regular password:
   - Go to your Google Account → Security
   - Enable 2-Step Verification if not already enabled
   - Under "App passwords", create a new app password for this application
   - Use this generated password as your EMAIL_PASS

### Troubleshooting Email Issues

If emails are not being sent:

1. Check the server logs for specific error messages
2. Verify your email credentials in the `.env` file are correct
3. Make sure your Gmail account has "Less secure app access" enabled or you're using an App Password
4. Test the email functionality using these endpoints:
   - `GET /api/payments/test-email` - Tests basic email functionality
   - `GET /api/payments/test-order-email` - Tests order confirmation emails

## Stripe Integration

To configure Stripe for payment processing:

1. Set these environment variables in your `.env` file:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   VITE_ENABLE_KLARNA=true
   VITE_KLARNA_MIN_AMOUNT=3
   ```

2. For testing Stripe:
   - Use test card number: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code

3. For testing Klarna:
   - Enter "United Kingdom" as country
   - Ensure order amount is at least £3 