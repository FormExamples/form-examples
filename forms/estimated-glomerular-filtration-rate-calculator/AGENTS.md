# Estimated Glomerular Filtration Rate (eGFR) Calculator — Agent Instructions

Formula calculator that estimates the glomerular filtration rate from a single
serum creatinine plus age and sex, via a single continuous single-page wizard.
The primary engine is the **CKD-EPI 2021 creatinine equation (race-free)** — the
UK standard. It returns an **eGFR in mL/min/1.73 m²** and classifies it into a
**CKD G-stage** (G1 ≥ 90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 < 15).
CKD-EPI 2021 cystatin C and the older MDRD equation are named for context only.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (CKD-EPI 2021, KDIGO 2012, NICE NG203)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `EgfrAssessment` TypeScript type — the calculation inputs
  (`ageYears`, `sex`, `serumCreatinine` in µmol/L, `specimenDate`,
  `steadyState`) plus context and identification fields.
- **Output shape:**
  ```ts
  calculateEgfr(data: EgfrAssessment): {
    serumCreatinineMgDl: number | null;
    egfr: number | null;               // mL/min/1.73 m²
    egfrStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
    egfrStageLabel: string;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** CKD-EPI 2021 creatinine equation (see spec §4). Convert
  creatinine µmol/L → mg/dL by dividing by 88.42, then:
  ```
  eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^(-1.200) × 0.9938^Age × (1.012 if female)
  ```
  with κ = 0.7 (female) / 0.9 (male) and α = −0.241 (female) / −0.302 (male).
  Band the unrounded eGFR into a G-stage (≥ 90 G1, ≥ 60 G2, ≥ 45 G3a, ≥ 30 G3b,
  ≥ 15 G4, else G5). Missing any required input → `egfr = null`, no stage, plus a
  data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `egfr-rules.ts`,
  `egfr-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `egfr-calculator.test.ts`, `egfr-rules.test.ts` — cover the
  µmol/L → mg/dL conversion, female/male branches, the piecewise min/max either
  side of κ, each G-stage boundary (14/15, 29/30, 44/45, 59/60, 89/90), and the
  missing-input path.

## Flagged issues

Computed independently of the stage (see spec §5): kidney failure / nephrology
referral (`G5`, high), severely decreased / nephrology referral (`G4`, high),
drug-dosing review (`eGFR < 60`, high), possible acute drop (`steadyState ==
'no'`, high), reduced function (`G3a`/`G3b`, medium), confirm CKD near threshold
(`G2`/`G3a` near a boundary, low), incomplete assessment (required input
missing, low).

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

- Inker L.A. *et al.* New Creatinine- and Cystatin C-Based Equations to Estimate
  GFR without Race. *N Engl J Med* 2021; 385(19):1737–1749.
- Levey A.S. *et al.* CKD-EPI equation. *Ann Intern Med* 2009; 150(9):604–612.
- KDIGO 2012 CKD guideline. *Kidney Int Suppl* 2013; 3(1).
- NICE NG203. *Chronic kidney disease: assessment and management.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form estimated-glomerular-filtration-rate-calculator
```
