FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


FROM base AS builder

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter=srv run build

RUN pnpm deploy --filter=srv --prod /prod/srv


FROM node:24-slim AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /prod/srv/node_modules ./node_modules

COPY --from=builder --chown=hono:nodejs /prod/srv/drizzle ./drizzle

COPY --from=builder --chown=hono:nodejs /prod/srv/dist ./dist

COPY --from=builder --chown=hono:nodejs /prod/srv/package.json ./package.json

USER hono

EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
