#!/bin/bash

if [ "$1" == "down" ]; then
    docker compose down
elif [ "$1" == "build" ]; then 
    docker compose up -d --build
elif [ "$1" == "test" ]; then
    # run tests
    docker compose exec backend pytest ./test_main.py -v
    exit 0
elif [ "$1" == "view" ]; then
    docker ps --format "table {{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.Names}}"
else
    docker compose up -d --build
fi