# Agile Consulting Scorecard for Hiring Help — Documentation

- [`AGENTS.md`](./AGENTS.md) — reference materials and published
  authorities behind each cluster of items (the manifesto, the
  principles, NPS, 3-amigos, Lean / Six Sigma / Vanguard, retros).
- [`running.md`](./running.md) — how to run each subcomponent end-to-end
  (Rust axum server, SvelteKit wizard, SvelteKit dashboard, static HTML
  triple, tests, schema regeneration, engine-parity regeneration).
- [`api-reference.md`](./api-reference.md) — request / response shapes
  for the nine HTTP endpoints exposed by the Rust axum server
  (`/api/dashboard/scorecards`, `/api/scorecards/{id}`, `/api/stats`,
  `/api/scorecards`, `/api/grade`, `/api/recommendations`,
  `/api/pre-tender`, `/api/diff`, `/api/bulk-import`), with curl
  examples.
