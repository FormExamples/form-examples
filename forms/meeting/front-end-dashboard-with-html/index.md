# Meeting — Front-end Dashboard (HTML)

Static HTML review dashboard for the meeting form. A single `index.html`
renders a sortable table of meetings with their status, category,
participant count, fired rules, and overall result. No framework, no
build step — `index.html` plus hand-authored CSS and vanilla JavaScript.

Sample data lives in `sample.json` and is loaded via `fetch()`; in the
deployed full-stack the dashboard reads the same JSON shape from the
Rust backend's `/api/meetings` endpoint.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions and
[`plan.md`](./plan.md) for the implementation roadmap.
