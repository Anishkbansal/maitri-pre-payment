// API Base URL - Change this to match your server URL when deployed
const API_BASE_URL = 'http://localhost:3001/api';

// Send order confirmation emails
export async function sendOrderEmails(orderData: {
  formData: any;
  quantity: number;
  totalPrice: number;
  isUKDelivery: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/send-order-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending order emails:', error);
    throw error;
  }
} 