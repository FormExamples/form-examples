# WHO Surgical Safety Checklist — front-end form (HTML) tasks

## Active

- [ ] Smoke-test the wizard in Safari, Chrome, and Firefox from `file://`.
- [ ] Verify exports import cleanly into the SvelteKit dashboard.
- [ ] Confirm the printable HTML window renders on A4 / Letter.
- [ ] Audit safety-flag wording against `../index.md` "Safety flags" table.
- [ ] Spot-check field labels against `../sql-migrations/04_*.sql` comments.

## Done

- [x] Scaffold `index.html`, `css/style.css`, and the four JS files.
- [x] Build step panels 0–4 in `js/app.js`.
- [x] Wire `Previous` / `Next` / `Start over` and step-indicator buttons.
- [x] Persist state to `localStorage` on every change.
- [x] Render summary, status pill, and safety flags on step 4.
- [x] Hook up JSON / XML / CSV / TSV / Print exports.
- [x] Author `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`.
