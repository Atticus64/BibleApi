#!/bin/sh
#set -eu

# init server
docker build -t deno_app . && docker run -p 8000:8000 --name api_bible --detach deno_app


echo "Waiting for server to start"
until curl -s -f -o /dev/null "http://localhost:8000"
do
  echo "Testing $1..."
  sleep 10
done

echo "Server running at http://localhost:8000"

# tests
echo "Running tests"
hurl --variable host="$1" --test tests/*.hurl

# Stop server
echo "Stopping server"
docker stop api_bible



