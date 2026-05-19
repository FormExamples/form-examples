# Plan: WHO Surgical Safety Checklist — Full Stack (new)

## Current status

Not started. Empty redesign workspace.

## Implementation plan

1. Bootstrap a fresh Loco app inside this directory:

   ```sh
   loco new --name who-surgical-safety-checklist --db postgres --bg async --assets serverside
   ```

2. Run `../full-stack-with-loco-tera-htmx-alpine-setup` to scaffold the
   four resources from the SQL migrations in FK-safe order.
3. Collapse the four per-table CRUD UIs into a single-page three-phase
   wizard (Sign In, Time Out, Sign Out) plus an inline team-roster
   sub-form in Time Out.
4. Reach feature parity with the sibling
   [`../full-stack-with-loco-tera-htmx-alpine/`](../full-stack-with-loco-tera-htmx-alpine/)
   crate, then promote this directory to replace it.
5. Cargo tests: lifecycle transitions, paediatric blood-loss threshold,
   allergy-detail requirement, coordinator sign-off gating.

See [AGENTS.md](AGENTS.md) for layout details.
