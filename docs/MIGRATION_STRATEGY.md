# Migration Strategy

This document describes how the legacy HMS Patient Registration module can be migrated to
the modern Angular 18 + .NET 8 stack **incrementally and safely**, using the patterns this
POC demonstrates.

The goal is a **phased migration with zero big-bang rewrite**: the new system runs
alongside the old one, the legacy contracts keep working, and screens are cut over one at a
time behind a consistent API.

---

## Why a phased approach

A full rewrite of a hospital system is high-risk: registration is mission-critical and
cannot be taken offline. Instead we use the **Strangler Fig** pattern — the new application
grows around the legacy one, intercepting and replacing functionality module by module
until the legacy code can be retired.

---

## The dual-endpoint bridge (key technique)

The backend exposes **two faces of the same logic**:

| Style  | Example routes                                                                 | Consumer                          |
| ------ | ------------------------------------------------------------------------------ | --------------------------------- |
| Legacy | `POST /api/patientregistration/IUD`, `/Fetch`, `/FetchPatientData`, `POST /api/CommonDropdown/Fetch` | Existing legacy callers / screens |
| Modern | `POST /api/patients`, `GET /api/patients/{id}`, `POST /api/patients/search`, `GET /api/dropdowns/{type}` | New Angular client                |

Both styles call into the **same Application services**, so business rules live in exactly
one place. This means:

- Legacy clients keep working unchanged during migration.
- New screens consume the clean REST API.
- There is no divergence in behaviour between old and new because the core logic is shared.

When every legacy caller has been migrated, the legacy controllers can simply be deleted —
nothing else changes.

---

## Phases

### Phase 0 — Foundation (this POC)

- Stand up the Clean Architecture backend with shared services.
- Expose both legacy and modern endpoints over the same logic.
- Build the Angular Patient Registration screen against the modern API.
- Run in **Mock** data mode so the screen is fully functional without a database.

### Phase 1 — Connect to real data

- Switch `DataMode` to `SqlServer` and point the connection string at a (replica or
  dedicated) database.
- Keep the legacy system as the system of record; the new module reads/writes through EF
  Core repositories that map onto the existing schema (or a synced schema).

### Phase 2 — Cut over registration

- Route real users to the new Angular registration screen.
- Legacy screens that still depend on the old endpoints continue to work via the legacy
  controllers.

### Phase 3 — Migrate remaining modules

- Repeat the pattern (shared services + dual endpoints + new Angular screen) for the next
  module: appointments, billing, etc.
- Each module is independently shippable and reversible.

### Phase 4 — Retire legacy

- Once no client depends on the legacy controllers, remove them and any compatibility
  mapping. The modern REST API and Angular app become the only surface.

---

## Data migration considerations

- **Coded master data** — gender, patient type, marital status, blood group, and the
  cascading geography are represented as code/name pairs. The migration must preserve the
  legacy codes so historical records remain resolvable.
- **Both code and name are stored** — the modern API persists the display name alongside
  each code, so reports and exports do not need to re-join against master tables. Clients
  send both; the server does not re-derive names.
- **MR number generation** — the POC generates sequential MR numbers (`MR0001`, …). A real
  migration must adopt the legacy numbering scheme or run a reconciled sequence.
- **Validation parity** — server-side validators are the source of truth; the Angular client
  mirrors them for fast feedback but never replaces them.

---

## Risk controls

- **Reversibility** — because legacy endpoints remain live, any phase can be rolled back by
  routing users back to the old screen.
- **Single source of business logic** — shared Application services prevent behavioural
  drift between old and new.
- **Mock mode for safe demos and testing** — the new module can be exercised end-to-end
  with no impact on production data.
- **Consistent error contract** — every endpoint returns the same `ApiResponse` envelope,
  so clients handle success and failure uniformly throughout the migration.
