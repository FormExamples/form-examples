# Tasks: WHO Surgical Safety Checklist — Full Stack (new)

- [ ] Bootstrap a fresh Loco app inside this directory (`loco new --name who-surgical-safety-checklist --db postgres --bg async --assets none`)
- [ ] Run `../back-end-with-loco-setup` to scaffold all four resources
- [ ] Single-page three-phase wizard (Sign In, Time Out, Sign Out)
- [ ] Inline team-roster sub-form during Time Out (HTMX add/remove rows)
- [ ] Coordinator sign-off gating between phases
- [ ] Conditional fields via Alpine.js (allergy detail, blood-loss IV plan, etc.)
- [ ] Report view: signed timestamped record per case
- [ ] `/dashboard` listing view
- [ ] Cargo tests: lifecycle transitions, paediatric blood-loss threshold, allergy-detail requirement
- [ ] Promote this crate to replace `../back-end-with-loco/` once at parity
- [ ] Verify with `bin/test-form who-surgical-safety-checklist`
