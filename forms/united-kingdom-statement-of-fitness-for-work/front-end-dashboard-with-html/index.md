# Dashboard — static HTML

Static HTML + vanilla JavaScript dashboard for reviewing UK Statement of
Fitness for Work (Med 3 / fit note) submissions. Read-only review surface for
practice managers, occupational-health teams, and DWP liaison staff who need
to triage recent fit notes by recommendation, fitness category, period
compliance, and safety-flag count.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No build step, no framework, no CDN dependencies.
- Classic `<script>` tags so the page can be opened from `file://` on
  air-gapped NHS workstations.
- NHS visual identity (NHS Blue `#005eb8`, NHS Warm Yellow `#ffb81c`).

## Files

- `index.html` — page shell, summary header, filter bar, sortable table.
- `css/style.css` — NHS-styled stylesheet (no framework dependencies).
- `js/sample-data.js` — twelve realistic fit-note records.
- `js/app.js` — table renderer, filter bindings, click-to-sort.

## Running

Open `index.html` in any modern browser, or serve the directory with
`python3 -m http.server 8080`.
