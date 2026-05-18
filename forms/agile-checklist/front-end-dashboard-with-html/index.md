# Agile Checklist — Static HTML Dashboard

A static review dashboard rendering recent agile-checklist submissions
as a sortable HTML table. Runs under `file://` or any static-file
server.

## Layout (planned)

```
front-end-dashboard-with-html/
  index.html
  css/style.css
  js/sample.js         # sample data
  js/app.js            # render, sort, filter
```

## Conventions

- Classic `<script>` tags so the page works under `file://`.
- All public symbols attach to `window.AgileChecklistDashboard`.
- Sort handled with vanilla JS click handlers on column headers.
