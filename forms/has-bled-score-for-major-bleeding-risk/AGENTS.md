# HAS-BLED Score for Major Bleeding Risk — Agent Instructions

Bleeding-risk score for adults with atrial fibrillation on, or being considered
for, oral anticoagulation. Collects nine clinical criteria via a single
continuous single-page wizard — Hypertension (uncontrolled, SBP > 160),
Abnormal renal function, Abnormal liver function, Stroke, Bleeding history,
Labile INR, Elderly (> 65), Drugs (antiplatelets/NSAIDs), Alcohol (≥ 8
units/week) — scores each present criterion, sums a total of 0–9, and flags
**HAS-BLED ≥ 3** as higher major-bleeding risk. A high score is **not** a
contraindication to anticoagulation: it prompts caution, closer review, and
correction of modifiable factors, and is read alongside CHA₂DS₂-VASc.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Pisters 2010, ESC / NICE AF)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `HasBledAssessment` TypeScript type — the nine criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeHasBled(data: HasBledAssessment): {
    hypertensionPoint: 0 | 1;
    renalPoint: 0 | 1;
    liverPoint: 0 | 1;
    strokePoint: 0 | 1;
    bleedingPoint: 0 | 1;
    labileInrPoint: 0 | 1;
    elderlyPoint: 0 | 1;
    drugsPoint: 0 | 1;
    alcoholPoint: 0 | 1;
    hasBledScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–9
  determines the risk band (`0` → `low`, `1–2` → `moderate`, `≥ 3` → `high`). See
  spec §4. Elderly and alcohol points derive from numeric inputs; a missing
  numeric input contributes 0 and raises a data-completeness flag.
  - hypertension uncontrolled (SBP > 160) → 1
  - abnormal renal function → 1
  - abnormal liver function → 1
  - stroke history → 1
  - bleeding history / predisposition → 1
  - labile INR (TTR < 60%) → 1
  - age > 65 → 1
  - antiplatelets / NSAIDs → 1
  - alcohol ≥ 8 units/week → 1
- **Engine files:** `types.ts`, `utils.ts`, `hasbled-rules.ts`,
  `hasbled-grader.ts`, `flagged-issues.ts`.
- **Tests:** `hasbled-grader.test.ts`, `hasbled-rules.test.ts` — cover the age
  boundary (65/66), the alcohol boundary (7/8 units), the risk-band boundaries
  (0, 2/3), and the minimum and maximum totals (0 and 9).

## Flagged issues

Computed independently of the total (see spec §5): high bleeding risk
(`hasBledScore ≥ 3`, high), and four **modifiable-factor** flags (medium) —
uncontrolled hypertension, labile INR, antiplatelets/NSAIDs, and excess alcohol —
plus incomplete assessment (any criterion input missing, low). The modifiable
flags are the point of the score: they surface correctable risks rather than
gate anticoagulation.

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

- Pisters R. *et al.* HAS-BLED. *Chest* 2010; 138(5):1093–1100.
- Lip G.Y.H. *et al.* Bleeding risk assessment in AF. *Thromb Haemost* 2011;
  106(6):997–1011.
- Hindricks G. *et al.* 2020 ESC Guidelines for AF. *Eur Heart J* 2021;
  42(5):373–498.
- NICE NG196. *Atrial fibrillation: diagnosis and management.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form has-bled-score-for-major-bleeding-risk
```
