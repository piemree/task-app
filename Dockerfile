# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.4 --activate

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy the API package
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API application
WORKDIR /app/apps/api
RUN pnpm build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.4 --activate

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy the API package
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy environment files
COPY apps/api/.env* ./apps/api/

# Set working directory to API package
WORKDIR /app/apps/api

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["pnpm", "start"]
