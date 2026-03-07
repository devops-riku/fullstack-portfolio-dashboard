#!/bin/sh

# Default environment generator script

# 1. Create the container's internal env file for Pydantic
if [ ! -f /app/.env.docker ]; then
    echo "Creating /app/.env.docker from example..."
    cp /app/.env.example /app/.env.docker 2>/dev/null || cp /project_root/.env.example /app/.env.docker
fi

# 2. Create the project root .env file for Docker Compose labels
if [ ! -f /project_root/.env ]; then
    echo "Creating project root .env from example..."
    cp /project_root/.env.example /project_root/.env
fi

# Execute the main command passed in from docker-compose
exec "$@"
