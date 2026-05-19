# WHO Surgical Safety Checklist — HTML dashboard agent instructions

Static HTML review dashboard for completed WHO Surgical Safety Checklist
cases. Vanilla JavaScript (no modules — classic `<script>` tags), no
framework, no build step. Backed by sample data in `js/sample-data.js`
with a graceful fallback when the backend at `http://localhost:5150` is
unreachable.

## Files

- `index.html` — page shell with filter bar, sortable table, detail modal
- `css/style.css` — single stylesheet (mobile-first, system fonts)
- `js/types.js` — JSDoc type aliases (no runtime exports)
- `js/sample-data.js` — 12 representative cases for offline / demo use
- `js/api.js` — `fetchChecklists()` backend client
- `js/app.js` — render, sort, filter, modal logic

All four scripts attach their public symbols to a single global namespace:
`window.WhoSurgicalSafetyChecklistDashboard`.

## Data shape

Each row in the table is a `ChecklistRow`:

```
{
  id,                  // UUID
  caseDate,            // ISO YYYY-MM-DD
  patient,             // display name
  site,                // facility name
  operatingRoom,       // OR number / name
  surgeon,             // display name
  anaesthetist,        // display name
  leadNurse,           // display name
  urgency,             // 'elective' | 'urgent' | 'emergency' | 'immediate'
  specialty,           // surgical specialty
  status,              // lifecycle status (kebab-case)
  flags,               // string[] of safety-flag identifiers
  phase1: { ... },     // Sign In items
  phase2: { ... },     // Time Out items
  phase3: { ... },     // Sign Out items
  team: [{ name, role, introducedDuringTimeOut }],
  abandonedReason
}
```

See `js/types.js` for the canonical JSDoc shape.

## Backend integration

`fetchChecklists()` hits `GET http://localhost:5150/api/checklists` and
accepts either a bare array or `{ items, total }` envelope. On any fetch
failure the page falls back to `sampleChecklists` and shows a small
warning banner.
