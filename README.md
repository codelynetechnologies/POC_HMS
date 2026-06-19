# HMS Patient Registration — Migration POC

A proof-of-concept that demonstrates migrating a legacy Hospital Management System (HMS)
**Patient Registration** module to a modern stack:

- **Frontend:** Angular 18 (standalone components, reactive forms, lazy routing)
- **Backend:** .NET 8 Web API built with **Clean / Onion Architecture**
- **Data:** Switchable **Mock** (in-memory seed) or **SqlServer** (EF Core) data mode

The backend exposes **both** the legacy-style endpoints (so existing callers keep working
during a phased migration) **and** a modern RESTful API that the Angular client consumes.

> Enterprise-ready HMS Patient Registration module built by **Codelyne Technologies**.
> A single .NET service serves the compiled Angular app at `/` and the API at `/api`.

---

## Quick Start (Docker)

```bash
docker compose up --build
# Open http://localhost:8080
```

See [docs/MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) for full deployment options.

---

## Endpoints

- Angular UI: `/`
- API base: `/api`
- Swagger UI: `/api/swagger` (Development only by default)
- Health check: `/api/healthz`
- Metrics: `/api/metrics`

---

## Running locally

### Backend

```bash
cd backend
dotnet restore
dotnet run --project src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj
# API on http://localhost:5000 (or $PORT if set)
```

Run the tests:

```bash
cd backend
dotnet test
```

### Frontend

```bash
cd frontend
npm install
npm start          # ng serve, proxies /api to the backend during dev
```

### Production-style build (single service)

```bash
# 1. Build Angular
cd frontend && npm run build

# 2. Copy the build into the API's wwwroot
cp -r dist/hms-frontend/browser/* ../backend/src/HMS.PatientRegistration.Api/wwwroot/

# 3. Run the API — it now serves the SPA at / and the API at /api
cd ../backend && dotnet run --project src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj
```

---

## Switching data modes

The backend reads `DataMode` from `appsettings.json`:

```jsonc
{
  "DataMode": "Mock",        // "Mock" (in-memory seed) or "SqlServer"
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=HMS;..."
  }
}
```

- **Mock** — no database required; data lives in memory and resets on restart. Default.
- **SqlServer** — uses EF Core against the configured connection string; the database is
  created and seeded on first run.

---

## Documentation

- [docs/TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) — full technical architecture & engineering documentation (23 sections)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layer responsibilities and design decisions
- [docs/MIGRATION_STRATEGY.md](docs/MIGRATION_STRATEGY.md) — how to migrate the legacy module
  incrementally using the dual-endpoint approach
- [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) — every endpoint, request/response
  shape, and the shared response envelope

---

## Project layout

```
backend/                         .NET 8 solution (Clean Architecture)
  src/
    HMS.PatientRegistration.Domain/          Entities, enums, repository interfaces
    HMS.PatientRegistration.Application/      DTOs, services, validators, mapping
    HMS.PatientRegistration.Infrastructure/   EF Core, repositories, seed data
    HMS.PatientRegistration.Api/              Controllers, middleware, Program.cs, wwwroot
  tests/                                       Unit tests
frontend/                        Angular 18 app
  src/app/
    core/        models, services, interceptors
    features/    patient-registration (container + section components)
    shared/      patient search modal
docs/                            Architecture, migration, API docs
```
