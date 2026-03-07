#!/bin/sh
set -e

echo "===== API Container Startup ====="

# ---------------------------------------------------
# 1. Ensure root .env exists
# ---------------------------------------------------
if [ ! -f /project_root/.env ]; then
    echo "Creating /project_root/.env from .env.example..."
    cp /project_root/.env.example /project_root/.env
fi

# ---------------------------------------------------
# 2. Sync .env into backend folder
# ---------------------------------------------------
if [ -f /project_root/.env ]; then
    echo "Syncing .env to backend folder..."
    cp /project_root/.env /app/.env

    echo "Env sync complete. Preview:"
    grep -v "PASSWORD\|KEY" /app/.env | head -n 5
else
    echo "ERROR: /project_root/.env not found!"
    exit 1
fi

# ---------------------------------------------------
# 3. Wait for PostgreSQL
# ---------------------------------------------------
echo "Waiting for PostgreSQL..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER"; do
    echo "Postgres not ready yet..."
    sleep 2
done

echo "PostgreSQL is ready!"

# ---------------------------------------------------
# 4. Run database migrations
# ---------------------------------------------------
echo "Running Alembic migrations..."
alembic upgrade head

# ---------------------------------------------------
# 5. Seed database (optional)
# ---------------------------------------------------
if [ -f seed.py ]; then
    echo "Running database seed..."
    python seed.py || echo "Seed skipped or already applied."
fi

# ---------------------------------------------------
# 6. Start FastAPI
# ---------------------------------------------------
echo "Starting FastAPI..."

exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload