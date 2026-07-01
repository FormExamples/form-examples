# Body Mass Index and Body Surface Area Calculator — Agent Instructions

Anthropometric calculator that converts a patient's height and weight into
**Body Mass Index (BMI)** with the WHO adult weight-status category and **Body
Surface Area (BSA)** in m². Collects two measured inputs via a single continuous
single-page wizard, applies the BMI and BSA formulae, bands BMI into the WHO
categories, and flags issues (obesity class III, underweight, physiologically
extreme values that warrant re-measurement).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (WHO TRS 894, Mosteller, Du Bois)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `AnthropometryAssessment` TypeScript type — the two measured
  inputs (`heightCm`, `weightKg`) plus context and identification fields
  (including `ancestry` for the Asian-threshold flag).
- **Output shape:**
  ```ts
  calculateAnthropometry(data: AnthropometryAssessment): {
    bmi: number | null;
    bmiCategory:
      | 'underweight' | 'normal' | 'overweight'
      | 'obese-class-1' | 'obese-class-2' | 'obese-class-3' | '';
    bsaMosteller: number | null;
    bsaDuBois: number | null;
    firedThresholds: FiredThreshold[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** pure formula calculator with classification (see spec §4):
  - `BMI = weightKg / (heightCm / 100)²`
  - `BSA (Mosteller) = √((heightCm × weightKg) / 3600)`
  - `BSA (Du Bois) = 0.007184 × heightCm^0.725 × weightKg^0.425`
  - WHO adult bands: `<18.5` underweight, `18.5–24.9` normal, `25–29.9`
    overweight, `30–34.9` obese I, `35–39.9` obese II, `≥40` obese III; Asian
    action points at `≥23` and `≥27.5` recorded as flags only.
  - Both inputs must be non-null and positive; otherwise numeric outputs are
    `null` and an incomplete-data flag is raised.
- **Engine files:** `types.ts`, `utils.ts`, `anthropometry-rules.ts`,
  `anthropometry-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `anthropometry-calculator.test.ts`, `anthropometry-rules.test.ts` —
  cover each BMI band boundary (18.5, 25, 30, 35, 40), the Asian thresholds (23,
  27.5), and known BSA reference points.

## Flagged issues

Computed independently of the category (see spec §5): severe obesity (`bmi ≥ 40`,
high), underweight (`bmi < 18.5`, high), extreme value — verify (implausible
height/weight/BMI, high), Asian high risk (`ancestry == 'asian'` and
`bmi ≥ 27.5`, medium), Asian increased risk (`23 ≤ bmi < 27.5`, low), incomplete
data (height or weight missing, low).

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

- WHO. *Obesity: preventing and managing the global epidemic.* WHO TRS 894 (2000).
- WHO Expert Consultation. Appropriate BMI for Asian populations. *Lancet* 2004;
  363(9403):157–163.
- Mosteller R.D. Simplified calculation of body-surface area. *N Engl J Med*
  1987; 317(17):1098.
- Du Bois D., Du Bois E.F. A formula to estimate the approximate surface area…
  *Arch Intern Med* 1916; 17:863–871.
- NICE CG189. *Obesity: identification, assessment and management.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form body-mass-index-and-body-surface-area-calculator
```
