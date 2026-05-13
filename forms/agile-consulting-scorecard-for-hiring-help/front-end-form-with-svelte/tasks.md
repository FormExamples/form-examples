# Tasks

- [x] Author `src/lib/engine/types.ts` for `AgileConsultingScorecardAssessment`
- [x] Author `src/lib/engine/` scoring engine: manifesto-rules,
      principles-rules, flagged-issues, utils, score-grader
- [x] Author `src/lib/engine/score-grader.test.ts` covering empty input,
      band boundaries (0/4/5/6/10/11/16), fired-rules count, every
      readiness flag, and null-vs-false semantics (21 tests passing
      under Vitest)
- [x] Add minimal `package.json`, `tsconfig.json`, `vitest.config.ts`,
      and `pnpm-workspace.yaml` so the engine can be run under
      `pnpm test` without the full SvelteKit project skeleton
- [x] Add `zod` runtime input validation in `schema.ts` with
      `parseAssessment(input)` and `safeParseAssessment(input)`,
      covered by 4 Vitest cases (1 happy path on the golden sample,
      3 rejection cases for unknown enum / missing field /
      wrong-type `done`)
- [x] Add `recommendations.ts` — one seed-defined intervention per
      `false` item with heading + intervention + rationale. Surfaced
      on the `/report` page and inside the PDF builder. Covered by 6
      Vitest cases (empty → none, all-true → none, mixed → ordered,
      all-false → 16, golden sample → 7 specific keys, unanswered
      items skipped)
- [x] Add `pre-tender.ts` — `toPreTenderSummary(data, grade)` builds a
      redacted JSON suitable to share with prospective consultants
      (keeps org name / sector / size / date + score / band /
      recommendation + flag categories+priorities; drops respondent
      PII, legal name, headcount, region, website, item answers, and
      evidence text). "Download pre-tender JSON" button on the
      `/report` page. Covered by 9 Vitest cases (4 shape + 5 redaction
      guards proving no respondent name / email / evidence /
      legal-name / per-item answers leak)
- [x] Add `diff.ts` — `diffAssessments(before, after)` returns a
      `ScorecardDiff` for the "retake in ~3 months" loop: per-item
      change (`improved` / `regressed` / `answered` / `cleared` /
      `unchanged`), score and subtotal deltas, band-before/after,
      `bandChanged`, plus `newFlags` and `clearedFlags` lists.
      Covered by 7 Vitest cases (blank vs blank, improvement loop +
      band lift, regression loop, flag-fires-on-regression,
      flag-clears-on-improvement, four-transition classifier)
- [x] Add `bulk-import.ts` — `parseJsonl(text)` accepts a JSON-Lines
      document (one assessment per line, blank + `#`-prefixed lines
      ignored), validates each line via `safeParseAssessment`, scores
      the accepted ones, and returns `{ accepted, rejected }` with
      stable line numbers. Covered by 9 Vitest cases (empty / whitespace,
      single + multi-line happy path, blank + comment skipping, JSON
      parse error, schema violation, mixed input with stable line
      numbers)
- [x] Add `/diff` SvelteKit route — file input or paste prior assessment
      JSON, validates via `safeParseAssessment`, and renders the diff:
      score / subtotal deltas with sign-aware colour, band before→after
      with `bandChanged` callout, improved / regressed item lists,
      new-flag / cleared-flag lists, and a "no changes" sentinel. Linked
      from the wizard root
- [x] "Submit to backend" section on `/report` — configurable backend
      URL (default `http://localhost:5150`), POSTs the current
      assessment to `/api/scorecards`, shows the new id + lookup URL
      on success or the error message on failure. Closes the
      wizard → Rust → dashboard loop end-to-end (verified live:
      submitting the golden sample creates `s-1000`, dashboard grows
      12 → 13, `GET /api/scorecards/s-1000` returns the row)
- [x] Initialise the SvelteKit project on top of the engine (Vite,
      Svelte 5 runes, Tailwind 4)
- [x] Author `src/lib/stores/assessment.svelte.ts` (class-based runes store)
- [x] Author the six step components
      (`Step1Organization.svelte`..`Step6ScoreAndSignoff.svelte`)
- [x] Author `src/routes/+page.svelte` mounting the wizard
- [x] Author `src/routes/report/+page.svelte` for the rendered report
      with a "Download PDF" button that POSTs to `/report/pdf`
- [x] Author `src/routes/report/pdf/+server.ts` POST endpoint that
      validates input via `parseAssessment`, runs `gradeScorecard`,
      builds the document via `buildPdfDocument`, and streams the PDF
- [x] Author `src/lib/report/pdf-builder.ts` returning a
      `TDocumentDefinitions` with score header, organization /
      respondent block, 16-row item table, and readiness-flag list
- [x] Vitest unit tests for `pdf-builder.ts` (7 cases): A4 +
      margins, header + footer present, structural counts (1 header
      row + 16 item rows in the items table), score values mirror
      the engine's `GradeResult`, every fired flag's category and
      suggested-action text appears in the rendered doc, and a
      no-flags sentinel renders for an all-true assessment
