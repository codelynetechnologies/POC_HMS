# HMS Patient Registration — Migration POC

A proof-of-concept demonstrating migration of a legacy Hospital Management System (HMS)
Patient Registration module to a modern stack: **Angular 18** frontend + **.NET 8 Web API**
(Clean / Onion Architecture) backend, with switchable Mock / SqlServer data modes.

## Run & Operate

- The app runs on Replit via the `artifacts/api-server: API Server` workflow.
- A single .NET service serves the compiled Angular app at `/` and the API at `/api`.
- Angular UI: `/` · API: `/api` · Swagger: `/api/swagger` · Health: `/api/healthz`
- Backend dev: `dotnet run --project backend/src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj`
- Backend tests: `cd backend && dotnet test`
- Frontend dev (standalone): `cd frontend && npm start`
- Rebuild Angular into the API: `cd frontend && npm run build` then copy
  `dist/hms-frontend/browser/*` → `backend/src/HMS.PatientRegistration.Api/wwwroot/`

## Stack

- Frontend: Angular 18 (standalone components, reactive forms, application builder)
- Backend: .NET 8 Web API, Clean Architecture (Domain / Application / Infrastructure / Api)
- Data: EF Core + SQL Server, or in-memory Mock (chosen by `DataMode` in appsettings)
- Validation: FluentValidation (server) mirrored by Angular reactive validators (client)

## Where things live

- Backend solution: `backend/` (`HMS.PatientRegistration.sln`, projects under `backend/src/`)
- Angular app: `frontend/src/app/` (`core/`, `features/patient-registration/`, `shared/`)
- Angular build output served from: `backend/src/HMS.PatientRegistration.Api/wwwroot/`
- Seed data + dropdown codes: `backend/src/HMS.PatientRegistration.Infrastructure/Data/`
- Artifact/proxy config: `artifacts/api-server/.replit-artifact/artifact.toml`
- Docs: `README.md`, `docs/ARCHITECTURE.md`, `docs/MIGRATION_STRATEGY.md`, `docs/API_DOCUMENTATION.md`

## Architecture decisions

- Dual API surface: legacy endpoints (`/api/patientregistration/*`, `/api/CommonDropdown/Fetch`)
  and modern REST (`/api/patients`, `/api/dropdowns`) share the same Application services —
  enables incremental Strangler-Fig migration.
- Manual mapping extensions instead of AutoMapper (avoids GHSA-rvv3-g6hj-g44x; transparent).
- Mapping copies BOTH code and name from the request; names are NOT derived server-side, so
  the Angular client resolves and sends both code + name for each coded field at submit.
- Single .NET service serves SPA + API (one origin) — robust behind Replit's path proxy.
- Enums: Gender 1=Male,2=Female,3=Other; PatientType 1=New,2=Existing,3=Staff,4=Newborn.

## Product

Patient Registration screen: personal details, collapsible additional details, cascading
residential address (Country→State→City→Area), professional details, insurance/document
placeholders, appointment reference, patient search modal, and client+server validation.
Ships with 5 seed patients and full seed dropdowns.

## User preferences

- Stack is fixed: Angular 18 frontend + .NET 8 Clean Architecture backend (user's choice).
- No emojis in the UI.

## Gotchas

- The artifact `kind` cannot be changed via `verifyAndReplaceArtifactToml` (stays `api`).
- Workflow run commands do NOT execute from the repo root — use absolute paths in
  `artifact.toml` (e.g. the `.csproj` path for `dotnet run`).
- `rxjs` can install without its type declarations if a prior npm install was interrupted
  (TS7016 "Could not find a declaration file for module 'rxjs'") — reinstall `rxjs` to fix.
- After changing Angular code you must rebuild and re-copy into `wwwroot`; the running .NET
  service serves the static build, not a live Angular dev server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure (note: `backend/` and `frontend/`
  are standalone, not pnpm workspace packages).
