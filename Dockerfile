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
COPY packages/api/package.json ./packages/api/
COPY packages/api/tsconfig.json ./packages/api/
COPY packages/api/src ./packages/api/src

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API application
WORKDIR /app/packages/api
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
COPY packages/api/package.json ./packages/api/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/packages/api/dist ./packages/api/dist

# Copy environment files
COPY packages/api/.env* ./packages/api/

# Set working directory to API package
WORKDIR /app/packages/api

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["pnpm", "start"]
