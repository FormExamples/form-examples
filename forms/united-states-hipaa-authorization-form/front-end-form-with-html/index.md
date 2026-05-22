# US HIPAA Authorization — patient form (HTML)

Static single-page HTML implementation of the 9-step HIPAA-authorization
wizard. Loads with no build step; logic is plain JavaScript modules
under `js/`. Persists draft state to `localStorage`.

## Files

- `index.html` — single-page wizard.
- `css/style.css` — page styles.
- `js/app.js` — wizard state machine and step rendering.
- `js/types.js` — `HipaaAuthorization` shape and field defaults.
- `js/validation-rules.js` — pure validity-rule predicates.
- `js/sensitive-category-rules.js` — 42 CFR Part 2 and state-law rules.
- `js/flagged-issues.js` — additional-flag detection.
- `js/validate-authorization.js` — engine entrypoint.

## Run

Open `index.html` in any modern browser — no server required.

## Conventions

See [`../AGENTS.md`](../AGENTS.md) for stack-wide conventions.
