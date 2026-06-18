# ============================================================
# Dockerfile for Nginx Static Web Server
# Base Image: nginx:1.25-alpine (lightweight ~23MB)
# ============================================================

# Stage 1: Use official Nginx Alpine image
# Alpine Linux is only ~5MB. The full nginx:alpine image is ~23MB
# Compare: nginx:latest (Debian) is ~187MB
FROM nginx:1.27-alpine

# Metadata labels (good practice for production images)
LABEL maintainer="your-email@example.com"
LABEL project="nginx-webserver"
LABEL version="1.0.0"
LABEL description="Static web server serving HTML, CSS, JS, images and PDFs"

# Remove the default Nginx HTML files
# /usr/share/nginx/html/ is Nginx's default web root
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom Nginx configuration
# This replaces the default /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy our entire website into the Nginx web root
# The COPY instruction copies from build context (local machine)
# to the container filesystem
COPY website/ /usr/share/nginx/html/

# Expose port 80 (HTTP)
# EXPOSE is documentation; it doesn't actually publish the port
# Use -p 80:80 in docker run to actually map the port
EXPOSE 80

# Health check: verify Nginx responds to requests
# --interval: check every 30 seconds
# --timeout: wait 10 seconds for response
# --start-period: give Nginx 5 seconds to start up
# --retries: mark unhealthy after 3 failures
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx official image already sets CMD to:
# CMD ["nginx", "-g", "daemon off;"]
# "daemon off" keeps Nginx in the foreground so Docker can track it
# We don't need to override CMD unless we want custom startup behavior