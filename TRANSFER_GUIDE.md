# File Transfer and Deployment Guide

This guide explains how to transfer the application files from your Windows machine to a DigitalOcean droplet and deploy the application.

## Prerequisites

- A DigitalOcean droplet with SSH access
- Basic knowledge of command line operations
- Docker and Docker Compose installed on your droplet

## Step 1: Prepare Your Files

1. Make sure your local files are ready for transfer
2. Create a `.env` file from the `.env.example` with your actual settings

## Step 2: Transfer Files to Droplet (Windows to Linux)

### Option 1: Using SCP (Secure Copy Protocol)

If you have OpenSSH installed on Windows (included with recent Windows 10/11):

```bash
# Open a Command Prompt or PowerShell and run:
scp -r E:\path\to\maitri\project root@your-droplet-ip:/root/maitri-app
```

### Option 2: Using WinSCP (User-friendly GUI)

1. Download and install [WinSCP](https://winscp.net/eng/download.php)
2. Open WinSCP and create a new connection:
   - Host: your-droplet-ip
   - Username: root (or your user)
   - Password: your-password
   - Click "Login"
3. Navigate to your local project folder on the left panel
4. Navigate to the destination folder on the droplet on the right panel
5. Select all files/folders and drag them to the right panel
6. Wait for the transfer to complete

### Option 3: Using SFTP Command Line

```bash
# Open a Command Prompt and connect to your droplet:
sftp root@your-droplet-ip

# Navigate to the destination directory:
cd /root/maitri-app

# Create the directory if it doesn't exist:
mkdir -p /root/maitri-app

# Upload the entire directory:
put -r E:\path\to\maitri\project

# Exit SFTP:
exit
```

## Step 3: Deploy on the Droplet

1. SSH into your droplet:
   ```bash
   ssh root@your-droplet-ip
   ```

2. Navigate to the project directory:
   ```bash
   cd /root/maitri-app
   ```

3. Ensure Docker and Docker Compose are installed:
   ```bash
   docker --version
   docker-compose --version
   ```

   If not installed, install them:
   ```bash
   apt update
   apt install docker.io docker-compose
   systemctl enable docker
   systemctl start docker
   ```

4. Set up your environment variables:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your actual values
   ```

5. Deploy with Docker Compose:
   ```bash
   docker-compose up -d
   ```

6. Verify the deployment:
   ```bash
   docker-compose ps
   docker-compose logs
   ```

7. Check the application by visiting:
   - Backend: http://your-droplet-ip:3000
   - Frontend: http://your-droplet-ip:8000

## Step 4: Setting Up a Domain (Optional)

1. Add DNS records for your domain:
   - A Record: @ → your-droplet-ip
   - A Record: www → your-droplet-ip

2. Install Nginx as a reverse proxy:
   ```bash
   apt update
   apt install nginx
   ```

3. Configure Nginx:
   ```bash
   nano /etc/nginx/sites-available/maitri
   ```

4. Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:3000/api;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. Enable the site and restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/maitri /etc/nginx/sites-enabled/
   systemctl restart nginx
   ```

6. Set up SSL with Certbot:
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Troubleshooting

- **Permission issues:** If you encounter permission problems, use `chmod` to set appropriate permissions:
  ```bash
  chmod -R 755 /root/maitri-app
  ```

- **Port conflicts:** If the ports are already in use, you can modify the `.env` file to use different ports.

- **Docker issues:** Check Docker logs:
  ```bash
  docker-compose logs -f
  ```

- **Connection refused:** Ensure the firewall allows the necessary ports:
  ```bash
  ufw allow 3000
  ufw allow 8000
  ufw allow 80
  ufw allow 443
  ```

## Next Steps

1. Set up automatic backups
2. Configure monitoring
3. Set up automatic updates
4. Review server security 