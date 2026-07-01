# CAGE Alcohol Questionnaire — Agent Instructions

Brief four-item alcohol-misuse screen for adults. Collects four lifetime yes/no
questions via a single continuous single-page wizard — **C**ut down, **A**nnoyed,
**G**uilty, **E**ye-opener — scores each 0 or 1, sums a total of 0–4, and flags
**CAGE ≥ 2** as a positive screen that prompts a fuller assessment of drinking.
An eye-opener "yes" is a dependence marker. CAGE is less sensitive to earlier
hazardous consumption than AUDIT-C; a drug-inclusive variant, CAGE-AID, exists
but is out of scope.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Ewing 1984, CAGE-AID, AUDIT-C)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `CageAssessment` TypeScript type — the four criterion inputs
  plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCage(data: CageAssessment): {
    cutDownPoint: 0 | 1;
    annoyedPoint: 0 | 1;
    guiltyPoint: 0 | 1;
    eyeOpenerPoint: 0 | 1;
    cageScore: 0 | 1 | 2 | 3 | 4;
    resultBand: 'negative' | 'low' | 'positive';
    positiveItems: PositiveItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item scores 1 for `'yes'` and 0 otherwise; the
  total 0–4 determines the result band (`≥ 2` → `positive`, `1` → `low`,
  `0` → `negative`). See spec §4. An unanswered item (`''`) contributes 0 points
  and raises a data-completeness flag.
  - cutDown == 'yes' → 1
  - annoyed == 'yes' → 1
  - guilty == 'yes' → 1
  - eyeOpener == 'yes' → 1
- **Engine files:** `types.ts`, `utils.ts`, `cage-rules.ts`, `cage-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `cage-grader.test.ts`, `cage-rules.test.ts` — cover each item's
  yes/no contribution, every total 0–4, and the threshold boundary (score 1 vs 2).

## Flagged issues

Computed independently of the total (see spec §5): positive screen
(`cageScore ≥ 2`, high), eye-opener positive (`eyeOpener == 'yes'`, high — a
dependence marker), sub-threshold positive (`cageScore == 1`, medium), incomplete
assessment (any item unanswered, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Ewing J.A. Detecting Alcoholism: The CAGE Questionnaire. *JAMA* 1984;
  252(14):1905–1907.
- Mayfield D., McLeod G., Hall P. The CAGE questionnaire. *Am J Psychiatry* 1974;
  131(10):1121–1123.
- Brown R.L., Rounds L.A. CAGE-AID. *Wis Med J* 1995; 94(3):135–140.
- Bush K. *et al.* AUDIT-C. *Arch Intern Med* 1998; 158(16):1789–1795.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form cage-alcohol-questionnaire
```
