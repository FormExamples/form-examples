# UK Lasting Power of Attorney for Financial Decisions — HTML dashboard

Static HTML + Alpine.js dashboard listing LP1F lasting powers of attorney
with donor name, attorney count, decision mode, when-act, replacements,
people-to-notify, validity band, composite risk, and OPG status. Read-only
review view suitable for a solicitor's caseload or an OPG-intake desk.

## Stack

- HTML5
- Tailwind via the Play CDN
- Alpine.js 3.14.8 via jsDelivr CDN
- Vanilla JavaScript sort and filter
- Sample fixtures in `js/sample-data.js` (8 LPAs at various stages)

## Running

```sh
# From this directory:
python3 -m http.server 8080
```

Open <http://localhost:8080>.

The page also runs directly from `file://` — open `index.html` in a modern
browser (CDNs require network).

## Files

- `index.html` — single-page review dashboard.
- `css/styles.css` — component overrides on top of Tailwind.
- `js/sample-data.js` — 8 LPA rows covering each band and risk level.
- `js/app.js` — Alpine `lpaDashboard()` factory: filters, sort, badges.

## Columns

donor name | attorney count | decision mode | when-act | replacements |
people-to-notify | validity band | composite risk | OPG status | created.
