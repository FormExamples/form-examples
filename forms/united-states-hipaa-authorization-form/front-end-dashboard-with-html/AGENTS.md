# front-end-dashboard-with-html — Agent Instructions

Static HTML review dashboard for signed HIPAA authorizations.

## Stack

- Plain HTML, CSS, JavaScript ES modules.
- No bundler; no transpiler.
- Loads data from `/api/authorizations` when available; falls back to
  `js/sample-data.js` when standalone.

## Conventions

- One row per authorization.
- Validity status badges: green for valid, red for invalid, grey for
  revoked or expired.
- High-priority flags rendered as count badges.
- Click-through to the underlying authorization detail (HTML form).
