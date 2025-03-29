# Deployment Guide

This guide explains how to deploy the Maitri application using Docker.

## Prerequisites

- Docker and Docker Compose installed on the server
- Valid email service credentials

## Configuration

1. Copy the `.env.example` file to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your specific configuration values:

```
PORT=3000
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Deployment Steps

### Using Docker Compose (Recommended)

1. Build and start the container:

```bash
docker-compose up -d
```

2. View logs:

```bash
docker-compose logs -f
```

3. Check container health:

```bash
docker-compose ps
```

4. Stop the application:

```bash
docker-compose down
```

### Using Docker Directly

1. Build the Docker image:

```bash
docker build -t maitri-app .
```

2. Run the container:

```bash
docker run -d -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  --name maitri-app \
  maitri-app
```

## Health Monitoring

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2023-06-01T12:00:00.000Z",
  "uptime": 3600
}
```

Docker is configured to use this endpoint to monitor container health. You can check the health status with:

```bash
docker inspect --format='{{.State.Health.Status}}' maitri-app
```

## Persistent Data

The application stores data in the `./data` directory, which is mounted as a volume in the container. This ensures data persistence across container restarts.

## Production Optimization

The Docker setup uses multi-stage builds to:
- Minimize image size
- Separate build dependencies from runtime dependencies
- Improve security by having fewer packages in the final image
- Optimize build time through better layer caching

## Updating the Application

To update the application with a new version:

1. Pull the latest code changes
2. Rebuild and restart the container:

```bash
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

- If emails aren't sending, check the email configuration in the `.env` file
- Server logs can be viewed with `docker-compose logs -f`
- Check container health with `docker-compose ps` or `docker inspect`
- To access the container shell for debugging:
  ```bash
  docker-compose exec app /bin/sh
  ```
- View the health check endpoint directly: `http://localhost:3000/health`