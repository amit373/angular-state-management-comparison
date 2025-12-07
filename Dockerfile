# Multi-stage build for Angular apps
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY nx.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build all apps
RUN pnpm nx build --all

# Production stage
FROM nginx:alpine

# Copy built apps to nginx
COPY --from=base /app/dist/apps /usr/share/nginx/html

# Copy nginx config (if you have one)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

