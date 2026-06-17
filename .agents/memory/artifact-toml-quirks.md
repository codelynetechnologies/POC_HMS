---
name: Replit artifact.toml quirks
description: Non-obvious constraints when editing artifact.toml via verifyAndReplaceArtifactToml on Replit.
---

- The artifact `kind` field CANNOT be changed via `verifyAndReplaceArtifactToml` — it returns `ARTIFACT_EDITING_ERROR: cannot change artifact kind`. An artifact created as `kind = "api"` stays `api` even if you repoint it to serve a web UI. Preview still works at the configured `previewPath`.

- Workflow `run` commands (the `[services.development]` run string and `[services.production]` args) do NOT execute from the repo root. A relative path like `backend/src/.../X.csproj` fails with "Project file does not exist". **Use absolute paths** (e.g. `/home/runner/workspace/backend/...`) in artifact.toml run/build commands.

**Why:** discovered repointing an `api-server` artifact from an Express scaffold to a .NET `dotnet run`. Both bit during that task.

**How to apply:** when changing what an existing artifact runs, keep its original `kind`, and write absolute paths in every run/build command in artifact.toml.
