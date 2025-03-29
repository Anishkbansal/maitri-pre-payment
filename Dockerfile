FROM node:18-alpine AS base

# Install dependencies for build
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Build the application
FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production image, copy build files and start server
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/start-server.js ./
COPY --from=builder /app/src/server ./src/server

# Install only production dependencies
RUN npm ci --omit=dev

# Create volume directories
RUN mkdir -p /app/data
VOLUME /app/data

# Expose the API port
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "start-server.js"] 