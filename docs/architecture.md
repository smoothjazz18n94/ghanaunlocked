# Architecture notes (Task 01)

## Responsibilities
- **frontend**: UI only. Talks to the backend over HTTPS. Holds no secrets.
- **backend**: the single source of truth and the only place that touches the database and validates identity.
- **telegram-bot**: chat entry point. Handlers parse updates and call `services/`. It will call the backend (not the database) when features arrive.

## Authentication plan (not implemented yet)
1. Mini App sends raw `initData` in `Authorization: tma <initData>`.
2. Backend dependency calls `validate_init_data(initData, TELEGRAM_BOT_TOKEN)` (already written and tested).
3. Only the validated user is trusted. Frontend-supplied user IDs are never used for authorisation.

## Database
- Sync SQLAlchemy 2 + psycopg 3. The engine is created lazily, so the API runs with no DB configured.
- PostGIS: add `geoalchemy2` and `CREATE EXTENSION IF NOT EXISTS postgis;` in the first migration that needs it.
  `docker-compose.yml` already uses a PostGIS image for local dev.

## Decisions
- `BrowserRouter` + Vercel SPA rewrite, not `HashRouter`: Telegram passes launch parameters in the URL hash.
- Bot uses long polling for development; webhooks can be added after the backend is deployed.
- Error responses use one envelope: `{"error": {"code", "message", "details"}}`.
