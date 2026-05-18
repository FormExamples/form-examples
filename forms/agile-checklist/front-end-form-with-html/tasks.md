# Agile Checklist — Static HTML Form Tasks

## Done

- [x] Author `js/items.js` with the 57 items
- [x] Author `js/engine.js` mirroring the Svelte composite grader
      (section-percent algorithm, n/a denominator handling, all flags)
- [x] Author `index.html` and `js/app.js`
- [x] Style with `css/style.css`
- [x] Browser smoke test: 57/57 items answered, computed maturity matches
      SvelteKit form exactly (89% MATURE with section-imbalance and
      psychological-safety flags), 0 console errors
- [x] LocalStorage autosave + draft recovery (persists on every change,
      restores on reload, "Keep editing" / "Discard draft" banner, "Saved"
      indicator under the progress bar). Browser smoke-tested end-to-end.
- [x] CSV export of the per-item answers — "Download CSV" button in the
      report, exports a 4-section CSV (respondent, summary, items, action
      plan, flags). Verified end-to-end via Playwright with a real download.

## Pending
