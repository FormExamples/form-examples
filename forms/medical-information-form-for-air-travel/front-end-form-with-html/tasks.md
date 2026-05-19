# Static HTML MEDIF wizard — task list

- [x] Scaffold `index.html` page shell with header, sticky progress bar,
  `<main>` 14-section container, Submit / Reset buttons, and report region.
- [x] Author `css/style.css` mobile-first stylesheet (section cards, radio
  chips, fitness-band badges, safety-flag list).
- [x] Render all 14 wizard steps inline with Alpine.js `x-data` for
  conditional sub-questions.
- [x] Implement progress tracking that counts answered fields and updates
  the `role="progressbar"` element live.
- [x] Implement the fitness-band engine in `js/app.js` covering every
  airline-aligned rule from `../AGENTS.md`.
- [x] Implement safety-flag detection with high / medium / low priority.
- [x] Render the post-submit report card with band badge, fired-rule list,
  and safety-flag list.
- [x] Add JSON download of the full assessment payload.
- [x] Add localStorage autosave + restore.
- [ ] Wire up CSV / TSV download (future enhancement).
- [ ] Add PDF export via `pdfmake` (future enhancement).
