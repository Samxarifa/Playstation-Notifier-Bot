FROM oven/bun:1.2.21
USER bun
RUN mkdir -p /data && chown bun:bun /data
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "src/index.ts"]