# Meeting — Front-end Dashboard (SvelteKit)

SvelteKit 2.x + Svelte 5 review dashboard for the meeting form. Renders
meetings as a SVAR DataGrid (`@svar-ui/svelte-grid`) styled with the
Willow theme. Sortable columns, dropdown filters (status, category,
result), and a free-text search over title.

The dashboard pulls from a backend API client with a sample-data
fallback so the page is usable when the Rust backend is offline. Each
row deep-links into the SvelteKit front-end form at
`/meeting/1/<id>` for editing.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions and
[`plan.md`](./plan.md) for the implementation roadmap.
