# Tasks

- [x] Author `index.html` with the review table and filter chrome
- [x] Author `css/style.css` for layout and composite-priority badges
- [x] Author `js/dashboard.js` for sort, filter, and search
- [x] Author `js/sample-data.js` (10 representative issues across the four
      composite bands) — inlined as a JS global so the page works via
      `file://` without `fetch()` CORS issues
- [x] Verify end-to-end with Playwright: load page, filter to
      composite=critical, search for "outage", and toggle sort direction
      on the Reported column

## Pending

- [ ] Print-friendly stylesheet
- [ ] Pagination for > 50 rows
- [x] CSV export — pure TypeScript exporter authored at
      `../front-end-form-with-svelte/src/lib/dashboard/csv.ts`
      (`toCsv(rows, columns?)` plus `downloadCsv(rows, filename?)`).
      RFC 4180 compliant (CRLF, quoted-and-escaped cells), with
      OWASP CSV-injection mitigation that prefixes formula leaders
      (`=`, `+`, `-`, `@`) with a single quote. Verified by
      `csv.test.ts` (11 tests passing — total Vitest 60/60). Wiring
      this into a static-HTML dashboard `<button>` is left to the
      static-HTML port.
