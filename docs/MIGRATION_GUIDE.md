# Migration & Deployment Guide

## Local Development

### Backend

```bash
cd backend
dotnet restore
dotnet run --project src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj
```

- API: http://localhost:5209/api
- Swagger: http://localhost:5209/api/swagger (Development only by default)
- Health: http://localhost:5209/api/healthz

### Frontend (with hot reload)

```bash
cd frontend
npm install
npm start
```

Configure a proxy or run the combined .NET service that serves the built SPA from `wwwroot`.

---

## Docker Deployment

```bash
# Build and run (Mock data mode)
docker compose up --build

# Access at http://localhost:8080
```

### With SQL Server

```bash
docker compose --profile sqlserver up --build
```

Set environment variables on the `api` service:

```yaml
environment:
  DataMode: SqlServer
  ConnectionStrings__DefaultConnection: "Server=sqlserver;Database=HmsPatientRegistration;User Id=sa;Password=Your_strong_Password123!;TrustServerCertificate=True"
```

---

## Production Configuration

1. Set `ASPNETCORE_ENVIRONMENT=Production`
2. Set `Security__EnableSwagger=false`
3. Configure `Cors__AllowedOrigins` with your frontend domain(s)
4. Provide `ConnectionStrings__DefaultConnection` via environment variable (never commit secrets)
5. Set `AllowedHosts` in `appsettings.Production.json`

---

## Git Hygiene

Build artifacts are now gitignored. To remove previously tracked artifacts:

```bash
git rm -r --cached backend/**/bin backend/**/obj backend/publish
git commit -m "Stop tracking .NET build artifacts"
```

---

## Data Mode Switch

Edit `appsettings.json` or set environment variable:

```json
{ "DataMode": "Mock" }
```

- **Mock** — In-memory seed data, no database required
- **SqlServer** — EF Core with SQL Server; database created on first run

---

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml` runs on push/PR to `main`:

- `dotnet build` + `dotnet test`
- `npm ci` + `npm run build` (frontend)

---

## Backward Compatibility

Legacy endpoints remain available during phased migration:

| Legacy | Modern |
|--------|--------|
| `POST /api/patientregistration/IUD` | `POST /api/patients` |
| `POST /api/patientregistration/FetchPatientData` | `GET /api/patients/{id}` |
| `POST /api/patientregistration/Fetch` | `POST /api/patients/search` |
| `POST /api/CommonDropdown/Fetch` | `GET /api/dropdowns/{type}` |

No breaking changes were introduced in Wave 1 refactoring.
