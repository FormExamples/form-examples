# WHO Surgical Safety Checklist — Full Stack with Rust Axum Loco Tera

Agent instructions for the full-stack Rust implementation. See
[`./index.md`](./index.md) for the project description and
[`../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the project-wide conventions.

## Scaffold

Generate the Loco crate by running the sibling setup script (one-time,
after bootstrapping the Loco app with `loco new`):

```sh
../full-stack-with-loco-tera-htmx-alpine-setup
```

The setup script lives at
`forms/who-surgical-safety-checklist/full-stack-with-loco-tera-htmx-alpine-setup`
and chains four `cargo loco generate scaffold ... --htmx` invocations
matching the SQL migrations in `sql-migrations/`.

## Routes

The three-phase checklist is presented as **one continuous single-page
wizard**, per the project's mandatory UI rule. Multi-page navigation is
not allowed.

- `GET  /` — landing page (start new case, list recent cases)
- `GET  /cases/new` — single-page wizard for a new case
- `POST /cases` — create the case and persist Phase 1 (Sign In)
- `GET  /cases/:id` — single-page wizard rehydrated to the case state
- `POST /cases/:id` — patch updates from any phase (HTMX-driven)
- `GET  /cases/:id/report` — signed, printable timestamped record
- `GET  /dashboard` — case-listing dashboard

## Phases and sign-off

Each phase has a designated coordinator (typically the circulating
nurse). The wizard captures:

1. **Sign In** — before induction of anaesthesia
2. **Time Out** — before skin incision
3. **Sign Out** — before the patient leaves the operating room

The team roster (`team_member` rows) is captured during Time Out
introductions.

## Compliance

See the project-wide compliance references in the root `AGENTS.md`.
