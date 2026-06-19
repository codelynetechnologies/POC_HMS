---
name: HMS POC serving
description: How the Angular + .NET HMS Patient Registration POC is built and served.
---

# HMS POC serving

- **Production:** single .NET service serves Angular static build from `wwwroot` at `/` and API at `/api`. See `Dockerfile` and `docker-compose.yml`.
- **Development:** run backend (`dotnet run` in `backend/`) and optionally `npm start` in `frontend/` for hot reload.
- Frontend lives in `/frontend`, backend in `/backend` — Angular uses npm; root monorepo uses pnpm for `lib/` packages only.

**Why one service:** one origin avoids CORS issues and simplifies deployment behind reverse proxies.

# Rebuild after frontend changes (production-style)

1. `cd frontend && npm run build`
2. Copy `dist/hms-frontend/browser/*` → `backend/src/HMS.PatientRegistration.Api/wwwroot/`
3. Restart the .NET API

Or use `docker compose up --build` which handles both steps.
