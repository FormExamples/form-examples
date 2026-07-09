# Eye Prescription — Agent Instructions

Optometrist-issued **spectacle prescription** captured via an 11-step single-
page wizard. Collects refraction per eye (sphere, cylinder, axis, addition,
prism, base), pupillary distance, visual acuity, optional ocular-health
findings, and lens recommendations. Computes a per-eye refractive
classification, an overall prescription-complexity grade, and a set of safety
flags.

See [`index.md`](./index.md) for the full design and the 11-step wizard table.
See [`seed.md`](./seed.md) for the source brief.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — source seed material
- `./doc/` — clinical reference documentation (GOC standards, classification
  rules, lens recommendation matrix, safety case notes, FHIR mapping)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers .proto schemas
- `./typespec/` — TypeSpec API definitions
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard (SVAR DataGrid)
- `./back-end-with-loco/` — Rust axum + Loco JSON API back-end
- `./back-end-with-loco-setup` — scaffold generator script

## Scoring engine

- **Input shape:** `EyePrescription` TypeScript type with `prescriber`,
  `patient`, `examination`, two `EyeRefraction` (right and left), one
  `VisualAcuity`, one `PupillaryDistance`, one `LensRecommendation`, optional
  `OcularHealthFinding`.
- **Output shape:**
  ```ts
  classifyPrescription(data: EyePrescription): {
    rightEyeClassification: RefractiveClass[]; // may include both sphere class and astigmatism class
    leftEyeClassification: RefractiveClass[];
    presbyopiaPresent: boolean;
    anisometropiaDiopters: number;            // |sphereOD - sphereOS|
    complexity: 'simple' | 'moderate' | 'complex';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-eye classification is a band lookup on sphere and a band
  lookup on cylinder; complexity uses the worst-of rule across both eyes.
- **Engine files:** `types.ts`, `utils.ts`, `refractive-rules.ts`,
  `complexity-grader.ts`, `flagged-issues.ts`.
- **Tests:** `complexity-grader.test.ts`, `refractive-rules.test.ts`,
  `flagged-issues.test.ts`.

## Prescriber-only rules

These depend on the prescriber's clinical judgement and cannot be self-
reported by the patient:

- **Prism present** — non-zero `prism` value in either eye → binocular-
  alignment flag (medium priority).
- **Ocular pathology** — any positive slit-lamp / fundus / OCT finding →
  refer-ophthalmology flag (high priority).
- **Significant change from prior** — sphere change > 1.00 D vs. last
  recorded prescription → adaptation-period flag (low priority).

## Clinician override

The classification engine produces a computed complexity. The prescriber
may override on step 11 with a documented reason. Both the **computed** and
**final** complexity are stored and rendered in the PDF and FHIR Bundle.

## Sign / convention discipline

- **Myopia is negative sphere** (`SPH < 0`). **Hyperopia is positive sphere**
  (`SPH > 0`). Reject any input where the optometrist has mixed conventions.
- **Cylinder sign** — the form stores cylinder in **minus-cylinder convention**
  (the convention used by UK optometrists and the FHIR `VisionPrescription`
  resource). Display in plus-cylinder is a UI conversion, not a storage
  change.
- **Axis** — integer 1–180 degrees; 0 is invalid, 90 is vertical.
- **Addition** — always positive (presbyopia correction adds plus power for
  near). A negative addition is a validation error.
- **Prism base direction** — encoded as `in` / `out` / `up` / `down`. The
  alternative numeric encoding (Cartesian) is computed at render time.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields (including all refraction numbers when
  the eye has not yet been examined).
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.
- Sphere, cylinder, addition, prism stored as `NUMERIC(5,2)` to preserve the
  0.25-diopter step exactly (no floating-point drift).
- Axis stored as `INTEGER` (1–180).

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF preview, server-side PDF for download
- Vitest for engine unit tests
- Dynamic step route `/prescription/[step=step]/+page.svelte` with the
  `step` param matcher validating 1–11

## Front-end dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme
- Sortable columns: issue date, patient name, complexity, flags, expiry
- Dropdown filters: complexity grade, lens type, expired-only

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Clinical grounding

- General Optical Council Standards of Practice (2016).
- Opticians Act 1989 + The Sight Testing (Examination and Prescription)
  (No 2) Regulations 1989.
- College of Optometrists Clinical Management Guidelines.
- HL7 FHIR R5 `VisionPrescription` resource specification.
- WHO ICD-11 chapter 09 (H52 refractive errors).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.
- UK GDPR / Data Protection Act 2018 — NHS number is a special category
  identifier.

## Verify

```sh
bin/test-form eye-prescription
```
