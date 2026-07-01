# Sequential Organ Failure Assessment (SOFA) — Agent Instructions

Clinician-driven Sequential Organ Failure Assessment (SOFA) score. Collects
**objective physiology and laboratory findings** for six organ systems via a
single continuous single-page wizard, computes a per-system sub-score (0–4), a
total SOFA score (0–24), the change from a baseline (delta-SOFA), a
mortality-risk band, a Sepsis-3 flag, and a set of safety flags, and emits a
signed clinician report.

See [`index.md`](./index.md) for the full design, the per-system 0–4 thresholds,
and the wizard table. See [`spec/index.md`](./spec/index.md) for the living spec.

## Directory map

- `./index.md` — project overview and scoring thresholds
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation
- `./sql/` — Liquibase-formatted Postgres schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 `.yaml` specifications
- `./front-end-with-html/` — HTML + Lily wizard (`index.html`) + dashboard
- `./front-end-with-svelte/` — SvelteKit + Lily (`/<plural>/` list + `/<plural>/[id]` form)
- `./back-end-with-loco/` — Rust axum + Loco JSON API
- `./back-end-with-loco-setup` — generated scaffold script

## Scoring engine

- **Input shape:** `SofaAssessment` TypeScript type containing six organ-system
  sub-groups (respiration, coagulation, liver, cardiovascular, cns, renal) plus
  context and baseline fields.
- **Output shape:**
  ```ts
  gradeSofa(data: SofaAssessment): {
    subScores: {
      respiration: 0|1|2|3|4|null;
      coagulation: 0|1|2|3|4|null;
      liver: 0|1|2|3|4|null;
      cardiovascular: 0|1|2|3|4|null;
      cns: 0|1|2|3|4|null;
      renal: 0|1|2|3|4|null;
    };
    totalSofa: number;            // 0..24
    deltaSofa: number | null;     // totalSofa - baselineSofaTotal
    mortalityBand: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
    sepsis3: boolean;
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  };
  ```
- **Algorithm:** map each system's input(s) to a 0–4 sub-score using the
  published thresholds; cardiovascular and renal take the maximum of their two
  criteria; respiration sub-scores 3–4 require respiratory support; sum to a
  total 0–24; derive delta-SOFA from the baseline; band the total for mortality;
  set the Sepsis-3 flag when infection is suspected and delta-SOFA ≥ 2. A missing
  input yields a `null` sub-score and an incomplete-assessment flag — never guess.
- **Engine files:**
  - `types.ts` — `SofaAssessment`, `SofaResult`, `FiredRule`, `FlaggedIssue`.
  - `sofa-rules.ts` — the six per-system threshold tables and their mappers.
  - `sofa-grader.ts` — orchestration: sub-scores → total → delta → band → sepsis.
  - `flagged-issues.ts` — severe single-organ, multi-organ, rising-SOFA, high-risk.
  - `utils.ts` — unit conversion (kPa↔mmHg, µmol/L↔mg/dL), safe numeric parsing.
- **Tests:** `sofa-grader.test.ts` (boundary cases per system + totals + delta).

## Flagged issues

Computed independently of the total score. Priority: high / medium / low.

- **Severe single-organ failure** — any sub-score = 4 (high).
- **Multi-organ failure** — two or more systems sub-scored ≥ 3 (high).
- **Rising SOFA** — delta-SOFA ≥ 2 (high); drives Sepsis-3 when infection suspected.
- **Marked deterioration** — delta-SOFA ≥ 4 (high).
- **High mortality risk** — total ≥ 12 (high).
- **Improving trajectory** — delta-SOFA ≤ −2 (low; informational).
- **Incomplete assessment** — any sub-score `null` (medium).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`; `created_at`, `updated_at`,
  `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Vincent J.-L. *et al.* The SOFA score. *Intensive Care Medicine* 1996;
  22:707–10.
- Vincent J.-L. *et al.* SOFA in ICU. *Critical Care Medicine* 1998; 26:1793–800.
- Ferreira F.L. *et al.* Serial SOFA. *JAMA* 2001; 286:1754–8.
- Singer M. *et al.* Sepsis-3. *JAMA* 2016; 315:801–10.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form sequential-organ-failure-assessment
```
