# Centor Score for Streptococcal Pharyngitis — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Centor Score for Streptococcal
Pharyngitis form: a single continuous single-page wizard plus a clinician
dashboard, sharing one pure scoring engine.

The wizard collects the four objective Centor criteria — tonsillar exudate,
tender anterior cervical lymphadenopathy, fever (> 38 °C or history of fever),
and absence of cough — each scoring 0 or 1 for a Centor total of 0–4, then
applies the McIsaac age modifier (+1 for ages 3–14, 0 for 15–44, −1 for ≥ 45)
for a modified score of −1 to 5. The score bands the probability of group A
streptococcal infection and guides testing and antibiotic decisions. It is a
decision aid, not a diagnosis.

## Routes

- `/` — welcome page (purpose, spec, docs, and links to the form and dashboard).
- `/centor-score-for-streptococcal-pharyngitises` — clinician dashboard
  (SVAR DataGrid; `ssr = false`).
- `/centor-score-for-streptococcal-pharyngitises/[id]` — the wizard
  (`new` for a fresh assessment; a sample id seeds the fields).
- `/centor-score-for-streptococcal-pharyngitises/[id]/report` — graded report.
- `/centor-score-for-streptococcal-pharyngitises/[id]/report/pdf` — PDF endpoint.

## Engine

The pure engine lives in `src/lib/engine/` (`types.ts`, `utils.ts`,
`centor-rules.ts`, `centor-grader.ts`, `flagged-issues.ts`) and is unit-tested
in `centor-grader.test.ts`. `calculateCentorGrade(data)` returns the per-criterion
points, the Centor total (0–4), the age modifier (−1..+1), the modified McIsaac
score (−1..5), the risk band, the fired-criterion audit rows, and the flagged
issues.

## Commands

```sh
pnpm install
pnpm run check     # svelte-check: 0 errors, 0 warnings
pnpm run build     # production build
pnpm exec vitest run   # engine unit tests
```
