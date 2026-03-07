FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH=/app

# Install postgres client (for pg_isready) and netcat for debugging
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       postgresql-client \
       netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x /app/entrypoint.sh

CMD ["sh", "/app/entrypoint.sh"]