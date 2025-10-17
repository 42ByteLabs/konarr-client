# Copilot instructions for Konarr Frontend

This file contains concise, actionable notes to get AI coding agents productive in this repo.

## Quick facts

- Stack: Vue 3 + TypeScript + Vite + Pinia. App sources live under `src/`.
- Dev commands (see `package.json`): `npm install`, `npm run dev`, `npm run build`, `npm run test:unit`, `npm run type-check`, `npm run lint`.

## Standards & guidelines

Follow these concrete rules when changing code in this repo — documentable, testable, and small by default.

- Documentation: update `README.md` or add an entry to the relevant view/store file header when you change public behavior, API shapes, or env vars. Prefer short examples (2-4 lines) showing how to call the API/store.
- Types: when changing API responses or models, update `src/types.ts` first. Run `npm run type-check` and fix downstream type errors before finalizing the change.
- Tests: include unit tests for any logic you add or change in stores/composables. For components, add a small `@vue/test-utils` test verifying render and key interactions. Add tests under the existing test folder pattern.
- PR scope: keep PRs small and focused (ideally < 5 files). If a change touches many files, split into preparatory and feature PRs with clear migration steps.
- Commit messages: use present-tense, short summary + optional body (e.g. `fix: preserve reactivity when updating project list`).
- Lint & format: run `npm run lint` and `npm run format` before committing; CI will also run these checks.
- Dependencies: when upgrading deps, prefer patch/minor bumps. For major upgrades that affect behavior (Vite, Vue, TypeScript), open a dedicated PR, update `viteBaseConfig` if needed, and run full type-check/build/tests.
- Secrets & env: never hardcode secrets. Add new client-visible config as `VITE_` vars and document them in `.env.example` or `README.md`.

## API & config

- All API calls use the axios instance at `src/client.ts` (withCredentials: true, JSON headers).
- The server base URL is read from `import.meta.env.VITE_SERVER_BASE_URL`. Vite provides a build-time default (dev → `http://localhost:8000`, prod → `/api`). Prefer `.env` files for environment-specific overrides.

## State & stores

- Pinia stores are in `src/stores/`. Key stores:
  - `server.ts`: auth flows, `fetchInfo()` bootstrapping, adminMode handling.
  - `projects.ts`: project CRUD, pagination (params: page, limit, top/select).
  - `utils.ts`: `handleErrors(error)` — central error handler; use it in async actions.
- Pattern: stores mutate local arrays in-place (push/replace) and append returned objects rather than always reloading lists. Follow existing mutation patterns to preserve reactivity.

## Routing & UI

- Routes and the `navigation` array live in `src/router/index.ts` (used by the NavBar).
- Views live in `src/views/` (feature subfolders such as `projects`, `admin`, `dependencies`).
- Notifications use `@kyvg/vue3-notification`; use `useNotification()` through `stores/utils.ts` or components.

## Types & checks

- Shared types: `src/types.ts`. Run `npm run type-check` after changing public types.

## Tests & tooling

- Vitest is configured via `vitest.config.ts`.
- Note: `vite.config.ts` exports a plain `viteBaseConfig` object (for tooling) in addition to the default function; if you change `vite.config.ts`, update consumers (e.g. `vitest.config.ts` should import `viteBaseConfig`) to avoid type errors.

## Build & CI

Use the npm scripts in `package.json` for local and CI pipelines. Important scripts:

- `npm run dev` — start Vite dev server (uses `vite.config.ts`).
- `npm run build` — produce a production build (`vite build`).
- `npm run build-only` — alias for `vite build` (same as `build`).
- `npm run preview` — locally preview the built production bundle.
- `npm run type-check` — run `vue-tsc --build --force` to type-check the project.
- `npm run test:unit` — run unit tests with Vitest.
- `npm run lint` — run ESLint with autofix.

Recommended CI sequence (minimal):

1. npm ci (or npm install)
2. npm run type-check
3. npm run lint
4. npm run build
5. npm run test:unit

Run `npm run type-check` and `npm run test:unit` independently in CI to surface type or test failures early.

## Conventions & gotchas

- Keep array mutations consistent (use push/splice patterns used in stores) to avoid breaking reactivity.
- Use `handleErrors` for consistent 401 redirect behavior and notifications.
- `adminMode` is persisted in `localStorage` — toggle only for Admin-role users.

## Files to inspect first

- `package.json`, `README.md`, `vite.config.ts`, `src/client.ts`, `src/types.ts`, `src/stores/*`, `src/router/index.ts`, and examples under `src/views/projects/`.

If any area needs more examples (store code snippets, API call examples, or view patterns), tell me which file and I'll extract minimal, focused snippets.

## Checklist / Guidelines

Before completing a code change, an LLM should run and verify the following (execute commands from the repo root):

1. Read the user request fully and identify which files will be touched.
   a. Open those files and the canonical files: `package.json`, `vite.config.ts`, `src/client.ts`, `src/types.ts`, and any `src/stores/*` referenced.
2. Run type checks.
3. Run tests and ensure all pass.
4. Run lint and format checks.
5. If you changed build or tooling.

If any of these steps cannot be completed in the current environment (for example, integration tests requiring a backend), note the limitation and include reproduction steps or mocks in the PR description.
