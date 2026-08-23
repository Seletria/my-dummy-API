# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

- REST API built with Express (entry point: `index.js`, routes: `api.js`)
- Data storage: SQLite via `better-sqlite3`
- Test infrastructure: not set up yet (see "Testing & Automation Roadmap")

## Permissions

```yaml
permission:
  edit: ask
  bash:
    "npm install*": ask
    "npm i *": ask
    "yarn add*": ask
    "pnpm add*": ask
    "npx cypress*": ask
    "git push*": ask
    "git commit*": ask
    "*": allow
```

## Core Behavior Rules

1. **Ask first, act second.** Always proceed slowly, one step at a time. Explain what you intend to do and get approval BEFORE making changes. NEVER modify anything without asking the user first.
2. **NEVER silently install a package.** Never run `npm install`, `npx cypress`, or any dependency-adding command without asking first and explaining why it is needed.
3. **Git safety.** NEVER run `git commit` or `git push` without explicit user confirmation.
4. **Test architecture decisions.** If POM (Page Object Model) vs custom commands architecture is unclear for a given file, ASK the user before deciding.
5. Keep every change minimal and strictly scoped to what was agreed upon. No drive-by refactors or unrequested extras.

## API Development

When helping develop the API:

- Respect existing patterns in `index.js` and `api.js`; do not restructure without being asked.
- Propose the endpoint/route design first, wait for approval, then implement.
- Prefer small, incremental changes over large rewrites.
- When a new dependency seems necessary, explain what it does and why, then wait for explicit approval before installing.

## Testing & Automation Roadmap

Planned work (to be done incrementally, always confirming each step with the user):

1. Set up a test runner/framework (candidate: Cypress) — package installation requires prior approval per the rules above.
2. Connect tests to the existing API endpoints.
3. Automate the test runs (e.g., npm scripts / CI) once the suite is stable.
4. Decide per-file architecture (POM vs custom commands): when unclear, ask the user before structuring test files.
