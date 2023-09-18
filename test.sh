#!/bin/sh

# init server
 docker build -t deno_app . && docker run -p 8000:8000 --name api_bible --detach deno_app

echo "Waiting for server to start"
until curl -s -f -o /dev/null "http://localhost:8000"
do
  sleep 5
done

# tests
echo "Running tests"
hurl --test tests/*.hurl

# Stop server
echo "Stopping server"
docker stop api_bible



