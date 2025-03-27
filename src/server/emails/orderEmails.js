// Customer email template
export function getCustomerEmailTemplate(orderData) {
  // Format the total price with 2 decimal places
  const formattedTotal = parseFloat(orderData.total).toFixed(2);
  
  // Create an HTML list of items
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Confirmation</title>
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
          color: #4CAF50;
          margin: 0;
        }
        .order-details {
          margin-bottom: 20px;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .order-table th {
          background-color: #f0f0f0;
          padding: 10px;
          text-align: left;
        }
        .order-table .total-row td {
          font-weight: bold;
          border-top: 2px solid #ddd;
        }
        .shipping-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
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
          <h1>Order Confirmation</h1>
        </div>
        
        <p>Dear ${orderData.customerName},</p>
        
        <p>Thank you for your order! We are pleased to confirm that your order has been received and is being processed.</p>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
        </div>
        
        <h3>Order Summary</h3>
        <table class="order-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr class="total-row">
              <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">$${formattedTotal}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="shipping-info">
          <h3>Shipping Information</h3>
          <p>${orderData.shippingAddress.name}</p>
          <p>${orderData.shippingAddress.street}</p>
          <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}</p>
          <p>${orderData.shippingAddress.country}</p>
        </div>
        
        <p>We will notify you when your order has been shipped. If you have any questions about your order, please contact our customer service team.</p>
        
        <p>Thank you for shopping with us!</p>
        
        <p>Best regards,<br>The Team</p>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Admin email template
export function getAdminEmailTemplate(orderData) {
  // Format the total price with 2 decimal places
  const formattedTotal = parseFloat(orderData.total).toFixed(2);
  
  // Create an HTML list of items
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>New Order Notification</title>
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
          color: #2196F3;
          margin: 0;
        }
        .customer-info {
          margin-bottom: 20px;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .order-table th {
          background-color: #f0f0f0;
          padding: 10px;
          text-align: left;
        }
        .order-table .total-row td {
          font-weight: bold;
          border-top: 2px solid #ddd;
        }
        .shipping-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .action-required {
          background-color: #fff9c4;
          border-left: 4px solid #fbc02d;
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
          <h1>New Order Notification</h1>
        </div>
        
        <p>A new order has been placed. Here are the details:</p>
        
        <div class="customer-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        </div>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()} ${new Date(orderData.orderDate).toLocaleTimeString()}</p>
        </div>
        
        <h3>Order Summary</h3>
        <table class="order-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr class="total-row">
              <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">$${formattedTotal}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="shipping-info">
          <h3>Shipping Information</h3>
          <p>${orderData.shippingAddress.name}</p>
          <p>${orderData.shippingAddress.street}</p>
          <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}</p>
          <p>${orderData.shippingAddress.country}</p>
        </div>
        
        <div class="action-required">
          <p><strong>⚠️ Action Required:</strong></p>
          <p>Please process this order and update its status in the admin dashboard.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated system notification. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Order status update email template
export function getOrderStatusUpdateEmailTemplate(orderData) {
  let statusColor;
  let statusMessage;
  
  switch (orderData.status) {
    case 'shipped':
      statusColor = '#2196F3'; // Blue
      statusMessage = 'Your order has been shipped and is on its way to you!';
      break;
    case 'delivered':
      statusColor = '#4CAF50'; // Green
      statusMessage = 'Your order has been delivered. We hope you enjoy your purchase!';
      break;
    case 'cancelled':
      statusColor = '#F44336'; // Red
      statusMessage = 'Your order has been cancelled as requested.';
      break;
    default:
      statusColor = '#FF9800'; // Orange/Amber
      statusMessage = `Your order status has been updated to: ${orderData.status}`;
  }
  
  // Create an HTML list of items
  const itemsHtml = orderData.items.map(item => `
    <li style="margin-bottom: 5px;">${item.quantity} x ${item.name}</li>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Status Update</title>
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
          color: ${statusColor};
          margin: 0;
        }
        .status-box {
          background-color: #f9f9f9;
          border-left: 4px solid ${statusColor};
          padding: 15px;
          margin: 20px 0;
        }
        .order-details {
          margin-bottom: 20px;
        }
        .items-list {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
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
          <h1>Order Status Update</h1>
        </div>
        
        <p>Dear ${orderData.customerName},</p>
        
        <div class="status-box">
          <p style="font-size: 18px; font-weight: bold;">${statusMessage}</p>
        </div>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> ${orderData.id}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
          <p><strong>Current Status:</strong> ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}</p>
        </div>
        
        <h3>Order Summary</h3>
        <div class="items-list">
          <ul>
            ${itemsHtml}
          </ul>
          <p style="margin-top: 15px; font-weight: bold;">Total: $${parseFloat(orderData.total).toFixed(2)}</p>
        </div>
        
        ${orderData.status === 'shipped' ? `
          <div style="margin-top: 20px;">
            <h3>Shipping Information</h3>
            <p>${orderData.shippingAddress.name}</p>
            <p>${orderData.shippingAddress.street}</p>
            <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}</p>
            <p>${orderData.shippingAddress.country}</p>
          </div>
        ` : ''}
        
        <p>If you have any questions about your order, please contact our customer service team.</p>
        
        <p>Thank you for shopping with us!</p>
        
        <p>Best regards,<br>The Team</p>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  getCustomerEmailTemplate,
  getAdminEmailTemplate,
  getOrderStatusUpdateEmailTemplate
}; 