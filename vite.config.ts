import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables
export default defineConfig(({ mode }) => {
  // Load env variables from .env file
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Make env variables available to the client
      'import.meta.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(env.VITE_STRIPE_PUBLIC_KEY),
      'import.meta.env.VITE_ENABLE_KLARNA': JSON.stringify(env.VITE_ENABLE_KLARNA),
      'import.meta.env.VITE_KLARNA_MIN_AMOUNT': JSON.stringify(env.VITE_KLARNA_MIN_AMOUNT)
    }
  };
});
