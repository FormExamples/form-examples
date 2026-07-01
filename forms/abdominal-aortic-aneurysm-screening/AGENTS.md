# Abdominal Aortic Aneurysm (AAA) Screening — Agent Instructions

Documentation and result-classification form for the UK NHS AAA Screening
Programme. Records an abdominal ultrasound of the aorta via a single continuous
single-page wizard — eligibility, consent, and the maximum antero-posterior
aortic diameter in centimetres — then classifies the aorta by diameter into
normal (`< 3.0 cm`), small (`3.0–4.4 cm`), medium (`4.5–5.4 cm`), or large
(`≥ 5.5 cm`), sets the surveillance/referral action, and raises clinical flags.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS AAA SP, NICE NG156)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `AaaScreening` TypeScript type — context, identification and
  eligibility, consent, ultrasound measurement, and clinical observation fields.
- **Output shape:**
  ```ts
  classifyAaa(data: AaaScreening): {
    category: 'normal' | 'small' | 'medium' | 'large' | 'non-visualised';
    surveillanceBand: 'discharge' | 'annual' | 'three-monthly' | 'refer-vascular' | 'rescan';
    recommendedAction: string;
    growthCm: number | null;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** deterministic diameter-threshold classification driven by
  `maxAorticDiameterCm`. See spec §4. Thresholds **3.0 / 4.5 / 5.5 cm**, each
  band lower-bound inclusive and upper-bound exclusive:
  - `aortaVisualised == 'no'` or diameter `null` → `non-visualised` → re-scan
  - `< 3.0` → `normal` → discharge
  - `3.0 – 4.4` (`[3.0, 4.5)`) → `small` → annual surveillance
  - `4.5 – 5.4` (`[4.5, 5.5)`) → `medium` → three-monthly surveillance
  - `>= 5.5` → `large` → refer to vascular surgery
  - `growthCm = maxAorticDiameterCm - priorMaxDiameterCm` when both present.
- **Engine files:** `types.ts`, `utils.ts`, `aaa-rules.ts`, `aaa-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `aaa-grader.test.ts`, `aaa-rules.test.ts` — cover each threshold
  boundary (2.9/3.0, 4.4/4.5, 5.4/5.5 cm), the non-visualised guard, every
  category, and the growth calculation.

## Flagged issues

Computed independently of the category (see spec §5): vascular referral
(`category == 'large'`, high), symptomatic aneurysm (`symptomatic == 'yes'` with
an aneurysm present, high), rapid growth (`growthCm >= 1.0` over ~12 months,
high), non-visualised aorta (`aortaVisualised == 'no'` or diameter `null`,
medium), incomplete assessment (required fields missing, low).

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
- British English throughout.

## Clinical grounding

- NHS AAA Screening Programme — programme standards, diameter thresholds
  (3.0 / 4.5 / 5.5 cm) and recall intervals (annual, three-monthly).
- Public Health England / NHS England. *Abdominal aortic aneurysm screening:
  programme overview.*
- NICE NG156. *Abdominal aortic aneurysm: diagnosis and management* (2020).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form abdominal-aortic-aneurysm-screening
```
