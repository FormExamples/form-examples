# Dietetic Assessment — Agent Instructions

Dietitian-driven dietetic assessment. Collects nutritional status, eating
patterns, medical history, and food environment via a 16-step single-page
wizard; computes a **MUST** score (0–6) with its risk category, a **GLIM**
malnutrition diagnosis, plus NRS-2002, SARC-F, and refeeding-syndrome risk;
produces a composite nutrition risk (Low / Moderate / High / Critical) and a
set of safety flags; and emits a signed nutrition care plan.

See [`index.md`](./index.md) for the full design and the 16-step wizard table.

## Slug and spelling

The directory slug is `dietic-assessment`. The conventional clinical spelling
is *dietetic*; prose and report titles read **Dietetic Assessment**, while the
slug, SQL table names (`dietic_assessment`, `dietic_assessment_grade`, …), and
every generated artefact keep the `dietic` stem so derived representations stay
keyed to the directory. Do not "fix" the stem in code — it would break every
generated file and the `bin/` drift detectors.

The form is otherwise written in **Oxford spelling** (`-ize`), per
[`/spec/oxford-spelling.md`](../../spec/oxford-spelling.md): *organization*,
*specialized*, *organized*. British forms are retained as Oxford requires —
anaemia, coeliac, oedema, paediatric, dietitian, diarrhoea, programme — and
standards bodies' own terminology is left as published, so IDDSI's level-3
label stays *Liquidised* and its name stays the *International Dysphagia Diet
Standardisation Initiative*.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (MUST rules, GLIM criteria,
  refeeding risk, nutrition care process, safety-case notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — single-page dietitian wizard (`index.html`) +
  review dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard;
  routes nested under `src/routes/dietic-assessment/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/dietic_assessment/`

## Scoring engine

- **Input shape:** `DieticAssessment` TypeScript type containing the 16 wizard
  sections plus dietitian-identification and patient-identification fields.
- **Output shape:**

  ```ts
  calculateNutritionRisk(data: DieticAssessment): {
    mustBmiScore: 0 | 1 | 2;
    mustWeightLossScore: 0 | 1 | 2;
    mustAcuteDiseaseScore: 0 | 2;
    mustScore: number;                                   // 0..6
    mustRisk: 'low' | 'medium' | 'high';
    glimPhenotypicCriteria: string[];
    glimEtiologicCriteria: string[];
    glimDiagnosis: 'none' | 'moderate' | 'severe';
    nrs2002Score: number | null;                         // 0..7
    sarcfScore: number | null;                           // 0..10
    scoffScore: number | null;                           // 0..5
    refeedingRisk: 'none' | 'high' | 'highest';
    energyRequirementKcal: number | null;
    proteinRequirementG: number | null;
    computedCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    finalCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    overrideReason: string;
    recommendation: Recommendation;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the MUST score. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/must-rules.js`,
  `js/glim-rules.js`, `js/composite-grader.js`, `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `must-rules.ts`,
  `glim-rules.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`
  asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## MUST computation

MUST = BMI score + unplanned-weight-loss score + acute-disease-effect score.

```
bmiScore            = bmi > 20.0 ? 0 : bmi >= 18.5 ? 1 : 2
weightLossScore     = pct < 5 ? 0 : pct <= 10 ? 1 : 2
acuteDiseaseScore   = (acutelyIll && noIntakeLikelyOver5Days) ? 2 : 0
mustScore           = bmiScore + weightLossScore + acuteDiseaseScore
mustRisk            = mustScore === 0 ? 'low' : mustScore === 1 ? 'medium' : 'high'
```

When `measurement_method` is `declined` or height/weight are absent, the engine
falls back to **MUAC**: `< 23.5 cm` → BMI likely `< 20` → `bmiScore` 1;
`< 20.0 cm` → BMI likely `< 18.5` → `bmiScore` 2; `> 32.0 cm` → BMI likely
`> 30` → `bmiScore` 0. The result carries `estimated: true` and the report
states that the score is estimated.

## Dietitian-observed rules

These depend on dietitian observation and have no patient-self-report analogue:

- **Muscle wasting / fat loss** — nutrition-focused physical examination
  findings satisfy the GLIM *reduced muscle mass* phenotypic criterion.
- **Hand-grip strength** — below the sex-adjusted cut-off contributes to the
  `sarcopenia-risk` flag alongside SARC-F.
- **Oedema / ascites adjustment** — weight is adjusted before the BMI score is
  computed; the adjustment and its magnitude are recorded.
- **Refeeding-syndrome risk** — NICE CG32 criteria evaluated against BMI,
  weight-loss percentage, days of negligible intake, and pre-feeding potassium,
  phosphate, and magnesium.
- **Unsafe swallow** — dysphagia reported without a speech-and-language-therapy
  assessment fires `dysphagia-aspiration-risk` at high priority.

## Dietitian override

The engine produces a computed MUST score, MUST risk, and composite risk. The
dietitian may override the **risk category** on step 16 with a mandatory
reason. Both the computed and final values are stored in
`dietic_assessment_grade` and rendered in the report, the PDF, and the FHIR
Bundle.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde;
  snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces, ampersands,
  or parentheses in the filename).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`; `created_at`, `updated_at`,
  `deleted_at` on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts are never hand-edited.

## Front-end HTML stack

- Static HTML + Lily Design System headless classes; no build step.
- Native ES modules (`import` / `export`, `<script type="module">`) per
  [`/spec/es-modules.md`](../../spec/es-modules.md).
- Header controls: locale select, theme select, text-size picker, share picker.
- LocalStorage draft key: `dietic-assessment.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/dietic-assessment/`, RESTful dashboard at
  `/dietic-assessments/` and `/dietic-assessments/[id]/`.
- LocalStorage draft key: `dietic-assessment.front-end-with-svelte.<id>.v1`
  (`<id>` is the route id, `new` for a fresh assessment).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- BAPEN *Nutritional Assessment* and the *'MUST' Explanatory Booklet*.
- GLIM consensus criteria for malnutrition diagnosis (Clinical Nutrition 2019).
- NRS-2002 (Kondrup et al., Clinical Nutrition 2003).
- SARC-F (Malmstrom & Morley, JAMDA 2013).
- NICE CG32 *Nutrition support for adults*, including refeeding-syndrome risk.
- British Dietetic Association *Model and Process for Nutrition and Dietetic
  Practice* (Nutrition Care Process / ADIME).
- IDDSI framework for texture-modified diets and thickened fluids.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

This form is decision support; it does not diagnose and does not replace the
clinical judgement of a registered dietitian.

## Verify

```sh
bin/test-form dietic-assessment
bin/test-sql-apply dietic-assessment
bin/test-examples-conformance dietic-assessment
bin/lily-html-refactor --check dietic-assessment
```
