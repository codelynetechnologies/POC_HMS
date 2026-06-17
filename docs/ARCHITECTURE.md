# Architecture

This POC uses **Clean / Onion Architecture** on the backend and a **feature-oriented
standalone-component** structure on the Angular frontend. The guiding principle is the
**dependency rule**: source-code dependencies point inward, toward the domain. Inner
layers know nothing about outer layers.

```
            ┌─────────────────────────────────────────┐
            │                  API                     │  Controllers, middleware,
            │      (HMS.PatientRegistration.Api)       │  Program.cs, Swagger, CORS
            └───────────────┬─────────────────────────┘
                            │ depends on
            ┌───────────────▼─────────────────────────┐
            │              Application                  │  DTOs, services, validators,
            │   (HMS.PatientRegistration.Application)   │  mapping, use-case logic
            └───────────────┬─────────────────────────┘
                            │ depends on
            ┌───────────────▼─────────────────────────┐
            │                Domain                     │  Entities, enums,
            │     (HMS.PatientRegistration.Domain)      │  repository interfaces
            └───────────────▲─────────────────────────┘
                            │ implements interfaces from Domain
            ┌───────────────┴─────────────────────────┐
            │            Infrastructure                 │  EF Core, repositories,
            │ (HMS.PatientRegistration.Infrastructure)  │  seed data, DataMode switch
            └───────────────────────────────────────────┘
```

Infrastructure depends on Domain (and Application) but **Domain depends on nothing**.
The API composes everything at startup via dependency injection.

---

## Backend layers

### Domain (`HMS.PatientRegistration.Domain`)

The heart of the system — pure C# with no framework dependencies.

- **Entities** — `Patient` and its owned value objects (address, professional details,
  additional details). These model the business concepts.
- **Enums** — `Gender` (1 = Male, 2 = Female, 3 = Other) and `PatientType`
  (1 = New, 2 = Existing, 3 = Staff, 4 = Newborn).
- **Interfaces** — `IPatientRepository`, `IDropdownRepository`. The domain declares the
  contracts; outer layers implement them.

### Application (`HMS.PatientRegistration.Application`)

Use-case orchestration and the boundary contracts the API speaks.

- **DTOs** — request/response models that cross the API boundary, decoupled from entities.
- **`ApiResponse<T>`** — the standard envelope (`success`, `message`, `data`, `errors`)
  returned by every endpoint.
- **Services** — `PatientService`, `DropdownService` implement the use cases (register,
  fetch, search, list dropdowns).
- **Validators** — FluentValidation rules enforced before persistence.
- **Mapping** — hand-written extension methods convert between DTOs and entities.
  Mapping copies **both** the code and the display name from the request — names are not
  re-derived server-side — so the client sends both for each coded field.

> **Note:** AutoMapper was intentionally removed in favour of explicit mapping extensions
> (avoids the GHSA-rvv3-g6hj-g44x advisory and keeps mapping transparent and debuggable).

### Infrastructure (`HMS.PatientRegistration.Infrastructure`)

The replaceable details — how and where data is stored.

- **EF Core `DbContext`** with owned-type configuration for the value objects.
- **Repositories** — a `Mock` implementation (in-memory seeded lists) and a `Sql`
  implementation (EF Core). Which one is registered is chosen by `DataMode`.
- **Seed data** — 5 patients plus all dropdown master data, including the cascading
  geography (Country → State → City → Area).
- **`DbInitializer`** — creates and seeds the SQL database on first run.

### API (`HMS.PatientRegistration.Api`)

The entry point and HTTP concerns.

- **Controllers** — both **legacy** controllers (`PatientRegistration/IUD`, `/Fetch`,
  `/FetchPatientData`, `CommonDropdown/Fetch`) and **modern REST** controllers
  (`/api/patients`, `/api/dropdowns`).
- **Middleware** — global exception handling (every error becomes a consistent
  `ApiResponse`) and request logging.
- **CORS**, **Swagger** (`/api/swagger`), and **PORT-aware** Kestrel binding for Replit.
- **Static file serving** — serves the compiled Angular app from `wwwroot` and falls back
  to `index.html` for client-side routes.

---

## Frontend structure

Angular 18 with standalone components (no NgModules) and the modern application builder.

```
src/app/
  core/
    models/         TypeScript interfaces mirroring the API DTOs + the ApiResponse envelope
    services/       PatientService, DropdownService (HTTP, caching, cascade fetch)
    interceptors/   errorInterceptor — normalizes HTTP errors into a friendly message
  features/
    patient-registration/
      patient-registration.component.*   container: reactive form, validators, cascades,
                                         age-from-DOB, load/save/reset
      sections/                          presentational section components
        personal-details, additional-details, residential-address,
        professional-details, insurance-documents
  shared/
    components/patient-search-modal/     search dialog + results table
```

Key frontend decisions:

- **Single reactive form** in the container; section components receive their `FormGroup`
  via `@Input` and stay presentational.
- **Cascading dropdowns** — selecting a country loads its states, which loads cities, which
  loads areas. A guard flag suppresses cascade resets while an existing patient is loaded.
- **Name resolution at submit** — because the API stores both code and name, the container
  resolves the display name for each selected code from the loaded dropdowns before posting.
- **Validators mirror the backend** — required name/mobile, mobile pattern, optional email,
  optional pincode pattern, DOB not in the future, and a form-level "age or DOB required".

---

## Serving model on Replit

A single .NET service serves everything: the Angular static build at `/` and the API at
`/api`. This keeps the deployment to one origin (no cross-origin / host configuration
needed) and is robust behind Replit's path-based reverse proxy.
