import fs from 'fs';
import { PRODUCTS_DB_PATH } from '../config/index.js';

// Order Status Enum
export const OrderStatus = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Initialize product database
export function initializeProductDB() {
  if (!fs.existsSync(PRODUCTS_DB_PATH)) {
    const initialDB = {
      products: [],
      orders: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }

  try {
    const data = fs.readFileSync(PRODUCTS_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading product database:', error);
    const initialDB = {
      products: [],
      orders: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
}

// Save product database
export function saveProductDB(db) {
  db.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(db, null, 2));
}

// Generate a random order ID
export function generateOrderId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Add an order to the database
export function addOrder(orderData) {
  const db = initializeProductDB();
  
  // Validate product IDs and quantities
  for (const item of orderData.items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
    
    // Update product stock
    product.stock -= item.quantity;
  }
  
  const newOrder = {
    id: generateOrderId(),
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    items: orderData.items,
    total: orderData.total,
    status: OrderStatus.PENDING,
    orderDate: new Date().toISOString(),
    shippingAddress: orderData.shippingAddress,
    history: [
      {
        date: new Date().toISOString(),
        status: OrderStatus.PENDING,
        note: 'Order placed'
      }
    ]
  };
  
  db.orders.push(newOrder);
  saveProductDB(db);
  
  return newOrder;
}

// Get all products
export function getAllProducts() {
  const db = initializeProductDB();
  return db.products;
}

// Get all orders
export function getAllOrders() {
  const db = initializeProductDB();
  return db.orders;
}

// Get product by ID
export function getProductById(id) {
  const db = initializeProductDB();
  return db.products.find(product => product.id === id) || null;
}

// Get order by ID
export function getOrderById(id) {
  const db = initializeProductDB();
  return db.orders.find(order => order.id === id) || null;
}

// Update product stock
export function updateProductStock(id, newStock) {
  const db = initializeProductDB();
  const product = db.products.find(product => product.id === id);
  
  if (!product) {
    return null;
  }
  
  product.stock = newStock;
  saveProductDB(db);
  return product;
}

// Update order status
export function updateOrderStatus(id, newStatus, note = '') {
  const db = initializeProductDB();
  const order = db.orders.find(order => order.id === id);
  
  if (!order) {
    return null;
  }
  
  const previousStatus = order.status;
  order.status = newStatus;
  
  order.history.push({
    date: new Date().toISOString(),
    status: newStatus,
    note: note || `Status changed from ${previousStatus} to ${newStatus}`
  });
  
  saveProductDB(db);
  return order;
}

export default {
  OrderStatus,
  initializeProductDB,
  saveProductDB,
  generateOrderId,
  addOrder,
  getAllProducts,
  getAllOrders,
  getProductById,
  getOrderById,
  updateProductStock,
  updateOrderStatus
}; 