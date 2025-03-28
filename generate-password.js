import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const saltRounds = 10;

console.log('=== Bcrypt Password Generator ===');
console.log('This script will generate a hashed password for your .env file');
console.log('');

rl.question('Enter the password to hash: ', (password) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error generating hash:', err);
    } else {
      console.log('\nAdd the following to your .env file:');
      console.log('ADMIN_PASSWORD_HASH=' + hash);
      console.log('\n# Example of how your .env should look:');
      console.log('ADMIN_USERNAME=your_admin_username');
      console.log('ADMIN_PASSWORD_HASH=' + hash);
      console.log('ADMIN_EMAILS=admin1@example.com, admin2@example.com');
    }
    rl.close();
  });
}); 