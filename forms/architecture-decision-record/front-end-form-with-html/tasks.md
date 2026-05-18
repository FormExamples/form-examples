# front-end-form-with-html — Tasks

- [x] `index.html` page shell with skip link, header, progress meter
- [x] `css/style.css` hand-written styles
- [x] `js/app.js` state, rendering, Markdown export
- [x] 16-section wizard
- [x] Dynamic positions list (add / remove / mark chosen)
- [x] Append-only notes list
- [x] Markdown clipboard + download
- [x] localStorage autosave under key `adr.form.v1`. Form state writes
      on every change via `saveToStorage()` called from `updateProgress()`.
      On load, `loadFromStorage()` merges the saved blob with `emptyData()`
      so a schema growth doesn't break old drafts. "Start over" clears
      storage as well as the in-memory state.
- [x] Import an existing Markdown ADR back into the form via a hidden
      file input next to the action buttons. `parseMarkdown()` reverses
      `buildMarkdown()`: extracts `# NNNN — title`, metadata bullets,
      the 10 textarea sections (with `_TBD_`/`_None._` collapsed to ''),
      the 4 related-* bullet lists, `### N. <name>  ✓ chosen` positions
      with description, model URL, pros/cons, the notes timeline (with
      `unknown` → empty author), and the sign-off footer. Confirmed
      round-trip via Node: every field of a buildMarkdown-emitted ADR
      parses back exactly.
