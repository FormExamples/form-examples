# Agile Consulting Scorecard for Hiring Help — Documentation

- [`AGENTS.md`](./AGENTS.md) — reference materials and published
  authorities behind each cluster of items (the manifesto, the
  principles, NPS, 3-amigos, Lean / Six Sigma / Vanguard, retros).
- [`running.md`](./running.md) — how to run each subcomponent end-to-end
  (Rust axum server, SvelteKit wizard, SvelteKit dashboard, static HTML
  triple, tests, schema regeneration, engine-parity regeneration).
- [`api-reference.md`](./api-reference.md) — request / response shapes
  for the nine HTTP endpoints exposed by the Rust axum server
  (`/api/agile-consulting-scorecard-for-hiring-help/dashboard/scorecards`, `/api/agile-consulting-scorecard-for-hiring-help/scorecards/{id}`, `/api/agile-consulting-scorecard-for-hiring-help/stats`,
  `/api/agile-consulting-scorecard-for-hiring-help/scorecards`, `/api/agile-consulting-scorecard-for-hiring-help/grade`, `/api/agile-consulting-scorecard-for-hiring-help/recommendations`,
  `/api/agile-consulting-scorecard-for-hiring-help/pre-tender`, `/api/agile-consulting-scorecard-for-hiring-help/diff`, `/api/agile-consulting-scorecard-for-hiring-help/bulk-import`), with curl
  examples.
