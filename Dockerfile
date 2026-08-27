# syntax=docker/dockerfile:1

# ---- build ----
FROM node:26-alpine AS build
WORKDIR /app

# Pinned to 10 to match pnpm-lock.yaml (lockfileVersion 9.0) and CI; pnpm 11
# may migrate the lockfile format, which breaks --frozen-lockfile.
RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Vite inlines import.meta.env.VITE_* at build time, so these are build args
# rather than runtime env -- a static bundle never reads the environment it is
# served from. Both values ship inside the browser bundle and are public.
ARG VITE_PRIVY_APP_ID
ARG VITE_TRAILS_CLIENT_API_KEY
ENV VITE_PRIVY_APP_ID=$VITE_PRIVY_APP_ID \
    VITE_TRAILS_CLIENT_API_KEY=$VITE_TRAILS_CLIENT_API_KEY

COPY . .

# Fail the build on missing build args. Without this the bundle compiles fine
# with `undefined` baked in, and the only symptom is Privy failing to init in
# the browser -- a silent deploy of a broken app.
# vite.config.ts serves from "/", unlike vite.deploy.config.ts which is based
# at "/trails-fund-boilerplate/" for GitHub Pages.
RUN test -n "$VITE_PRIVY_APP_ID" || { echo "ERROR: VITE_PRIVY_APP_ID build arg is required" >&2; exit 1; }; \
    test -n "$VITE_TRAILS_CLIENT_API_KEY" || { echo "ERROR: VITE_TRAILS_CLIENT_API_KEY build arg is required" >&2; exit 1; }; \
    pnpm build

# ---- serve ----
FROM nginx:alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Must be set: the template's `listen ${PORT}` is substituted only if PORT
# exists in the environment. Cloud Run overrides this at runtime.
ENV PORT=8080
EXPOSE 8080
