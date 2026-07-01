# Waterlow Pressure Ulcer Risk Assessment — Agent Instructions

Bedside pressure-ulcer risk screen for adults. Collects weighted risk categories
(build / weight for height, skin type, sex and age, continence, mobility) plus
four special-risk groups (tissue malnutrition, neurological deficit, major
surgery or trauma, medication) via a single continuous single-page wizard,
**sums** the points into a Waterlow total, and places the patient in a risk band.
A **higher total means higher risk** (contrast the Braden Scale, which is
inverse). Bands: `< 10` low, `10–14` at risk, `15–19` high, `≥ 20` very high —
each higher band escalates the pressure-relieving mattress, repositioning, and
skin-care plan.

See [`index.md`](./index.md) for the full design and the assessment-step and
scoring tables, and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Waterlow, NICE, EPUAP/NPIAP)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `WaterlowAssessment` TypeScript type — the core category and
  special-risk enum inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeWaterlow(data: WaterlowAssessment): {
    buildPoints: number;
    skinPoints: number;
    sexPoints: number;
    agePoints: number;
    continencePoints: number;
    mobilityPoints: number;
    tissueMalnutritionPoints: number;
    neurologicalDeficitPoints: number;
    majorSurgeryTraumaPoints: number;
    medicationPoints: number;
    waterlowScore: number;
    riskBand: 'low' | 'at-risk' | 'high' | 'very-high';
    contributingCategories: ContributingCategory[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted sum — each core category maps its selected
  enum to points; sex-and-age adds `sexPoints + agePoints`; each special-risk
  group maps its highest applicable enum to points. All contributions are summed
  into `waterlowScore`, which selects the band via `≥ 20 → very-high`,
  `≥ 15 → high`, `≥ 10 → at-risk`, else `low`. See spec §4. A missing enum
  contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `waterlow-rules.ts`,
  `waterlow-grader.ts`, `flagged-issues.ts`.
- **Tests:** `waterlow-grader.test.ts`, `waterlow-rules.test.ts` — cover each
  band boundary (9/10, 14/15, 19/20) and every category's point mapping.

## Flagged issues

Computed independently of the total (see spec §5): very high risk
(`waterlowScore >= 20`, high), high risk (`15–19`, high), at risk (`10–14`,
medium), existing pressure damage (`existingPressureDamage == 'yes'` or skin
`discoloured` / `broken`, high), multiple special risk factors (two or more
special-risk groups contribute points, medium), incomplete assessment (any core
category input missing, low).

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
- British English throughout (oedematous, faeces, anaemia, paediatric).
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Waterlow J. *Pressure sores: a risk assessment card.* Nursing Times 1985;
  81(48):49–55; revised card 2005.
- NICE CG179 and quality standard QS89. *Pressure ulcers: prevention and
  management.*
- EPUAP / NPIAP / PPPIA. *Prevention and Treatment of Pressure Ulcers/Injuries:
  Clinical Practice Guideline* (2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form waterlow-pressure-ulcer-risk-assessment
```
