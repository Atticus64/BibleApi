
FROM denoland/deno:alpine-1.36.4

# The port that your application listens to.

WORKDIR /app

# Prefer not to run as root.
USER deno

ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.

CMD ["deno", "task", "start"]
