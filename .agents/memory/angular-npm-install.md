---
name: Angular npm install on Replit
description: Heavy Angular installs time out and can corrupt node_modules; symptom and fix.
---

- `npm install` for an Angular 18 app frequently exceeds a single 2-minute bash timeout. It is resumable: rerun with `--prefer-offline` (cache is warm) and it finishes in seconds.

- An interrupted/partial install can leave `rxjs` installed WITHOUT its type declarations. Symptom at `ng build`: `TS7016: Could not find a declaration file for module 'rxjs'` plus a cascade of `TS7006: Parameter implicitly has an 'any' type` in every file that subscribes/forkJoins (the missing types make all observables `any`). **Fix:** `rm -rf node_modules/rxjs && npm install rxjs --prefer-offline`.

**Why:** the `TS7006` cascade is misleading — the real root cause is the upstream `TS7016` rxjs type-decl miss, not the component code. Always read build errors from the TOP, not the tail.

**How to apply:** if Angular subscribe/forkJoin callbacks all show implicit-any, check for `TS7016 rxjs` first and reinstall rxjs before touching component code.
