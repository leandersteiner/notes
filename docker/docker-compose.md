# Docker Compose

- modern apps are made up of multiple smaller services(microservices)
- managing and deploying lots of small servies can be hard
- docker compose makes this a lot easier
- docker compose let's you describe an entire app ins a single YAML file and deploy it with one command
- once deployed you can manage its entire lifecycle with a simple set of commands

## Deploying with Docker Compose

- was originally called fig then aquired by Docker Inc.
- Compose is still an external Python binary

The default name for a Compose YAML file is ```docker-compose.yml```.

Compose file example:

```
version: '3'
services:
  gateway:
    image: gateway:latest
    restart: unless-stopped
    ports:
      - "4000:4000"
    depends_on:
      - watchlist
    environment:
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - ./gateway/.env

  watchlist:
    image: watchlist-service:latest
    restart: unless-stopped
    depends_on:
      - watchlist-db
    env_file:
      - ./services/watchlist/.env

  watchlist-db:
    image: mongo
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo

  movie:
    image: movie-service:latest
    restart: unless-stopped

  recommendation:
    image: recommendation-service:latest
    restart: unless-stopped
    depends_on:
      - movie-rating-db
    env_file:
      - ./services/recommendation/.env

  movie-rating-db:
    image: mongo
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo

  user:
    image: user-service:latest
    restart: unless-stopped
    depends_on:
      - user-db
    env_file:
      - ./services/user/.env

  user-db:
    image: mongo
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo

  auth:
    image: auth-service:latest
    restart: unless-stopped
    environment:
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - ./services/auth/.env

  reviews:
    image: review-service:latest
    restart: unless-stopped
    env_file:
      - ./services/reviews/.env

  nginx:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./vvs-frontend/build:/etc/nginx/html
networks:
  over-net:
    driver: overlay
    attachable: true
volumes:
  counter-vol:
```

Top-level keys:

- ```version```: mandatory and always the first line of the compose file
- ```services```: define different application microservices
- ```networks```: tells Docker to create new networks
- ```volumes```: create new volumes

```
$ docker compose up
$ docker compose down
$ docker compose ps
$ docker compose top
$ docker compose stop
$ docker compose restart
```
