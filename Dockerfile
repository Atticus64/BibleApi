
FROM denoland/deno:alpine-1.36.4

# The port that your application listens to.

WORKDIR /app


ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.

RUN [ "deno", "cache", "src/main.ts" ]

CMD ["deno", "task", "start"]
