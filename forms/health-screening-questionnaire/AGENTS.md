# Health Screening Questionnaire — Agent Instructions

Generic, purpose-flexible health and lifestyle screen used by employers, gyms,
and primary-care / preventive-health services. Collects assessment context,
personal details, lifestyle, medical/family history, a symptom review, the
PAR-Q+ 7-item physical-activity-readiness screen, optional vital signs,
conditional occupational factors, a light-touch wellbeing check, vaccination
status, and consent via a 14-step single-page wizard; computes a PAR-Q+
clearance status, an AUDIT-C alcohol score/band, a composite risk band (Low /
Moderate / High / Refer urgently), a referral recommendation, and a set of
safety flags.

See [`index.md`](./index.md) for the full design and the 14-step wizard table.

## `assessor`, not `clinician`

This form's whole premise is that the person conducting the screen is often
**not** a clinician — a gym instructor, a personal trainer, an HR officer, or
an occupational-health nurse, alongside GPs and practice nurses in the
routine-public-health setting. The SQL table, TypeScript section, and Rust
entity are therefore named `assessor`, not `clinician` or `dietitian`, with a
`role` enumeration wide enough to cover both clinical and non-clinical
operators. See [`spec/index.md`](spec/index.md) §6.1 for the full rationale.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (PAR-Q+ and AUDIT-C rules,
  safety-case notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — single-page wizard (`index.html`) + review
  dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard;
  routes nested under `src/routes/health-screening-questionnaire/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/health_screening_questionnaire/`

## Scoring engine

- **Input shape:** `HealthScreeningQuestionnaire` TypeScript type containing
  the 14 wizard sections plus assessor-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateHealthScreening(data: HealthScreeningQuestionnaire): {
    parqPlusClearance: 'cleared' | 'further-assessment-required';
    auditCScore: number | null;                          // 0..12
    auditCBand: 'low' | 'increasing-risk' | 'higher-risk' | '';
    computedRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently';
    finalRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently' | '';
    computedRecommendation: Recommendation;
    finalRecommendation: Recommendation;
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the risk band. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/parq-rules.js`,
  `js/audit-c-rules.js`, `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `parq-rules.ts`,
  `audit-c-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
  `grader.test.ts` asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## PAR-Q+ and AUDIT-C computation

```
parqPlusClearance = all 7 PAR-Q+ items === 'no' ? 'cleared' : 'further-assessment-required'

auditCScore = frequency + typicalQuantity + bingeFrequency   // null if all unanswered
auditCBand  = auditCScore === null ? ''
            : auditCScore >= 8 ? 'higher-risk'
            : (sex === 'male' && auditCScore >= 5) || (sex === 'female' && auditCScore >= 4) ? 'increasing-risk'
            : 'low'
```

Composite risk band is computed by max-grade across PAR-Q+, AUDIT-C, the
symptom review, and family/chronic-condition history — see
[`spec/index.md`](spec/index.md) §3.3.

## Deliberate PAR-Q+ scope simplification

The real PAR-Q+ instrument branches into condition-specific supplementary
questionnaires when any general-health item is "yes". This form implements
only the 7-item general health screen and raises a single
`further-assessment-required` follow-up state instead of reproducing the
branching supplementary questionnaires. Do not add per-condition PAR-Q+
follow-up pages without updating `spec/index.md` §2 first — this is a
recorded, deliberate scope boundary, not an oversight.

## Assessor override

The engine produces a computed risk band and recommendation. The assessor may
override the **risk band** on step 14 with a mandatory reason. Both the
computed and final values are stored in
`health_screening_questionnaire_grade` and rendered in the report, the PDF,
and the FHIR Bundle.

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
- Header controls: locale select, theme select, text-size picker, share
  picker.
- LocalStorage draft key:
  `health-screening-questionnaire.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/health-screening-questionnaire/`, RESTful
  dashboard at `/health-screening-questionnaires/` and
  `/health-screening-questionnaires/[id]/`.
- Step 10 (occupational/role-specific factors) renders conditionally on step
  1's `screeningPurpose === 'occupational-pre-placement'`, following the
  pattern used by `perioperative-optimization`'s CPET fields.
- LocalStorage draft key:
  `health-screening-questionnaire.front-end-with-svelte.<id>.v1` (`<id>` is
  the route id, `new` for a fresh questionnaire).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- PAR-Q+ Collaboration. Warburton DER, Jamnik VK, Bredin SSD, Gledhill N.
  *The Physical Activity Readiness Questionnaire for Everyone (PAR-Q+) and
  Electronic Physical Activity Readiness Medical Examination (ePARmed-X+).*
  Health & Fitness Journal of Canada 2011;4(2):3–17.
- Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. *The AUDIT alcohol
  consumption questions (AUDIT-C).* Archives of Internal Medicine
  1998;158(16):1789–95.
- NHS Health Check programme.
- UHS NHS Foundation Trust perioperative screening questionnaire.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

This form is decision support; it does not diagnose and does not replace the
clinical judgement of a qualified professional.

## Verify

```sh
bin/test-form health-screening-questionnaire
bin/test-sql-apply health-screening-questionnaire
bin/test-examples-conformance health-screening-questionnaire
bin/lily-html-refactor --check health-screening-questionnaire
```
