# front-end-dashboard-with-svelte — Tasks

- [x] `package.json`, SvelteKit + Svelte 5 + Tailwind 4 + SVAR Grid dep
- [x] `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- [x] `src/app.html`, `src/app.css`, `src/app.d.ts`
- [x] `src/lib/data/sample.ts` with sample register data
- [x] `src/lib/api/adrs.ts` fetcher with fallback
- [x] `src/routes/+layout.svelte`
- [x] `src/routes/+page.svelte` with sortable, filterable register
- [x] Status pill renderer (Tailwind colour palette)
- [x] Free-text search across title / slug / author
- [ ] Replace plain table with SVAR DataGrid for column reorder and
      multi-column sort
- [x] `src/routes/[slug]/+page.svelte` renders the ADR Markdown inline
      with a status pill header. Clicking a row in the register now
      navigates to `/{slug}` instead of opening the raw `.md`. The page
      calls `fetchAdr(slug)`, which hits `GET /api/adrs/{slug}` on the
      Loco backend (a new endpoint that returns metadata + rendered
      Markdown in one round trip); shows a "not found" panel when the
      backend is unreachable or the slug is unknown.
- [x] Read from the real Loco backend. `fetchAdrs()` now honours
      `VITE_API_BASE_URL` — set it to `http://localhost:5150` in
      `.env.local` to point the dashboard at a running backend.
      `resolveMarkdownUrl()` prefixes row-relative `markdownUrl` paths
      with the backend origin so cross-origin links open correctly.
      Loco's `cors` middleware is enabled in
      `config/development.yaml` with `http://localhost:5173`/`:4173`
      whitelisted; verified live with preflight + GET returning
      `access-control-allow-origin: http://localhost:5173`.
