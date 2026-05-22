# Eye Prescription — HTML Dashboard

Static HTML + Alpine.js review dashboard for the eye-prescription form,
no build step. Mirrors the SvelteKit dashboard's column layout but
without DataGrid features (sort / filter implemented in pure JS).

See the form-wide [`../AGENTS.md`](../AGENTS.md) for the design.

> **Status:** scaffolded; full implementation is deferred.

## Target structure

```
index.html
assets/
  script.js          # Alpine.js component (state, sort, filter)
  sample-data.js     # static sample prescriptions
```

## Columns

Same column set as the SvelteKit dashboard; see that AGENTS.md.

## Verify

Open `index.html` in a browser.
