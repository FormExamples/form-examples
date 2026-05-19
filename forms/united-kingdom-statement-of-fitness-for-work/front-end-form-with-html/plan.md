# Plan: HTML Fit-Note Wizard

Build a static single-page HTML + vanilla JavaScript implementation of the
UK fit note ten-step wizard that runs from `file://` with no dependencies.

## Build order

1. [x] Page shell `index.html` with the ten step sections.
2. [x] `css/style.css` with mobile-first responsive layout.
3. [x] `js/types.js` factory for an empty fit note.
4. [x] `js/grader.js` rule sets matching the canonical TypeScript engine.
5. [x] `js/app.js` wizard renderer, autosave, report renderer.
6. [x] Manual smoke-test in a browser.

## Future enhancements

- Print stylesheet matching the DWP Med 3 layout precisely.
- IndexedDB persistence for multiple drafts.
- Service-worker caching for offline use.
- Welsh-language toggle for NHS Wales.
