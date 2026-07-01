# Chronic Kidney Disease Annual Review — Agent Instructions

UK primary-care structured CKD review. Collects the two KDIGO staging
measurements (eGFR and urine ACR), blood pressure, a medication review, and the
core CKD bloods via a single continuous single-page wizard, then derives the
**G-stage (G1–G5)**, **albuminuria stage (A1–A3)**, and **KDIGO risk zone**
(low / moderate / high / very high), grades **review completeness**, and raises
**flags** aligned to NICE NG203 referral and safety criteria. It classifies and
prompts action; it does not diagnose or treat.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG203, KDIGO 2012/2024)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `CkdReview` TypeScript type — context and identification,
  renal function, albuminuria, blood pressure, medication-review, and metabolic
  bloods fields.
- **Output shape:**
  ```ts
  gradeReview(data: CkdReview): {
    gfrCategory: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
    albuminuriaCategory: 'A1' | 'A2' | 'A3' | null;
    kdigoRiskZone: 'low' | 'moderate' | 'high' | 'very-high' | null;
    bloodPressureTarget: { systolic: number; diastolic: number } | null;
    bloodPressureAtTarget: boolean | null;
    reviewStatus: 'complete' | 'partial' | 'incomplete';
    completenessScore: number;
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** classification, not additive scoring. `egfr` maps to a G-stage,
  `acr` maps to an A-stage, and the pair indexes the KDIGO heat-map to a risk
  zone. A separate completeness grader counts documented bundle items. See
  spec §4. A missing staging input yields a `null` category/zone and a
  data-completeness flag.
  - eGFR ≥ 90 → G1; 60–89 → G2; 45–59 → G3a; 30–44 → G3b; 15–29 → G4; < 15 → G5
  - ACR < 3 → A1; 3–30 → A2; > 30 → A3
  - BP target < 130/80 when ACR ≥ 70 or diabetes; else < 140/90
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover each
  G-stage and A-stage boundary (eGFR 89/90, 59/60, 44/45, 29/30, 14/15; ACR 3,
  30, 70), every heat-map cell, the BP-target derivation, the rapid-decline
  rule, and each completeness grade.

## Flagged issues

Computed independently of the risk zone (see spec §5): very-high-risk referral
(`kdigoRiskZone == 'very-high'`, high), eGFR < 30 referral (G4/G5, high), ACR ≥ 70
referral (high), rapid eGFR decline (high), hyperkalaemia (`potassium >= 6.0`
high; `5.5–5.9` medium), anaemia of CKD (`haemoglobin < 110`, medium),
uncontrolled BP (`bloodPressureAtTarget == false`, medium), nephrotoxic drug
without dose adjustment (high), missing ACR (medium), incomplete review (low).

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
- British English throughout.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- NICE NG203. *Chronic kidney disease: assessment and management* (2021).
- KDIGO 2012 & 2024 CKD Clinical Practice Guidelines.
- NICE CKS. *Chronic kidney disease.*
- Kidney Care UK / RCGP CKD-in-primary-care guidance.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form chronic-kidney-disease-review
```
