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

### 3. Run the dev server

```bash
pnpm dev
```

## Project Structure

```
src/
├── main.tsx      # Privy, Wagmi & React Query providers
├── App.tsx       # Auth flow + TrailsWidget integration
├── App.css       # App component styles
└── index.css     # Global styles & CSS variables
```