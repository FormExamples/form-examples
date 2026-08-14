# Chronic Obstructive Pulmonary Disease Review (COPD Annual Review) — Agent Instructions

A UK primary-care annual review for adults with confirmed COPD. Collects
spirometry, symptom burden, exacerbation history, smoking, inhaler technique and
adherence, vaccinations, pulmonary rehabilitation, oxygen, comorbidities, and the
self-management plan via a single continuous single-page wizard, then derives a
**GOLD airflow-limitation grade (1–4)**, a combined **ABE assessment group**, a
**review-completeness grade** (complete / partial / incomplete), and clinical
flags (frequent exacerbations, current smoker, poor inhaler technique, missing
vaccinations, pulmonary-rehab candidate). Aligned with NICE NG115 and GOLD 2023+.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG115, GOLD, MRC/mMRC, CAT)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Grading engine

- **Input shape:** `CopdReview` TypeScript type — the review-context and
  identification fields plus spirometry, symptom, exacerbation, smoking, inhaler,
  vaccination, pulmonary-rehab, and self-management sub-fields.
- **Output shape:**
  ```ts
  gradeCopdReview(data: CopdReview): {
    goldGrade: 1 | 2 | 3 | 4 | null;
    symptomBurden: 'low' | 'high';
    exacerbationRisk: 'low' | 'high';
    abeGroup: 'A' | 'B' | 'E' | null;
    reviewStatus: 'complete' | 'partial' | 'incomplete';
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** four independent derivations (see spec §4):
  - **GOLD grade** — banded from `fev1PercentPredicted` (≥ 80 → 1, ≥ 50 → 2,
    ≥ 30 → 3, else 4; `null` when unrecorded).
  - **Symptom axis** — `high` when `mMRC ≥ 2` or `CAT ≥ 10`, else `low`.
  - **Exacerbation axis** — `high` when `≥ 2` moderate or `≥ 1` hospitalized
    exacerbation in 12 months, else `low`.
  - **ABE group** — `E` when exacerbation risk high; else `B` when symptom burden
    high; else `A`; `null` when no symptom/exacerbation data.
  - **Review status** — `incomplete` when a core clinical element is missing,
    `partial` when supporting items missing, else `complete`.
  A missing numeric input is treated as absent (not a normal value) and lowers the
  completeness grade.
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover each GOLD
  boundary (FEV₁ % 80/79, 50/49, 30/29), each symptom threshold (mMRC 1/2,
  CAT 9/10), each exacerbation threshold (1/2 moderate, 0/1 hospitalized), every
  ABE group, and every completeness grade.

## Flagged issues

Computed independently of the grades (see spec §5): high exacerbation risk
(`abeGroup == 'E'`, high), current smoker (`smokingStatus == 'current'`, high),
poor / unchecked inhaler technique (`inhalerTechniqueAdequate == 'no'` or
`inhalerTechniqueChecked == 'no'`, high), missing vaccinations (any of flu /
pneumococcal / COVID not up-to-date, medium), pulmonary-rehab candidate
(`mrcGrade >= 3` and not completed / referred, medium), incomplete review (any
core element missing, low).

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

- NICE NG115. *Chronic obstructive pulmonary disease in over 16s: diagnosis and
  management.*
- Global Initiative for Chronic Obstructive Lung Disease (GOLD). *Global Strategy
  for the Diagnosis, Management, and Prevention of COPD* (2023+).
- Jones P.W. *et al.* COPD Assessment Test (CAT). *Eur Respir J* 2009.
- Bestall J.C. *et al.* mMRC dyspnoea scale. *Thorax* 1999.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form chronic-obstructive-pulmonary-disease-review
```
