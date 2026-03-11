FROM node:24-slim as base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base as build

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run -r build

RUN pnpm deploy --filter=web --prod /prod/web

FROM node:24-slim AS final

ENV NODE_ENV=production

RUN corepack enable && npm install -g serve@14.2.6

COPY --from=build /prod/web/dist ./dist

USER node

CMD ["serve", "-s", "dist", "-l", "3001"]
