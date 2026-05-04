# MoonBeats

A music discovery and playlist app built with Angular, powered by the Deezer API.

## Tech stack

- **Framework** - Angular v21 (standalone APIs, no NgModules)
- **Language** - TypeScript strict mode
- **Styling** - Tailwind CSS
- **State** - Angular Signals
- **Storage** - IndexedDB via Dexie.js
- **Linting** - ESLint + angular-eslint
- **Deploy** - Vercel

## Getting started

```bash
npm install
```

Copy the environment template and fill in your Deezer credentials:

```bash
cp .env.example .env
```

Start the dev server:

```bash
ng serve
```

Open `http://localhost:4200`.

## Scripts

| Command | Description |
|---|---|
| `ng serve` | Dev server with hot reload |
| `ng build` | Production build (`dist/`) |
| `ng test` | Unit tests via Vitest |
| `ng lint` | ESLint across all TS and HTML |

## Project structure

```
src/app/
├── core/          # Singleton services, interceptors, tokens
├── features/      # Lazy-loaded page components (auth, search, artist, album, playlist)
├── guards/        # Route guards
├── models/        # TypeScript interfaces - no logic
├── routes/        # Root route configuration
├── shared/        # Reusable components, pipes, directives
└── store/         # Signal-based state stores
```

## Environment variables

| Variable | Description |
|---|---|
| `DEEZER_APP_ID` | Deezer application ID |
| `DEEZER_SECRET` | Deezer application secret |
| `DEEZER_REDIRECT_URI` | OAuth callback URL |

Register at [developers.deezer.com](https://developers.deezer.com) to obtain credentials.

## Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Production releases only |
| `dev` | Integration - all features land here first |
| `feature/*` | One branch per phase, PR into `dev` |
