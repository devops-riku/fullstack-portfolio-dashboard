#!/bin/sh

# Default environment generator script

# 1. Create the project root .env file for Docker Compose labels
if [ ! -f /project_root/.env ]; then
    echo "Creating project root .env from example..."
    cp /project_root/.env.example /project_root/.env
fi

# 2. Always sync it to the backend folder so Pydantic is guaranteed to use it
echo "Syncing .env to backend folder..."
cp /project_root/.env /app/.env

# Execute the main command passed in from docker-compose
exec "$@"
