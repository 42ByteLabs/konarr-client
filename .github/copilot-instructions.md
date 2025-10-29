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

## Styling & Design System

### Tailwind Configuration

Configuration lives in `tailwind.config.js` with custom theme extensions:

- **Dark mode**: `darkMode: "selector"` — toggle programmatically via `DarkModeButton.vue`
- **Content purge**: `./index.html`, `./src/**/*.{vue,js,ts,jsx,tsx}`
- **Custom grid**: `gridTemplateColumns.16` and `gridTemplateColumns.footer`
- **Custom animations**: `progress` animation for loading bars with custom keyframes

### Color Palette

**Primary Colors** (from `tailwind.config.js`):

- `accent`: Tailwind pink (`colors.pink`) — **primary interactive color** for buttons, links, active states
  - Use: `bg-accent-500`, `text-accent-500`, `border-accent-500`, `hover:bg-accent-600`, `focus:ring-accent-500`
- `black`: Custom `#0D0D0D`
- `white`, `gray`, `red`, `yellow`, `green`, `blue`, `pink`: Tailwind default palettes
- `green`: Tailwind emerald (`colors.emerald`)

**Security Severity Colors** (namespace: `sec.*`):
Use these for security alert styling and visualization:

- `sec.total`: blue
- `sec.critical`: red
- `sec.high`: orange
- `sec.medium`: yellow
- `sec.low`: green (emerald)
- `sec.information`: cyan
- `sec.malware`: purple
- `sec.unmaintained`: indigo
- `sec.unknown`: gray

**Semantic Colors**:

- `error`: red
- `warning`: yellow
- `success`: green (emerald)

### Accent Color Usage Guidelines

The **accent color (pink)** is the primary brand/interactive color. Use it consistently for:

1. **Interactive elements** (buttons, links, toggles):
   - Primary buttons: `bg-accent-500 hover:bg-accent-600`
   - Active navigation: `bg-accent-500 text-white`
   - Toggle switches (enabled): `bg-accent-500`

2. **Focus states** (all interactive elements):
   - Standard: `focus:ring-2 focus:ring-accent-500 focus:ring-offset-2`
   - Borders: `focus:border-accent-500`

3. **Hover states**:
   - Borders: `hover:border-accent-500 dark:hover:border-accent-400`
   - Text: `hover:text-accent-500 dark:hover:text-accent-400`

4. **Loading/progress indicators**:
   - Progress bars: `bg-accent-500`
   - Background: `bg-accent-100 dark:bg-accent-900/20`

**Do NOT use accent color for**:

- Security severity indicators (use `sec.*` colors)
- Error/warning/success states (use semantic colors)
- Neutral/secondary actions (use gray)

### Button Styles

Button utilities in `src/utils/buttonClasses.ts` provide consistent button styling:

**`primaryButton()`** — Primary actions (save, submit, create):

```typescript
bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md
focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
disabled:opacity-50 disabled:cursor-not-allowed
```

**`neutralButton()`** — Secondary/neutral actions (cancel, back):

```typescript
bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
hover:bg-gray-300 dark:hover:bg-gray-600
focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
disabled:opacity-50 disabled:cursor-not-allowed
```

**`outlineButton()`** — Tertiary/outline actions:

```typescript
border border-gray-200 dark:border-gray-700
text-gray-700 dark:text-gray-200
hover:bg-gray-50 dark:hover:bg-gray-700
focus:ring-2 focus:ring-offset-2 focus:ring-accent-500
disabled:opacity-50 disabled:cursor-not-allowed
```

**Button sizing**: All use `px-3 py-2 text-sm rounded-md` for consistency.

**Usage pattern**:

```vue
<button :class="primaryButton()">Save</button>
<button :class="neutralButton()">Cancel</button>
<button :class="outlineButton()">More Options</button>
```

### Form Input Styles

**Standard text input pattern**:

```vue
<input
  type="text"
  class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
/>
```

**Select dropdown pattern**:

```vue
<select
  class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors cursor-pointer hover:border-accent-400 dark:hover:border-accent-600"
>
  <option>...</option>
</select>
```

**Toggle switch** (@headlessui/vue `Switch`):

```vue
<Switch
  v-model="enabled"
  :class="enabled ? 'bg-accent-600' : 'bg-gray-400 dark:bg-gray-600'"
  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
>
  <span
    :class="enabled ? 'translate-x-6' : 'translate-x-1'"
    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
  />
</Switch>
```

### Card/Container Styles

**Standard card/tile** (e.g., `ProjectTile.vue`):

```vue
<div
  class="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-400 transition-all duration-200 transform hover:scale-[1.02] group"
>
  <!-- content -->
</div>
```

**Settings panel** (e.g., `AdminSetting.vue`):

```vue
<div
  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
  <!-- content -->
</div>
```

**Alert/info boxes**:

```vue
<!-- Info alert -->
<div
  class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded"
>
  <p class="text-sm text-blue-800 dark:text-blue-300">Info message</p>
</div>

<!-- Accent alert -->
<div
  class="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-3 rounded"
>
  <p class="text-sm text-accent-800 dark:text-accent-300">Accent message</p>
</div>
```

### Icon Usage

**Material Design Icons** (`@mdi/js` via `@jamescoyle/vue-icon`):

```vue
<script setup>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount, mdiCog } from "@mdi/js";
</script>

<template>
  <svg-icon type="mdi" :path="mdiAccount" class="h-5 w-5" />
</template>
```

**Heroicons** (`@heroicons/vue`):

```vue
<script setup>
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
</script>

<template>
  <ChevronRightIcon class="h-5 w-5" />
</template>
```

**Icon sizing**: Use `h-4 w-4` (small), `h-5 w-5` (standard), `h-6 w-6` (large), `h-8 w-8` (extra large)

### Typography

**Font stack** (from `base.css`):

```
Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
```

**Common text styles**:

- Headings: `text-gray-900 dark:text-white font-semibold`
- Body text: `text-gray-700 dark:text-gray-300`
- Muted text: `text-gray-500 dark:text-gray-400`
- Monospace (code/data): `font-mono text-sm`

**Heading sizes**:

- h1: `text-3xl font-bold`
- h2: `text-2xl font-semibold`
- h3: `text-xl font-semibold`
- h4: `text-lg font-semibold`

### Dark Mode

Dark mode is toggled via `selector` strategy (not media query). The `DarkModeButton.vue` component manages the `dark` class on the root element.

**Dark mode class patterns**:

- Backgrounds: `bg-white dark:bg-gray-800`, `bg-gray-50 dark:bg-gray-700/50`
- Text: `text-gray-900 dark:text-white`, `text-gray-700 dark:text-gray-300`
- Borders: `border-gray-200 dark:border-gray-700`, `border-gray-300 dark:border-gray-600`
- Hover states: Always include dark variants, e.g., `hover:bg-gray-100 dark:hover:bg-gray-700`

**Testing dark mode**: Toggle via UI button or add `dark` class to `<html>` element in DevTools.

### Component Patterns

**Tile components** (`*Tile.vue`) — Grid layouts:

- Consistent card styling with hover effects
- Use `hover:scale-[1.02]` for subtle lift
- Border transitions to accent color on hover

**List components** (`*List.vue`, `*Table.vue`) — Tabular data:

- Striped rows: `odd:bg-gray-50 dark:odd:bg-gray-800/50`
- Hover rows: `hover:bg-gray-100 dark:hover:bg-gray-700`

**Icon components** (`*Icon.vue`) — Wrapped `SvgIcon`:

- Accept `size` prop (default: 5 for `h-5 w-5`)
- Use dynamic MDI path based on type/state

**Summary components** (`*Summary.vue`) — Dashboard metrics:

- Grid layouts with stats cards
- Use `QuickStatsCards` pattern for numerical summaries

### Transitions & Animations

**Standard transitions**:

- Colors: `transition-colors` (default timing)
- All properties: `transition-all duration-200`
- Transforms: `transition-transform`

**Custom animations** (from `tailwind.config.js`):

- `animate-progress`: Loading bar animation
- `animate-spin`: Loading spinner (Tailwind default)
- `animate-bounce-1/2/3`: Custom bounce delays (if defined)

### Spacing & Layout

**Container padding**: `p-4` (1rem), `p-5` (1.25rem), `p-6` (1.5rem)
**Gap/spacing**: `gap-2` (0.5rem), `gap-3` (0.75rem), `gap-4` (1rem)
**Rounded corners**: `rounded` (0.25rem), `rounded-lg` (0.5rem), `rounded-xl` (0.75rem)

### Accessibility

- All interactive elements must have focus rings: `focus:ring-2 focus:ring-accent-500 focus:ring-offset-2`
- Use semantic HTML (`<button>`, `<a>`, `<input>`, etc.)
- Include `aria-label` or `title` for icon-only buttons
- Form inputs need associated labels or `aria-label`

### Styling Checklist

When creating or modifying components:

1. ✅ Use accent color for primary interactive elements
2. ✅ Include dark mode variants for all color classes
3. ✅ Add focus rings (`focus:ring-2 focus:ring-accent-500`) to interactive elements
4. ✅ Use button utilities from `buttonClasses.ts` for buttons
5. ✅ Include hover states with dark variants
6. ✅ Use consistent spacing (gap, padding) and border radius
7. ✅ Add transitions (`transition-colors`, `transition-all`) for smooth interactions
8. ✅ Test in both light and dark mode
9. ✅ Validate color contrast for accessibility
10. ✅ Use semantic color classes (`sec.*` for security, not accent)

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
