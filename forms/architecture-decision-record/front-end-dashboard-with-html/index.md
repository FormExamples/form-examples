# Front-end Dashboard (HTML)

A static HTML dashboard that lists architecture decision records in a flat
register table. Read-only.

Open `index.html` directly in a browser — no build, no server, no install.

## Files

- `index.html` — page shell with filter bar and table
- `css/style.css` — hand-written CSS with status pills
- `js/data.js` — sample register data (replace with a generated
  `data/adrs.json` in production)
- `js/app.js` — sorting, filtering, search, and row navigation

## Columns

- **Number** — sequential ADR number, zero-padded
- **Title** — short title
- **Status** — pending / decided / approved / superseded / deprecated
  (rendered as a colour-coded pill)
- **Group** — Tyree & Akerman category
- **Date** — decision date
- **Author** — name

## Filters

- Status — radio button group, single select
- Group — dropdown, single select
- Search — free text across title, slug, and author

Clicking a row opens the rendered Markdown for that ADR in a new tab.
