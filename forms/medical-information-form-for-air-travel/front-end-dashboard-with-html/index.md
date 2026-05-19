# Medical Information Form for Air Travel — static HTML dashboard

Static HTML medical-desk dashboard for **MEDIF** submissions: a sortable,
filterable table summarising multiple MEDIF assessments at a glance.
Built with plain HTML, CSS, and vanilla JavaScript — no framework, no
build step, no server.

The dashboard ships with a baked-in sample dataset (8 illustrative rows)
covering all four fitness bands (`fit`, `fit-with-conditions`,
`requires-review`, `unfit-to-fly`) and a mix of clinical reasons.

## Running

Open `index.html` directly from the file system:

```sh
open index.html
```

Or serve from any static web server:

```sh
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Files

- `index.html` — dashboard shell, filter bar, assessments table
- `css/style.css` — table styling, badges, mobile-friendly scroll
- `js/app.js` — sample dataset, sort + filter state, render logic

## Columns

Passenger, airline, flight, departure date, primary diagnosis, fitness
band, safety-flag count, and status.

## Filters and sort

Click any column header to sort (ascending → descending → ascending).
Filter by fitness band, lifecycle status, presence of safety flags, or a
free-text search across passenger name, airline, flight number,
diagnosis, and booking reference.
