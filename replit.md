# HMS Patient Registration — Migration POC

A proof-of-concept demonstrating migration of a legacy Hospital Management System (HMS)
Patient Registration module to a modern stack: **Angular 18** frontend + **.NET 8 Web API**
(Clean / Onion Architecture) backend, with switchable Mock / SqlServer data modes.

## Run & Operate

- Two artifacts run on Replit and are combined by the path-based deployment router:
  - `artifacts/web: web` — serves the compiled Angular app at `/` (static).
  - `artifacts/api-server: API Server` — the .NET 8 Web API at `/api`.
- Angular UI: `/` · API: `/api` · Swagger: `/api/swagger` · Health: `/api/healthz`
- Backend dev: `dotnet run --project backend/src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj`
- Backend tests: `cd backend && dotnet test`
- Frontend dev (standalone): `cd frontend && npm start`
- Rebuild Angular for the web artifact: `cd frontend && npm run build` (outputs to
  `frontend/dist/hms-frontend/browser`, which the `web` artifact serves directly). Restart the
  `artifacts/web: web` workflow to pick up a fresh build.

## Stack

- Frontend: Angular 18 (standalone components, reactive forms, application builder)
- Backend: .NET 8 Web API, Clean Architecture (Domain / Application / Infrastructure / Api)
- Data: EF Core + SQL Server, or in-memory Mock (chosen by `DataMode` in appsettings)
- Validation: FluentValidation (server) mirrored by Angular reactive validators (client)

## Where things live

- Backend solution: `backend/` (`HMS.PatientRegistration.sln`, projects under `backend/src/`)
- Angular app: `frontend/src/app/` (`core/`, `features/patient-registration/`, `shared/`)
- Angular build output served from: `frontend/dist/hms-frontend/browser/` (by the `web` artifact)
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
- Split deploy: static Angular `web` artifact at `/` + .NET API at `/api`, combined by the
  path-based autoscale router. Needed because a `kind="api"` artifact alone is not publishable
  (publish UI shows "nothing to publish"); a `kind="web"` artifact at `/` makes the project deployable.
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
- After changing Angular code you must rebuild (`cd frontend && npm run build`) and restart the
  `artifacts/web: web` workflow; it serves the static build, not a live Angular dev server.
- `publicDir` in an artifact's `artifact.toml` is resolved relative to the repo root, not the
  artifact dir (e.g. `frontend/dist/hms-frontend/browser`).
- Angular CLI prompts for analytics on first `ng build` and hangs non-interactive workflow runs;
  disabled via `cli.analytics: false` in `angular.json`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure (note: `backend/` and `frontend/`
  are standalone, not pnpm workspace packages).
