#!/bin/sh

# Default environment generator script

# 1. Create the project root .env file for Docker Compose labels
if [ ! -f /project_root/.env ]; then
    echo "Creating project root .env from example..."
    cp /project_root/.env.example /project_root/.env
fi

# 2. Always sync it to the backend folder so Pydantic is guaranteed to use it
if [ -f /project_root/.env ]; then
    echo "Syncing .env to backend folder..."
    cp /project_root/.env /app/.env
    echo "Sync complete. Redacted peek at synced .env:"
    grep -v "PASSWORD\|KEY" /app/.env | head -n 5
else
    echo "ERROR: /project_root/.env not found! Env sync failed."
fi

# Execute the main command passed in from docker-compose
exec "$@"
