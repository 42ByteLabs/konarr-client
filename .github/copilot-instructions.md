# Copilot instructions for Konarr Frontend

This file contains concise, actionable notes to get AI coding agents productive in this repo.

## Quick facts

- **Project**: Konarr Frontend - web interface for supply chain security monitoring (SBOM, dependencies, vulnerabilities)
- **Stack**: Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS + ag-charts-vue3
- **Key libraries**: @headlessui/vue, @heroicons/vue, @jamescoyle/vue-icon (with @mdi/js icons), axios, markdown-it
- **App sources**: `src/` with feature-based organization (`views/`, `components/`, `stores/`)
- **Dev commands**: `npm install`, `npm run dev`, `npm run build`, `npm run test:unit`, `npm run type-check`, `npm run lint`, `npm run format`

## Architecture & data flow

### Core workflow

1. **Bootstrap**: `server.ts` store calls `fetchInfo()` on app load → retrieves user, server config, and summary stats
2. **Auth flow**: Login/register → `server.ts` handles auth → redirects via `handleErrors` on 401
3. **Data stores**: Each feature (projects, dependencies, security, admin) has dedicated Pinia store in `src/stores/`
4. **View pattern**: Views import stores → call store actions on mount → reactively render from store state

### Store conventions (critical to follow)

- All stores use **in-place mutation** of arrays (push/splice) to preserve Vue reactivity — never reassign entire arrays unnecessarily
- Pattern example from `projects.ts`: `this.data.push(response.data)` after fetch, or replace specific items with `splice`
- Every async action wraps API calls in `handleErrors(error)` from `stores/utils.ts` for consistent 401 redirect and notifications
- Pagination state tracked in store: `{ data, loading, current, total, count, pages, page, limit }`

### Snapshot & context switching

- `dependencies.ts` and `security.ts` support snapshot context via `current` property (0 = global, >0 = snapshot ID)
- When `this.current === 0`, endpoints hit `/dependencies` or `/security`; otherwise `/snapshots/${this.current}/dependencies`
- Set snapshot context with `setSnapshot(snapid)` before fetching data

## Standards & guidelines

Follow these concrete rules when changing code in this repo — documentable, testable, and small by default.

- **Documentation**: update `README.md` or add an entry to the relevant view/store file header when you change public behavior, API shapes, or env vars. Prefer short examples (2-4 lines) showing how to call the API/store.
- **Types**: when changing API responses or models, update `src/types.ts` **first**. Run `npm run type-check` and fix downstream type errors before finalizing the change. All types are centralized in `src/types.ts`.
- **Tests**: currently no tests exist (Vitest configured but no `.spec.ts` files). When adding tests, use `@vue/test-utils` for components, place tests next to source files or in parallel structure.
- **PR scope**: keep PRs small and focused (ideally < 5 files). If a change touches many files, split into preparatory and feature PRs with clear migration steps.
- **Commit messages**: use present-tense, short summary + optional body (e.g. `fix: preserve reactivity when updating project list`).
- **Changelog**: update `CHANGELOG.md` for user-facing changes. Follow [Keep a Changelog](https://keepachangelog.com/) format with categories: Added, Changed, Deprecated, Removed, Fixed, Security. Add entries to `[Unreleased]` section during development; move to versioned section on release.
- **Lint & format**: run `npm run lint` and `npm run format` before committing; CI will also run these checks.
- **Dependencies**: when upgrading deps, prefer patch/minor bumps. For major upgrades that affect behavior (Vite, Vue, TypeScript), open a dedicated PR, update `viteBaseConfig` if needed, and run full type-check/build/tests.
- **Secrets & env**: never hardcode secrets. Add new client-visible config as `VITE_` vars and document them in `.env.example` or `README.md`.

## API & config

- All API calls use the axios instance at `src/client.ts` (withCredentials: true, JSON headers, 10s timeout)
- The server base URL is read from `import.meta.env.VITE_SERVER_BASE_URL`. Vite provides a build-time default:
  - **Dev mode**: `http://localhost:8000/api`
  - **Production**: `/api` (expects reverse proxy)
  - Override via `.env` file with `VITE_SERVER_BASE_URL=<your-url>`
- API responses follow pagination pattern: `{ data: T[], total: number, count: number, pages: number }`
- Query params for lists: `page=0&limit=24&top=true` (top returns most recent/relevant first)

## State & stores

All stores in `src/stores/` follow Pinia composition. Key stores:

- **`server.ts`** (`useServerStore`): auth flows, `fetchInfo()` bootstrapping, adminMode handling, user state
  - Call `fetchInfo()` on app mount to initialize user session and summary stats
  - Stores `adminMode` in localStorage — toggle only for Admin-role users
- **`projects.ts`** (`useProjectsStore`): project CRUD, pagination (params: page, limit, top, select=type)
  - `getCurrentProject(id?)` reads from route params if id not provided
  - `fetchProject(id)` pushes to `this.data` array, preserving existing items
- **`dependencies.ts`** (`useDependenciesStore`): dependency lists, search, snapshot-aware fetching
  - Uses `this.current` to track snapshot context (0 = global view)
  - Endpoints switch between `/dependencies` and `/snapshots/${id}/dependencies`
- **`security.ts`** (`useSecurityStore`): security alerts, snapshot-aware, severity filtering
- **`admin.ts`** (`useAdminStore`): admin settings, user management, project stats
- **`snapshots.ts`** (`useSnapshotsStore`): snapshot management for projects
- **`users.ts`** (`useUsersStore`): user profile, session management
- **`utils.ts`**: `handleErrors(error)` — central error handler; use it in async actions. Handles 401 redirects and network errors with notifications.

**Pattern**: stores mutate local arrays in-place (push/replace/splice) and append returned objects rather than always reloading lists. Follow existing mutation patterns to preserve reactivity.

Example from `projects.ts`:

```typescript
this.data.push(response.data); // Append new project
// OR
const idx = this.data.findIndex((p) => p.id === id);
if (idx >= 0) this.data.splice(idx, 1, updatedProject); // Replace in-place
```

## Routing & UI

- Routes and the `navigation` array live in `src/router/index.ts` (used by NavBar component)
- Navigation array tracks active route: `[{ name: "Home", current: false }, ...]`
- `router.beforeEach` updates `navigation[].current` to highlight active nav item
- Views live in `src/views/` with feature subfolders: `projects/`, `admin/`, `dependencies/`, `users/`
- **View composition pattern**: Views import sub-views/tabs (e.g., `ProjectView.vue` imports `ProjectSummary`, `ProjectSecurity`, `ProjectDependencies`, `ProjectSetup`) and switches via route-based computed property
- Notifications use `@kyvg/vue3-notification`; access via `useNotification()` from `stores/utils.ts` or directly in components

## Styling & components

- **Tailwind CSS** with custom theme in `tailwind.config.js`:
  - Custom colors: `accent` (pink), security severity palette (`sec.critical`, `sec.high`, etc.)
  - Dark mode via `darkMode: "selector"` (toggle with `DarkModeButton.vue`)
- **Button utilities** in `src/utils/buttonClasses.ts`: `primaryButton()`, `neutralButton()`, `outlineButton()` return composable class strings
- **Icon libraries**:
  - `@mdi/js` (Material Design Icons) via `@jamescoyle/vue-icon` as `<SvgIcon>`
  - `@heroicons/vue` for outline/solid variants
- **Component patterns**:
  - Tile components (`ProjectTile`, `SecuritySummaryTile`, `DependencyTile`) for grid layouts
  - List components (`DependenciesList`, `DependencyTable`) for tabular data
  - Icon components (`ProjectIcon`, `DependencyIcon`, `SecurityIcon`) use `SvgIcon` wrapper with dynamic MDI paths
  - Summary/stats components (`SecuritySummary`, `QuickStatsCards`) for dashboard metrics

## Types & checks

- Shared types: `src/types.ts` — single source of truth for all interfaces
- Key types: `KonarrServer`, `KonarrProject`, `KonarrDependency`, `KonarrSecurityAlert`, `Pagination<T>`
- Run `npm run type-check` after changing public types — fix all downstream errors before committing
- TypeScript config: `tsconfig.json` (base), `tsconfig.app.json` (app), `tsconfig.node.json` (build), `tsconfig.vitest.json` (tests)

## Tests & tooling

- **Vitest** configured via `vitest.config.ts` (imports `viteBaseConfig` from `vite.config.ts`)
- **No tests currently exist** — add `.spec.ts` files next to source when writing tests
- Test environment: jsdom (for Vue component testing with `@vue/test-utils`)
- **Critical**: `vite.config.ts` exports both a default function AND a plain `viteBaseConfig` object. Update both if changing Vite config, and ensure consumers (e.g., `vitest.config.ts`) import `viteBaseConfig` to avoid type errors.

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

- `package.json`, `README.md`, `CHANGELOG.md`, `vite.config.ts`, `src/client.ts`, `src/types.ts`, `src/stores/*`, `src/router/index.ts`, and examples under `src/views/projects/`.

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
