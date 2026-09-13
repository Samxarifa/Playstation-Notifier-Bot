FROM oven/bun:1.2.21

USER root
RUN mkdir -p /data && chown bun:bun /data
USER bun

WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "src/index.ts"]