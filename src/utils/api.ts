// API Base URL - Change this to match your server URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Export API_BASE_URL for use in other utilities
export { API_BASE_URL };

// Types
interface GiftCard {
  id: string;
  code: string;
  originalAmount: string | number;
  currentAmount: string | number;
  purchaseDate: string | null;
  expiryDate: string | null;
  [key: string]: any; // Allow for additional properties
}

// Setup email configuration
export async function setupEmailConfig(
  email: string,
  password: string,
  adminEmails: string[]
) {
  try {
    const response = await fetch(`${API_BASE_URL}/setup/email-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        adminEmails,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting up email configuration:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Send order confirmation emails
export async function sendOrderEmails(orderData: {
  formData: any;
  quantity: number;
  totalPrice: number;
  isUKDelivery: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/send-order-emails`, {
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

// Send gift card emails
export async function sendGiftCardEmails(orderData: {
  formData: any;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/send-gift-card-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending gift card emails:', error);
    throw error;
  }
}

// Gift Card Management API

// Get all gift cards
export async function getAllGiftCards() {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the response is ok
    if (!response.ok) {
      // Handle HTTP errors
      return {
        success: false,
        giftCards: [],
        message: `Failed to fetch gift cards: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    // Log the raw data for debugging
    console.log('Raw gift card data:', JSON.stringify(data, null, 2));
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        giftCards: [],
        message: 'Invalid response from server'
      };
    }
    
    // Transform the data to match component expectations
    const giftCards = data.data && Array.isArray(data.data) ? data.data.map((card: any) => {
      // Parse amounts as numbers to ensure they're treated correctly
      const originalAmount = parseFloat(card.originalAmount?.toString() || "0");
      const currentAmount = parseFloat(card.currentAmount?.toString() || "0");
      
      return {
        ...card,
        // Map field names to match component expectations
        id: card.id,
        code: card.code,
        amount: isNaN(originalAmount) ? 0 : originalAmount,
        balance: isNaN(currentAmount) ? 0 : currentAmount,
        createdAt: card.purchaseDate || null,
        expiresAt: card.expiryDate || null,
        buyerName: card.buyerName,
        buyerEmail: card.buyerEmail,
        recipientName: card.recipientName,
        recipientEmail: card.recipientEmail,
        status: card.status,
        message: card.message,
        history: card.history
      };
    }) : [];
    
    // Log the transformed data for debugging
    console.log('Transformed gift card data:', JSON.stringify(giftCards, null, 2));
    
    return {
      success: true,
      giftCards: giftCards,
      message: 'Gift cards fetched successfully'
    };
  } catch (error) {
    console.error('Error getting gift cards:', error);
    // Return a structured error instead of throwing
    return {
      success: false,
      giftCards: [],
      message: error instanceof Error ? error.message : 'Network error while fetching gift cards'
    };
  }
}

// Alias for getAllGiftCards for component consistency
export const fetchGiftCards = getAllGiftCards;

// Get gift card by ID
export async function getGiftCardById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-cards/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting gift card with ID ${id}:`, error);
    throw error;
  }
}

// Update gift card amount
export async function updateGiftCardAmount(id: string, amount: number, note?: string) {
  try {
    // Ensure amount is a valid number
    const numericAmount = parseFloat(amount.toString());
    if (isNaN(numericAmount)) {
      console.error('Invalid amount value:', amount);
      return {
        success: false,
        message: 'Invalid amount value, must be a number'
      };
    }
    
    // Map the field names for the server
    const payload = { 
      currentAmount: numericAmount, // Server expects currentAmount as a number
      note 
    };

    console.log('Sending update request with payload:', JSON.stringify(payload));

    const response = await fetch(`${API_BASE_URL}/gift-cards/${id}/amount`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to update gift card: ${response.status} ${response.statusText}`,
        details: errorText
      };
    }
    
    const data = await response.json();
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    // Transform response data to match component expectations
    const updatedGiftCard = data.data ? {
      ...data.data,
      amount: data.data.originalAmount,
      balance: data.data.currentAmount,
      createdAt: data.data.purchaseDate,
      expiresAt: data.data.expiryDate
    } : null;
    
    return {
      success: true,
      giftCard: updatedGiftCard,
      message: 'Gift card amount updated successfully'
    };
  } catch (error) {
    console.error(`Error updating gift card amount for ID ${id}:`, error);
    // Return a structured error instead of throwing
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error while updating gift card'
    };
  }
}

// Close gift card
export async function closeGiftCard(id: string, note?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-cards/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'closed', note }),
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to close gift card: ${response.status} ${response.statusText}`,
        details: errorText
      };
    }
    
    const data = await response.json();
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    // Transform response data to match component expectations
    const updatedGiftCard = data.data ? {
      ...data.data,
      amount: data.data.originalAmount,
      balance: data.data.currentAmount,
      createdAt: data.data.purchaseDate,
      expiresAt: data.data.expiryDate
    } : null;
    
    return {
      success: true,
      giftCard: updatedGiftCard,
      message: 'Gift card closed successfully'
    };
  } catch (error) {
    console.error(`Error closing gift card with ID ${id}:`, error);
    // Return a structured error instead of throwing
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error while closing gift card'
    };
  }
}

// Product Management API

// Get all products and orders
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the response is ok
    if (!response.ok) {
      return {
        success: false,
        products: [],
        orders: [],
        message: `Failed to fetch products: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    // Log the raw data for debugging
    console.log('Raw product data:', JSON.stringify(data, null, 2));
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        products: [],
        orders: [],
        message: 'Invalid response from server'
      };
    }
    
    // Transform the data if needed
    const products = data.data && data.data.products ? data.data.products : [];
    const orders = data.data && data.data.orders ? data.data.orders : [];
    
    return {
      success: true,
      products,
      orders,
      message: 'Products and orders fetched successfully'
    };
  } catch (error) {
    console.error('Error getting products:', error);
    // Return a structured error instead of throwing
    return {
      success: false,
      products: [],
      orders: [],
      message: error instanceof Error ? error.message : 'Network error while fetching products'
    };
  }
}

// Update product stock
export async function updateProductStock(productId: string, stock: number) {
  try {
    // Ensure stock is a valid number
    const numericStock = parseInt(stock.toString(), 10);
    if (isNaN(numericStock) || numericStock < 0) {
      console.error('Invalid stock value:', stock);
      return {
        success: false,
        message: 'Invalid stock value, must be a non-negative number'
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/products/product/${productId}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock: numericStock }),
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to update product stock: ${response.status} ${response.statusText}`,
        details: errorText
      };
    }
    
    const data = await response.json();
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    return {
      success: true,
      product: data.data || null,
      message: data.message || 'Product stock updated successfully'
    };
  } catch (error) {
    console.error(`Error updating product stock for ID ${productId}:`, error);
    // Return a structured error instead of throwing
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error while updating product stock'
    };
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: 'pending' | 'out_for_delivery' | 'completed') {
  try {
    const response = await fetch(`${API_BASE_URL}/products/order/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Failed to update order status: ${response.status} ${response.statusText}`,
        details: errorText
      };
    }
    
    const data = await response.json();
    
    // If the response doesn't match expected format, normalize it
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    return {
      success: true,
      order: data.data || null,
      message: data.message || 'Order status updated successfully'
    };
  } catch (error) {
    console.error(`Error updating order status for ID ${orderId}:`, error);
    // Return a structured error instead of throwing
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error while updating order status'
    };
  }
}