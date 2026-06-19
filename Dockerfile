# Stage 1: Build Angular frontend
FROM node:20-alpine AS frontend-build
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY backend/ ./backend/
RUN dotnet restore backend/src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj
RUN dotnet publish backend/src/HMS.PatientRegistration.Api/HMS.PatientRegistration.Api.csproj \
    -c Release -o /app/publish --no-restore

# Stage 3: Copy SPA into wwwroot
FROM backend-build AS publish
COPY --from=frontend-build /src/frontend/dist/hms-frontend/browser/ /app/publish/wwwroot/

# Stage 4: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HMS.PatientRegistration.Api.dll"]
