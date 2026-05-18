# ICVP — Static HTML review dashboard

A self-contained static HTML / CSS / vanilla-JS dashboard that displays a
sortable, filterable table of issued ICVP certificates. No build step. Open
`index.html` directly in a browser to see it.

## Columns

- Certificate serial number
- Vaccinee surname, given names
- Issuing centre name
- Primary disease (`yellow-fever` / `polio` / …) — derived from the first
  entry
- Number of entries
- Vaccination date (most recent)
- Validity status (`valid` / `waiver` / `expired` / `draft`)
- Status (`draft` / `issued` / `reissued` / `revoked`)

## Filters

- Disease dropdown
- Status dropdown
- Centre dropdown
- Free-text search over surname / given names / serial number

Selecting a row opens a side panel listing the certificate's vaccination
entries.

## Files

- `index.html` — page shell with filters, table, and the row-detail panel.
- `styles.css` — minimal responsive layout.
- `script.js` — sample data, table rendering, sort, filter, row-detail
  rendering.

## Running

```sh
open index.html
```
