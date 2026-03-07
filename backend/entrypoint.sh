#!/bin/sh
set -e

echo "===== Container Startup ====="

# 1. Ensure root .env exists
if [ ! -f /project_root/.env ]; then
    echo "Creating project root .env from example..."
    cp /project_root/.env.example /project_root/.env
fi

# 2. Sync .env into backend folder
if [ -f /project_root/.env ]; then
    echo "Syncing .env to backend folder..."
    cp /project_root/.env /app/.env

    echo "Sync complete. Redacted preview:"
    grep -v "PASSWORD\|KEY" /app/.env | head -n 5
else
    echo "ERROR: /project_root/.env not found!"
    exit 1
fi

# 3. Wait for PostgreSQL
echo "Waiting for PostgreSQL at db:5432..."

until nc -z db 5432; do
    echo "Postgres not ready yet..."
    sleep 2
done

echo "Postgres is ready!"

# 4. Run migrations
echo "Running Alembic migrations..."
alembic upgrade head

# 5. Seed database
echo "Seeding database..."
python seed.py || echo "Seed skipped or already applied."

# 6. Start FastAPI
echo "Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload