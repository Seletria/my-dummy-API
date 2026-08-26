# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

- REST API built with Express (entry point: `index.js`, routes: `api.js`)
- Data storage: SQLite via `better-sqlite3`
- Test infrastructure: not set up yet (see "Testing & Automation Roadmap")

## API Endpoints

Base URL: `http://localhost:3000` (see `index.js`). Routes are defined in `api.js` using Express Router.

| Method | Endpoint      | Description | Success | Errors |
|--------|---------------|-------------|---------|--------|
| GET    | `/`           | Health check; returns API status and list of available endpoints | 200 | – |
| GET    | `/user/:id`   | Returns a single user by numeric id | 200 | 404 if user not found |
| POST   | `/user`       | Creates a user from `{ name }`; name must be a non-empty string | 201 + created user | 400 if name invalid |
| PUT    | `/user/:id`   | Updates an existing user's name from `{ name }` | 200 + updated user | 404 if not found, 400 if name invalid |
| DELETE | `/user/:id`   | Deletes a user by id | 204 (empty) | 404 if user not found |

Implementation notes:

- User data lives in an **in-memory array** seeded at module load (`users` in `api.js`); it resets when the server restarts. `better-sqlite3` is installed but not wired up yet.
- New ids are generated as `max(existing ids) + 1`.
- Name validation is centralized in `isValidName` (`typeof string && trim !== ''`).
- Error messages come from the shared `MESSAGES` constant in `api.js`.

## Permissions

```yaml
permission:
  edit: ask
  bash:
    "npm install*": ask
    "npm i *": ask
    "yarn add*": ask
    "pnpm add*": ask
    "npx playwright*": ask
    "git push*": ask
    "git commit*": ask
    "*": allow
```

## Core Behavior Rules

1. **Ask first, act second.** Always proceed slowly, one step at a time. Explain what you intend to do and get approval BEFORE making changes. NEVER modify anything without asking the user first.
2. **NEVER silently install a package.** Never run `npm install`, `npx playwright`, or any dependency-adding command without asking first and explaining why it is needed.
3. **Git safety.** NEVER run `git commit` or `git push` without explicit user confirmation.
4. **Test architecture decisions.** If POM (Page Object Model) vs custom helpers architecture is unclear for a given file, ASK the user before deciding.
5. Keep every change minimal and strictly scoped to what was agreed upon. No drive-by refactors or unrequested extras.

## API Development

When helping develop the API:

- Respect existing patterns in `index.js` and `api.js`; do not restructure without being asked.
- Propose the endpoint/route design first, wait for approval, then implement.
- Prefer small, incremental changes over large rewrites.
- When a new dependency seems necessary, explain what it does and why, then wait for explicit approval before installing.

## Testing & Automation Roadmap

Planned work (to be done incrementally, always confirming each step with the user):

1. Set up a test runner/framework (candidate: Playwright) — package installation requires prior approval per the rules above.
2. Connect tests to the existing API endpoints.
3. Automate the test runs (e.g., npm scripts / CI) once the suite is stable.
4. Decide per-file architecture (POM vs custom commands): when unclear, ask the user before structuring test files.
