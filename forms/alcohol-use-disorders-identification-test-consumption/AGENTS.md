# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) — Agent Instructions

Brief three-item alcohol screen for adults. Collects the three AUDIT consumption
items via a single continuous single-page wizard — frequency of drinking (Q1),
typical quantity in UK units (Q2), and frequency of heavy episodic drinking (Q3)
— scores each 0–4, sums a total of 0–12, and flags **AUDIT-C ≥ 5** as a positive
screen that prompts the full 10-item AUDIT and a brief intervention.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (AUDIT / AUDIT-C, NICE PH24)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `AuditcAssessment` TypeScript type — the three item inputs
  (each an integer 0–4) plus context and identification fields.
- **Output shape:**
  ```ts
  gradeAuditc(data: AuditcAssessment): {
    frequencyOfDrinkingPoint: 0 | 1 | 2 | 3 | 4;
    typicalQuantityPoint: 0 | 1 | 2 | 3 | 4;
    heavyEpisodeFrequencyPoint: 0 | 1 | 2 | 3 | 4;
    auditcScore: number;            // 0..12
    riskBand: 'lower' | 'increasing' | 'higher' | 'possible-dependence';
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item contributes its own 0–4 point value; the
  total 0–12 determines the risk band (`≥ 5` → positive screen). See spec §4. A
  missing item input contributes 0 points and raises a data-completeness flag.
  - `auditcScore >= 11` → `possible-dependence`
  - `auditcScore >= 8`  → `higher`
  - `auditcScore >= 5`  → `increasing`
  - otherwise           → `lower`
- **Engine files:** `types.ts`, `utils.ts`, `auditc-rules.ts`,
  `auditc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `auditc-grader.test.ts`, `auditc-rules.test.ts` — cover the
  positive-screen boundary (total 4/5), each band boundary (5, 8, 11), and the
  minimum and maximum totals (0 and 12).

## Flagged issues

Computed independently of the total (see spec §5): positive screen
(`auditcScore >= 5`, high), possible dependence (`auditcScore >= 11`, high),
heavy episodic drinking (`heavyEpisodeFrequency >= 3`, medium), sex-specific
low-cut positive (`sex == 'female'` and `auditcScore == 4`, low), incomplete
assessment (any item input missing, low).

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

- Saunders J.B. *et al.* Development of the AUDIT. *Addiction* 1993;
  88(6):791–804.
- Bush K. *et al.* The AUDIT Alcohol Consumption Questions (AUDIT-C). *Arch
  Intern Med* 1998; 158(16):1789–1795.
- NICE PH24. *Alcohol-use disorders: prevention.*
- Public Health England. *Alcohol use screening tests* (AUDIT / AUDIT-C).
- UK Chief Medical Officers' *Low Risk Drinking Guidelines* (2016).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form alcohol-use-disorders-identification-test-consumption
```
