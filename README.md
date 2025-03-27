# Maitri Gift Card Application

A React TypeScript application for managing gift cards, with features for customers to purchase gift cards and administrators to manage them.

## Features

- **Customer Features**
  - Purchase gift cards with customizable amounts and recipient information
  - Send gift cards via email to recipients
  - Responsive UI for mobile and desktop

- **Admin Features**
  - Dashboard for managing gift cards
  - View, filter, and search gift cards
  - Update gift card amounts and statuses
  - Close gift cards when exhausted
  - Receive notifications about gift card activities

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Email**: Nodemailer
- **Database**: File-based JSON storage

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd maitri-gift-card
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file
   ```bash
   cp .env.example .env
   ```

4. Configure the `.env` file with your settings
   - Set up email provider details
   - Configure admin email addresses
   - Set other necessary environment variables

### Running the Application

- **Development mode (both server and client)**
  ```bash
  npm start
  ```

- **Development mode (client only)**
  ```bash
  npm run dev
  ```

- **Run server only**
  ```bash
  npm run server
  ```

- **Build for production**
  ```bash
  npm run build
  ```

## Usage

### Customer Interface

- Access the customer interface at `http://localhost:5173/`
- Navigate to the Gift Cards page to purchase gift cards
- Fill out the gift card form with recipient details and customize your gift card

### Admin Interface

- Access the admin interface at `http://localhost:5173/admin/gift-cards`
- Use the filter and search functionality to find specific gift cards
- Update gift card amounts or mark them as exhausted
- Track gift card history and status changes

## Database Management

The application uses file-based JSON databases:
- `giftcards_db.json`: Stores gift card data
- `products_db.json`: Stores product information

If you encounter data inconsistencies, you can run the fix script:
```bash
node fix-gift-card-data.js
```

## Troubleshooting

- **Email Sending Issues**: Verify your SMTP settings in the .env file
- **Database Errors**: Check file permissions for the JSON database files
- **Server Not Starting**: Ensure the port (default 3001) is not in use

## License

[Add License Information]

## Contributing

[Add Contributing Guidelines] 