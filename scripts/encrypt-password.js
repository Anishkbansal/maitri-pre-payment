// Password encryption utility
import bcrypt from 'bcrypt';
import readline from 'readline';

// Create interface for reading from console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Number of salt rounds for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 12;

// Prompt for password
rl.question('Enter the password to encrypt: ', async (password) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('\n--- ENCRYPTED PASSWORD ---');
    console.log(hashedPassword);
    console.log('\nAdd this to your .env file:');
    console.log('ADMIN_PASSWORD_HASH=' + hashedPassword);
    console.log('\n--- VERIFICATION EXAMPLE ---');
    
    // Verify the password (for testing)
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log(`Password verification test: ${isMatch ? 'PASSED ✓' : 'FAILED ✗'}`);
    
  } catch (error) {
    console.error('Error encrypting password:', error);
  } finally {
    rl.close();
  }
}); 