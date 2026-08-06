#!/bin/bash

Create network
docker network create alina_forum_network 2>/dev/null || true



# Run database
docker run -d \
  --name db_alina_forum \
  --network alina_forum_network \
  -e POSTGRES_DB=dennikov \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5434:5432 \
  -v database_data:/var/lib/postgresql/data \
  --health-cmd="pg_isready -U postgres -d dennikov" \
  --health-interval=10s \
  --health-timeout=5s \
  postgres:14-alpine \
  postgres -c timezone=UTC -c log_timezone=UTC -c listen_addresses='*'

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 6

# Build and run app
docker build -t app_alina_forum ./app_pack
sleep 2

docker run -d \
  --name app_alina_forum \
  --network alina_forum_network \
  -e DB_HOST=db_alina_forum \
  -e DB_NAME=dennikov \
  -e DB_USERNAME=postgres \
  -e POSTGRES_PORT=5432 \
  -e DATABASE_URL=postgresql://postgres:postgres@db_alina_forum:5432/dennikov \
  -e DB_PASSWORD=postgres \
  -e APP_PORT=8082 \
  -p 8082:8082 \
  app_alina_forum