# Ghana Unlocked

A trust-first intelligent discovery platform for Ghana. The pilot cities are **Accra** and **Kumasi**.
It runs as a **Telegram Bot** plus a **Telegram Mini App**.

> Status: **Task 01, project foundation.** No discovery features, AI search, payments or
> verification workflows exist yet. See [Known gaps](#known-gaps).

## Technology stack

| Part | Stack |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, `@telegram-apps/sdk`, Vitest |
| Backend | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, pytest |
| Database | PostgreSQL (PostGIS-ready; optional for the health check) |
| Bot | Python, aiogram 3, pytest |

All of it is free to develop and host on. The only external services are GitHub and Vercel's free tier.

## Folder structure

```
ghana-unlocked/
  frontend/                 React + Vite Mini App (deploys to Vercel on its own)
    src/
      components/{layout,ui}/   App shell, bottom nav, loading/error/empty states
      pages/                    Home, Explore, Search, Saved, Profile, NotFound
      lib/api/                  API client, health call, useApiQuery hook
      lib/telegram/             Telegram SDK wrapper + provider + browser fallback
      config/env.ts             The only place VITE_* variables are read
      styles/  test/
    vercel.json  vite.config.ts  .env.example
  backend/                  FastAPI service
    app/
      main.py                   App factory (CORS, error handlers, /api/v1 router)
      api/v1/{router.py,endpoints/}
      core/{config,logging,errors,security}.py
      db/{base,session}.py      Lazy engine: nothing connects at import time
      schemas/                  Pydantic models
    alembic/  alembic.ini       Migration config (no migrations yet, by design)
    tests/  .env.example
  telegram-bot/             aiogram bot
    ghana_bot/
      main.py                   Entry point (long polling)
      config.py                 Settings from env (BOT_TOKEN is a SecretStr)
      handlers/                 Thin: /start /help /search /discover
      services/messages.py      Text and placeholder logic, kept out of handlers
      keyboards.py              "Open app" Mini App button (HTTPS only)
    tests/  .env.example
  docs/architecture.md
  docker-compose.yml        Optional local Postgres + PostGIS
  .gitignore
```

## Requirements

- Node.js 20+ (built and tested on 22) and npm
- Python 3.11+ (built and tested on 3.12)
- Git
- Optional: Docker, for local Postgres/PostGIS

## Environment variables

Each app has its own `.env.example`. Copy it to `.env` (frontend: `.env.local`) inside that app's folder.
**`.env` files are git-ignored. Never commit them.**

| App | Variable | Required? | Purpose |
|---|---|---|---|
| frontend | `VITE_API_BASE_URL` | No | Backend URL including `/api/v1`. Empty is fine: the app shows a friendly state. **Public**: never put secrets here. |
| backend | `CORS_ORIGINS` | Recommended | Comma-separated allowed origins (add your Vercel URL). |
| backend | `ENVIRONMENT`, `DEBUG`, `LOG_LEVEL` | No | Runtime behaviour. `/docs` is disabled when `ENVIRONMENT=production`. |
| backend | `DATABASE_URL` | Only for migrations / DB features | e.g. `postgresql+psycopg://user:pass@host:5432/db`. Not needed for `/health`. |
| backend | `TELEGRAM_BOT_TOKEN` | Not yet | Will be used server-side to validate `initData`. |
| bot | `BOT_TOKEN` | **Yes** | The token from BotFather for your existing bot. |
| bot | `MINI_APP_URL` | No | HTTPS URL of the deployed frontend. Enables the "Open app" button. |

## Run the frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:5173
```

Opened in a normal browser, the app uses a **dev fallback** (preview banner, no Telegram user).
Inside Telegram it uses the real Mini App SDK.

## Run the backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

- Health check: http://localhost:8000/api/v1/health (works with **no database**)
- Readiness: http://localhost:8000/api/v1/health/ready (reports `not_configured` without a DB)
- Interactive docs: http://localhost:8000/docs

### Database (optional for now)

```bash
docker compose up -d db          # from the repo root; free local Postgres + PostGIS
# set DATABASE_URL in backend/.env, then:
cd backend && alembic upgrade head   # no migrations exist yet; the discovery schema is a later task
```

## Run the Telegram bot

```bash
cd telegram-bot
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env             # then put your BotFather token in BOT_TOKEN
python -m ghana_bot.main
```

Use a separate virtual environment per Python app. Do not create another bot: reuse the existing one.

## Testing

```bash
cd backend      && source .venv/bin/activate && pytest
cd telegram-bot && source .venv/bin/activate && pytest
cd frontend     && npm test            # Vitest
cd frontend     && npm run typecheck
```

## Deploying the frontend to Vercel

The frontend deploys **independently** of the backend.

1. Push this repo to GitHub (confirm no `.env` file is staged: `git status`).
2. In Vercel: **Add New → Project**, import the repo.
3. Set **Root Directory** to `frontend`. Vercel detects Vite. `frontend/vercel.json` already sets the build command, output directory (`dist`) and a **single-page-app rewrite**. The rewrite is required because the app uses client-side routes such as `/explore`.
4. Add the environment variable `VITE_API_BASE_URL` if a backend is deployed. It can be left empty for now.
5. Deploy and copy the `https://…vercel.app` URL.
6. In **BotFather**: `/mybots` → your bot → *Bot Settings* → *Menu Button* (or *Configure Mini App*) and set that URL.
7. Put the same URL in `telegram-bot/.env` as `MINI_APP_URL`.
8. Once a backend exists, add the Vercel URL to its `CORS_ORIGINS`.

Changing a `VITE_*` variable requires a **redeploy**, because it is baked in at build time.
A custom domain can be added later in Vercel → Project → Domains; nothing in the code needs to change.

## Security notes

- Secrets live only in server-side `.env` files and are git-ignored. The bot token is never in frontend code.
- The backend does **not** trust a Telegram user ID from the frontend. The frontend forwards the raw signed
  `initData` as `Authorization: tma <initData>`, and the backend will verify its HMAC signature.
  `backend/app/core/security.py` already implements and tests that validation; it is **not yet attached to any route**.
- CORS is driven by `CORS_ORIGINS`; credentials/cookies are not used.

## Known gaps

- The Telegram bot has not been run against the real Telegram servers (needs your `BOT_TOKEN`).
- The Mini App has not been opened inside Telegram yet (needs the Vercel HTTPS URL and BotFather setup).
- `initData` validation exists and is unit-tested but is not attached to any endpoint yet.
- No database models or migrations yet (the discovery schema is a later task).
- No CI, linting or formatting configuration yet.
- Placeholder visual design only; the real visual identity is a later task.
