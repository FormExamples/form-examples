# Agile Checklist — SvelteKit Form Tasks

## Done

- [x] Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project
- [x] Encode the 57 items in `src/lib/config/items.ts`
- [x] Engine `types.ts`, `factory.ts`
- [x] Engine `composite-grader.ts` with section-percent algorithm
- [x] Engine `maturity-rules.ts` (per-section coaching rules)
- [x] Engine `flagged-issues.ts` (cross-cutting flags)
- [x] Vitest unit tests covering thresholds, n/a handling, and every flag
- [x] `Step01Respondent.svelte`
- [x] `Step02Teams.svelte` with 25 yes/no/n-a items
- [x] `Step03Stakeholders.svelte` with 14 yes/no/n-a items
- [x] `Step04Practices.svelte` with 18 yes/no/n-a items
- [x] `Step05Summary.svelte` with maturity, bands, rules, flags, sign-off
- [x] Report route with `pdfmake` export
- [x] `pnpm run check` passes (0 errors, 0 warnings)
- [x] `pnpm test` passes (30/30 — 21 composite-grader + 9 schema)
- [x] `pnpm build` succeeds
- [x] Browser smoke test of the wizard end-to-end
- [x] LocalStorage autosave + draft recovery (auto-persists on every change,
      restores on reload, "Keep editing" / "Discard draft" banner, "Saved"
      indicator next to the progress bar)

- [x] Zod runtime validation on restored LocalStorage drafts.
      `agileChecklistSchema` in `engine/schema.ts` validates the full
      `AgileChecklist` shape (enum-checked role/period/answer, range-checked
      yearsInAgile, unknown answer keys dropped). `safeParseChecklist`
      returns null on any failure, and the store discards malformed
      drafts rather than partially trusting them. Browser smoke-tested
      with valid / tampered / garbage payloads — only the valid one
      restores; the others fall back cleanly to an empty form.

## Pending

(none for this subproject)
