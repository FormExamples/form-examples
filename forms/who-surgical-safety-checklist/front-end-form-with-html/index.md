# WHO Surgical Safety Checklist — front-end form (static HTML)

A single-page, step-by-step wizard implementation of the WHO Surgical Safety
Checklist (WHO/IER/PSP/2008.05, *Safe Surgery Saves Lives*), built with
plain HTML, CSS, and vanilla JavaScript. No build step, no bundler, no
runtime dependencies. Open `index.html` directly in a browser
(`file://...`) — everything runs client-side.

## Files

```
front-end-form-with-html/
  index.html         single-page wizard shell, step indicator, navigation
  css/style.css      complete stylesheet (mobile-first, no framework)
  js/types.js        empty-checklist factory, status derivation, types
  js/flags.js        computeFlags(state) — safety-flag computation
  js/exports.js      JSON / XML / CSV / TSV / printable-HTML exporters
  js/app.js          wizard controller: panel rendering, navigation,
                     localStorage persistence, progress bar, summary
  index.md           this file
  README.md          symlink to index.md (for GitHub rendering)
  AGENTS.md          agent instructions for this subproject
  plan.md            implementation plan and status
  tasks.md           task tracking
```

## How it runs

Open `index.html` directly — **no build step**. Each JavaScript file is
loaded as a classic `<script>` tag (not an ES module), so the page works
from `file://` URLs where browsers block ES-module imports for CORS
reasons. Every file is wrapped in an IIFE and attaches its public symbols
to `window.WhoSurgicalSafetyChecklist`.

## Wizard steps

| # | Step          | What is captured                                           |
| - | ------------- | ---------------------------------------------------------- |
| 0 | Case details  | Patient identity, lead team, site, planned procedure       |
| 1 | Sign In       | 7 pre-induction items, allergy detail, coordinator sign-off |
| 2 | Time Out      | 10 pre-incision items, team-member roster, sign-off        |
| 3 | Sign Out      | 5 pre-departure items, sign-off                            |
| 4 | Summary       | Full record, safety flags, status, exports, abandon-case   |

The five panels are rendered into `<div id="step-panels">` by
`js/app.js`. Only the current panel is visible; the rest carry the
`.step-panel-hidden` class. Users can step through with the
**Previous** / **Next** buttons or jump directly via the step-indicator
buttons at the top of the page.

## Persistence

State is saved to `localStorage` under the key
`who-surgical-safety-checklist-draft` on every field change. Reloading
the page restores the draft. **Start over** clears the stored draft.

## Exports

The summary panel offers:

- **JSON** — `toJson()`
- **XML**  — `toXml()`
- **CSV**  — `toCsv()`
- **TSV**  — `toTsv()`
- **Print** — opens a printable HTML window via `toPrintableHtml()`

## Safety flags

`js/flags.js` computes the safety-flag list independently of phase
completion. Flags are sorted high → medium → low and shown on the
summary panel.

## Compliance notes

Class I medical device software under MDCG 2019-11 Rev.1 — the output is
a process-adherence record only. Final clinical decisions remain the
responsibility of the operating team.
