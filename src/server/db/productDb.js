import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database path from environment variable or use default
const dbPath = process.env.PRODUCTS_DB_PATH || 
  path.join(path.resolve(__dirname, '../../../'), 'products_db.json');

// Default products data
const defaultProducts = {
  products: [
    {
      id: "product-1",
      name: "Sample Product",
      description: "This is a sample product for demonstration purposes.",
      price: 19.99,
      image: "/images/sample-product.jpg",
      category: "Sample",
      createdAt: new Date().toISOString()
    }
  ]
};

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  console.log(`Creating products database at ${dbPath}`);
  fs.writeFileSync(dbPath, JSON.stringify(defaultProducts, null, 2));
}

// Read the products database
export const readProductsDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products database:', error);
    return { products: [] };
  }
};

// Write to the products database
export const writeProductsDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to products database:', error);
    return false;
  }
};

// Get all products
export const getAllProducts = () => {
  const db = readProductsDb();
  return db.products || [];
};

// Get a product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(product => product.id === id);
};

// Add a new product
export const addProduct = (productData) => {
  const db = readProductsDb();
  db.products = db.products || [];
  db.products.push(productData);
  return writeProductsDb(db);
};

// Update a product
export const updateProduct = (id, updatedData) => {
  const db = readProductsDb();
  db.products = db.products || [];
  
  const index = db.products.findIndex(product => product.id === id);
  if (index === -1) return false;
  
  db.products[index] = { ...db.products[index], ...updatedData };
  return writeProductsDb(db);
};

// Delete a product
export const deleteProduct = (id) => {
  const db = readProductsDb();
  db.products = db.products || [];
  
  const initialLength = db.products.length;
  db.products = db.products.filter(product => product.id !== id);
  
  if (db.products.length === initialLength) return false;
  return writeProductsDb(db);
}; 