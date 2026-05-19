# WHO Surgical Safety Checklist — front-end form (HTML) plan

Static, dependency-free single-page wizard. Five steps:
**Case details → Sign In → Time Out → Sign Out → Summary**.

## Phases

### Phase 1 — Scaffold  (done)

- [x] `index.html` shell with header, step indicator, progress bar, nav.
- [x] `css/style.css` with mobile-first layout, radio cards, summary
      grid, status pills, and print rules.
- [x] Classic-script load order: `types.js`, `flags.js`, `exports.js`,
      `app.js`.

### Phase 2 — Step panels  (done)

- [x] `buildStep0()` — patient, lead team, site, procedure.
- [x] `buildStep1()` — Sign In, 7 items + coordinator sign-off.
- [x] `buildStep2()` — Time Out, 10 items + team-member roster.
- [x] `buildStep3()` — Sign Out, 5 items + sign-off.
- [x] `buildStep4()` — summary, safety flags, abandon-case, exports.

### Phase 3 — Persistence  (done)

- [x] `localStorage` key `who-surgical-safety-checklist-draft`.
- [x] Load merges saved state into a fresh `emptyChecklist()`.
- [x] Save on every `setField` / team-roster change.
- [x] `Start over` clears storage and re-renders.

### Phase 4 — Exports  (done)

- [x] JSON / XML / CSV / TSV downloads on the summary panel.
- [x] Printable HTML via `openPrintable(toPrintableHtml(...))`.
- [x] Filename derived from case date + patient name.

### Phase 5 — Review polish  (pending)

- [ ] Smoke-test in Safari, Chrome, Firefox from `file://`.
- [ ] Cross-check field labels against `sql-migrations/04_*.sql`
      comments.
- [ ] Verify safety-flag wording matches `index.md` table.
- [ ] Confirm reduced-motion and print stylesheets render correctly.
