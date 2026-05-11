# Tasks

- [x] Author `index.html` containing the 10-step single-page wizard
- [x] Author `css/style.css` for layout and print
- [x] Author `js/scoring.js` mirroring the TypeScript scoring engine
- [x] Author `js/app.js` to wire the form to the engine and render the
      report inline (no separate `report.html` page)
- [x] Verify end-to-end with Playwright: opens the page via `file://`,
      fills a clinical-safety + severity-5 + harm-2 + failure-A scenario,
      clicks "Grade issue", and confirms composite=critical with the
      regulatory safety flag firing

## Pending

- [ ] Print-friendly layout polish (current CSS hides actions only)
- [ ] localStorage autosave
- [ ] Embed JSON / FHIR-Bundle export buttons
