echo 'Building the environment'
pwd
docker-compose build
COMPOSE_HTTP_TIMEOUT=300 docker-compose up -d
