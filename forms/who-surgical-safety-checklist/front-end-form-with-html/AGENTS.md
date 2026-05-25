# WHO Surgical Safety Checklist — front-end form (HTML) agent instructions

See [`./index.md`](./index.md) for the file index and runtime overview,
and [`../AGENTS.md`](../AGENTS.md) for the form-wide design spec.

## Pattern

Static, dependency-free, vanilla HTML / CSS / JavaScript. No bundler, no
package manager, no transpiler. The page works when opened directly via
`file://` URLs.

- **Classic scripts only** — every JS file is loaded as a plain
  `<script src="…">` tag in `index.html`, *not* as `type="module"`.
  Browsers block ES-module imports from `file://` for CORS reasons, but
  ordered classic scripts work everywhere.
- **One IIFE per file** — wrap the whole-file body in an immediately-
  invoked function expression so top-level locals don't leak to the
  global scope.
- **Single namespace** — each file attaches its public exports to
  `window.WhoSurgicalSafetyChecklist`. Other files pull what they need
  off that namespace.

## Load order

1. `js/types.js`   — `emptyChecklist()`, `emptyTeamMember()`,
   `deriveStatus()`, `isSignInComplete()`, `isTimeOutComplete()`,
   `isSignOutComplete()`, `statusLabel()`.
2. `js/flags.js`   — `computeFlags(state)`.
3. `js/exports.js` — `toJson`, `toXml`, `toCsv`, `toTsv`,
   `toPrintableHtml`, `download`, `openPrintable`.
4. `js/app.js`     — wizard controller (DOMContentLoaded entrypoint).

Add new modules in the same style: IIFE wrapper, attach to
`window.WhoSurgicalSafetyChecklist`, and reference upstream symbols
through `NS` destructured at the top of the file.

## State shape

The single source of truth is the in-memory `state` object built by
`emptyChecklist()`. Fields follow the SQL → camelCase mapping:

- `caseDetails.*`            — Step 0 (`patientName`, `urgency`, …)
- `signIn.*`                 — Step 1
- `timeOut.*`                — Step 2
- `signOut.*`                — Step 3
- `teamMembers[]`            — Time Out roster
- `summary.abandonedReason`  — only set when a case is abandoned

Unanswered text / enum fields default to `''`. Unanswered numeric
fields default to `null`. Do not introduce `undefined`.

## Persistence

Persisted to `localStorage` under the key
`who-surgical-safety-checklist-draft`. The loader merges saved state
into a fresh `emptyChecklist()` so newly-added fields default
correctly when an older draft is rehydrated.

## UI rules

- Single-page wizard — never split into separate HTML files.
- Exactly five step panels (0–4); only one visible at a time
  (`.step-panel-hidden` toggles the rest).
- Progress bar reflects `answered / total` over the `REQUIRED_FIELDS`
  list in `app.js`. Update it on every `setField` call.
- Step-indicator buttons should be clickable so users can jump
  between phases.

## Verification

```sh
bin/test-form who-surgical-safety-checklist
```

Open `index.html` in a browser to smoke-test by hand. All work happens
client-side; there is no dev server.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
