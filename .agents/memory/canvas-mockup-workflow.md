---
name: canvas mockup workflow quirks
description: Non-obvious gotchas when editing an existing canvas mockup iframe and using sonner/new deps in the mockup-sandbox vite server
---

# Canvas mockup edit workflow

- To modify an existing canvas mockup: set the iframe `state:"modifying"` via `applyCanvasActions` update (with `shapeType:"iframe"`), edit the component file in place (keep the same shape id), then set `state:"live"`.
- `presentArtifact` requires BOTH `artifactId` and `shapeIds` (e.g. `{ artifactId, shapeIds:["..."] }`). Passing only `shapeId` fails pydantic validation. The mockup-sandbox artifact id is the `design`-kind artifact registered for the canvas.

**Why:** wrong param names silently fail; the lifecycle states are how the user sees build/edit progress.

# Adding a new dependency to mockup-sandbox (e.g. sonner)

- The first time the component imports a not-yet-optimized dep, Vite re-optimizes and triggers a full reload; during that window the browser can throw a transient `Cannot read properties of null (reading 'useState')` runtime error.

**How to apply:** after introducing a new import in a mockup, restart the `artifacts/mockup-sandbox` workflow to get a clean optimize pass, then re-check logs/screenshot. The error clears on restart — it is not a real React-duplication bug.

- Import the raw `Toaster` from `sonner` directly (not the shadcn `@/components/ui/sonner` wrapper) to avoid pulling in `next-themes` inside an isolated single-component preview.
