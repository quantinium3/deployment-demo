FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter=web run build
RUN pnpm deploy --filter=web --prod /prod/web

FROM base AS final
RUN corepack enable
RUN npm install -g serve@14.2.6
COPY --from=build /prod/web/dist ./dist
USER node
EXPOSE 3001
CMD ["serve", "-s", "dist", "-l", "3001"]
