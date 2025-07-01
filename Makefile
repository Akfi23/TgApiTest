# Makefile

HELP_FORMAT = "\033[36m%-20s\033[0m %s\n"

IMAGE_NAME = unigram-payment-combined:$(VERSION)
CONTAINER_NAME = unigram-payment-combined_container

PORT = 1000
VERSION = 1.0.0

.PHONY: help build run run-detached stop restart clean logs

build:
    docker build -t $(IMAGE_NAME) .

run: build
    docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

run-detached: build
    docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
    docker stop $(CONTAINER_NAME) || true

restart: clean run

clean: stop
    docker rm $(CONTAINER_NAME) || true
    docker rmi $(IMAGE_NAME) || true

logs:
    docker logs -f $(CONTAINER_NAME)

help:
    @echo "Usage:"
    @printf $(HELP_FORMAT) "build" "Build the Docker image"
    @printf $(HELP_FORMAT) "run" "Build and start the container"
    @printf $(HELP_FORMAT) "run-detached" "Build and start the container in detached mode"
    @printf $(HELP_FORMAT) "stop" "Stop the running container"
    @printf $(HELP_FORMAT) "restart" "Clean and re-run the container"
    @printf $(HELP_FORMAT) "clean" "Delete the container and image"
    @printf $(HELP_FORMAT) "logs" "View container logs"