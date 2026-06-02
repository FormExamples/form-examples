# Tasks: WHO Surgical Safety Checklist — Full Stack

- [x] Generate `back-end-with-loco-setup` from SQL migrations
- [ ] Bootstrap Loco app with `loco new --name who-surgical-safety-checklist --db postgres --bg async --assets serverside`
- [ ] Create `loco` Postgres role and `_development` / `_test` / `_production` databases
- [ ] Run the setup script to scaffold `patient`, `clinician`, `who_surgical_safety_checklist`, `team_member`
- [ ] Replace per-table CRUD with the single-page three-phase wizard (Sign In, Time Out, Sign Out)
- [ ] Inline `team_member` sub-form in the Time Out phase (HTMX add/remove rows)
- [ ] Coordinator sign-off gating between phases
- [ ] Conditional fields via Alpine.js (allergy detail, blood-loss IV plan, etc.)
- [ ] Report view: signed timestamped record per case
- [ ] `/dashboard` listing view
- [ ] Cargo tests: lifecycle transitions, paediatric blood-loss threshold, allergy-detail requirement
- [ ] Verify with `bin/test-form who-surgical-safety-checklist`
