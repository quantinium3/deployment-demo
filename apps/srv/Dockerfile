FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .
COPY apps/srv/package.json ./apps/srv/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter=srv run build
RUN pnpm deploy --filter=srv --prod /prod/srv

FROM base AS final

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=build --chown=hono:nodejs /prod/srv/node_modules /app/node_modules
COPY --from=build --chown=hono:nodejs /prod/srv/dist /app/dist
COPY --from=build --chown=hono:nodejs /prod/srv/package.json /app/package.json
COPY --from=build --chown=hono:nodejs /prod/srv/drizzle /app/drizzle

USER hono
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
