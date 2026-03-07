#!/bin/sh

# Default environment generator script

if [ ! -f /app/.env.docker ]; then
    echo "Creating .env.docker from example file..."
    cp /app/.env.docker.example /app/.env.docker
else
    echo ".env.docker already exists, skipping creation."
fi

# Execute the main command passed in from docker-compose
exec "$@"
