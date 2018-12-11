echo 'Building the environment'
pwd
docker-compose build $1
COMPOSE_HTTP_TIMEOUT=300 docker-compose up -d $1
