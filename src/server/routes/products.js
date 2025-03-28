import express from 'express';
import productsDb from '../db/products.js';
import * as emailService from '../emails/index.js';

const router = express.Router();

// Get all products and orders
router.get('/', (req, res) => {
  try {
    const products = productsDb.getAllProducts();
    const orders = productsDb.getAllOrders();
    
    res.status(200).json({
      success: true,
      data: {
        products,
        orders
      }
    });
  } catch (error) {
    console.error('Error fetching products and orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products and orders',
      error: error.message
    });
  }
});

// Get product by ID
router.get('/product/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = productsDb.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Update product stock
router.put('/product/:id/stock', (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        message: 'Stock value is required'
      });
    }
    
    // Parse the stock value if it's a string
    const stockValue = parseInt(stock, 10);
    
    if (isNaN(stockValue) || stockValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock value. Stock must be a non-negative number.'
      });
    }
    
    const updatedProduct = productsDb.updateProductStock(id, stockValue);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product stock updated successfully'
    });
  } catch (error) {
    console.error(`Error updating product ${req.params.id} stock:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product stock',
      error: error.message
    });
  }
});

// Get order by ID
router.get('/order/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = productsDb.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(`Error fetching order ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status
router.put('/order/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Validate the status
    const validStatuses = Object.values(productsDb.OrderStatus);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }
    
    const updatedOrder = productsDb.updateOrderStatus(id, status, note);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Send email notification
    try {
      await emailService.sendOrderStatusUpdateEmail(updatedOrder);
    } catch (emailError) {
      console.error('Error sending order status update email:', emailError);
      // Continue with the response even if email fails
    }
    
    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error(`Error updating order ${req.params.id} status:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Send order confirmation emails
router.post('/send-order-emails', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    const requiredFields = ['orderId', 'customerName', 'customerEmail', 'items', 'total', 'orderDate', 'shippingAddress'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email service not configured, skipping email sending');
      return res.status(200).json({
        success: true,
        message: 'Email service not configured, skipping email sending'
      });
    }
    
    // Send emails
    const result = await emailService.sendOrderConfirmationEmails(orderData);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation emails',
      error: error.message
    });
  }
});

export default router; 