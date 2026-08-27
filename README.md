# Trails & Privy Boilerplate

Minimal boilerplate showing how to integrate the [Trails](https://trails.build) fund widget with [Privy](https://privy.io) embedded wallets.

Users sign in via Privy, which creates an embedded wallet. The Trails widget then lets them fund that wallet from any chain and any token with different kind of payment methods.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **@privy-io/react-auth**
- **@privy-io/wagmi** + **wagmi** 
- **0xtrails** 

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `VITE_PRIVY_APP_ID` | [Privy Dashboard](https://dashboard.privy.io/) |
| `VITE_TRAILS_CLIENT_API_KEY` | [Trails Dashboard](https://dashboard.trails.build/) |

Both are `VITE_`-prefixed, so Vite inlines them into the bundle at **build** time and they are visible to anyone who loads the page. Neither is a server-side secret — but that also means every deploy path has to supply them at build time, not runtime.

### 3. Run the dev server

```bash
pnpm dev
```

## Project Structure

```
src/
├── main.tsx          # Privy, Wagmi & React Query providers
├── App.tsx           # Auth flow + TrailsWidget integration
├── TokenBalance.tsx  # USDC-on-Polygon balance for the embedded wallet
├── App.css           # App component styles
└── index.css         # Global styles & CSS variables

Dockerfile            # Multi-stage build for container hosting
nginx.conf            # nginx server block (a ${PORT} template — see its header)
vite.config.ts        # Dev + container build, served from "/"
vite.deploy.config.ts # GitHub Pages build, based at "/trails-fund-boilerplate/"
```

## Deployment

There are two paths. They build the same app and differ only in the base path
and in how the build-time env vars are supplied.

**Pick the right Vite config.** GitHub Pages serves the app from a repo
subpath, so it needs `vite.deploy.config.ts` (`base: '/trails-fund-boilerplate/'`).
Any host that serves from a domain root — including the container path — must
use the default `vite.config.ts`, or every asset URL 404s.

### GitHub Pages

Automatic. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds
and publishes on every push to `master`.

The two variables above must exist as **repository secrets** (Settings → Secrets
and variables → Actions); the workflow passes them into `pnpm vite build`.

### Depoly (container)

[Depoly](https://depoly.dev) runs containers on Cloud Run behind an
authenticating edge. Builds are `dockerfile`-only and pull from GitHub, so the
Depoly GitHub App must be installed and approved on the repo's organization
first — without it, setting the service source fails with
`GitHub organization installation is not usable`.

The image is defined by [`Dockerfile`](Dockerfile): `node:26-alpine` builds the
bundle, then `nginx:alpine` serves `dist/` on `$PORT`. The build **fails fast**
if either env var is missing, rather than shipping a bundle with `undefined`
baked in.

Configure the service (via the dashboard or the Depoly MCP server):

| Setting | Value |
|---|---|
| `build_type` | `dockerfile` |
| `dockerfile` | `Dockerfile` |
| `source` | this repo, branch `master`, trigger `push` |
| `build_args` | `VITE_PRIVY_APP_ID` and `VITE_TRAILS_CLIENT_API_KEY` |
| `auth_mode` | `public` — the app authenticates with Privy; Depoly's own edge login would put a second sign-in in front of it |
| `min_instances` | `0` — scales to zero; anything higher bills continuously |

Use `build_args`, not runtime env or runtime secret bindings: a static bundle
never reads the environment it is served from.
