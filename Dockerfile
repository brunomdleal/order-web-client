# Stage 1: Build static bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Copies dependency manifests (package.json and package-lock.json) into the workdir
COPY package.json package-lock.json ./
# Dependency Installation - Performs an automated, clean, deterministic install using package-lock.json file
RUN npm ci

# Copies the remaining files into the workdir
COPY . .
# Build Execution
RUN npm run build

# Stage 2: Minimal unprivileged Nginx runner
FROM nginx:1.27-alpine-slim AS runner

# Configuration Override - Overwrites Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Filesystem Cleanup - Deletes default boilerplate demo HTML/images shipped with Nginx.
RUN rm -rf /usr/share/nginx/html/*
# Artifact Extraction - Copies the compiled assets from the builder stage directly into Nginx's root web directory.
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as non-root nginx user (least privilege)
USER nginx

EXPOSE 80

# Container Entrypoint Command - Launches Nginx in the foreground (daemon off;)
CMD ["nginx", "-g", "daemon off;"]