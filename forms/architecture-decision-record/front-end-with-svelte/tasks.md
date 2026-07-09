# front-end-with-svelte — Tasks

- [x] `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- [x] `src/app.html`, `src/app.css`, `src/app.d.ts`
- [x] `src/lib/types.ts`
- [x] `src/lib/stores/adr.svelte.ts`
- [x] `src/lib/config/steps.ts`
- [x] `src/lib/report/build-markdown.ts`
- [x] `src/routes/+layout.svelte`
- [x] `src/routes/+page.svelte`
- [x] `src/routes/report/+page.svelte`
- [x] All 16 `StepNName.svelte` components
- [x] Vitest unit tests for `buildMarkdown` — 8 tests covering minimal
      placeholders, number zero-padding, conditional author/org fields,
      positions with chosen marker and pros/cons bullets, related-*
      bullet rendering with blank-line filtering, notes with unknown-
      author fallback, sign-off footer, and unnamed-position fallback.
      Run with `pnpm test`.
- [ ] Playwright e2e for the happy path
- [x] localStorage autosave under key `adr.form.v1`. The store's
      `enableAutosave()` registers a `$effect` that serialises
      `store.data` to `localStorage` on every change; on construct it
      reads any saved blob via `loadFromStorage()`, merging into
      `emptyAdrFormData()` so additive schema changes are tolerated.
      `reset()` clears the storage key. `+page.svelte` calls
      `enableAutosave()` and exposes a "Discard draft" button.
- [x] Markdown import — `parseMarkdown()` reverses `buildMarkdown()`
      back into `AdrFormData`. Wired into `+page.svelte` via an
      "Import .md" file-input next to the action buttons; the store
      exposes `replace(data)` so import + autosave compose cleanly. 3
      Vitest tests including a full round-trip through `buildMarkdown`
      assert every field round-trips exactly, including unknown-author
      collapse and unknown-status rejection.
- [x] Round-trip regression test against the real example ADR at
      `../doc/0001-use-tyree-and-akerman-template.md`. 5 tests read
      the file, parse it, assert metadata + position count + chosen
      flag + pros/cons counts + related-* counts, and do a full
      parse → buildMarkdown → parse loop with deep-equality. Catches
      any future drift between the parser and emitter.
