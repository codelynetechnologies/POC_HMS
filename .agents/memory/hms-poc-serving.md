---
name: HMS POC serving model
description: How the Angular + .NET HMS Patient Registration POC is served and rebuilt on Replit.
---

- A single .NET 8 service serves everything: the compiled Angular app at `/` (static files from the API project's `wwwroot`) and the API at `/api`. Program.cs uses `UseDefaultFiles` + `UseStaticFiles` + `MapFallbackToFile("index.html")`, with `MapControllers` + `/api/healthz` registered BEFORE the fallback so API routes aren't shadowed.

- **Workflow:** after ANY Angular source change you must rebuild and re-copy — the running .NET service serves the static build, not a live ng dev server:
  1. `cd frontend && ./node_modules/.bin/ng build --configuration production`
  2. copy `frontend/dist/hms-frontend/browser/*` → `backend/src/HMS.PatientRegistration.Api/wwwroot/`
  3. restart the `artifacts/api-server: API Server` workflow.

**Why:** one origin avoids CORS/host config and is robust behind Replit's path proxy. The frontend lives in `/frontend` and backend in `/backend` — neither is a pnpm workspace package.

**Backend contract reminders:** mapping copies BOTH code and name from the request (names not derived) → client sends both per coded field. Gender 1=M/2=F/3=Other; PatientType 1=New/2=Existing/3=Staff/4=Newborn. Every response is `ApiResponse{success,message,data,errors}`.
