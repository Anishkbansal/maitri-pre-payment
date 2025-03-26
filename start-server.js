import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting email server...');

// Check if .env file exists
const envPath = resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env file not found at:', envPath);
  console.error('Please create a .env file based on .env.example with your email credentials');
  process.exit(1);
} else {
  console.log('.env file found at:', envPath);
}

// Start the server
const server = exec('node server.js', {
  cwd: resolve(__dirname),
  env: process.env
});

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle termination signals to gracefully shut down the server
process.on('SIGINT', () => {
  console.log('Shutting down email server...');
  server.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Shutting down email server...');
  server.kill();
  process.exit();
}); 