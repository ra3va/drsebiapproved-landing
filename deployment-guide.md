# Docker Deployment Guide for Dr. Sebi's Parasite Cleanse Project

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Setup](#docker-setup)
3. [Local Development](#local-development)
4. [Production Build](#production-build)
5. [Render Deployment](#render-deployment)
6. [Updating Deployment](#updating-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites <a name="prerequisites"></a>
- Docker installed locally ([Docker Desktop](https://www.docker.com/products/docker-desktop/))
- Node.js v18+ (matches production environment)
- Docker Hub account ([Sign up](https://hub.docker.com/))
- Render.com account
- Shopify credentials:
  - Store domain
  - Storefront access token
  - Product ID

## Docker Setup <a name="docker-setup"></a>

### 1. Create Docker Configuration Files

```dockerfile:Dockerfile
# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

```text:.dockerignore
node_modules
.next
.env
Dockerfile
.dockerignore
.git
.gitignore 