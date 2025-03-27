import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error(`.env file not found at ${envPath}`);
  console.error('Please create an .env file with the required configuration.');
  process.exit(1);
}

// Start the server
console.log('Starting server...');
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env
});

// Handle termination signals to gracefully shut down the server
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(signal => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down server...`);
    server.kill(signal);
    process.exit(0);
  });
});

server.on('close', code => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Display instructions for developers
console.log('\n===== Server Started =====');
console.log('API is running at http://localhost:3001');
console.log('Press Ctrl+C to stop the server');
console.log('============================\n'); 