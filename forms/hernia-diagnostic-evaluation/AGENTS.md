# Hernia Diagnostic Evaluation — Agent Instructions

A hernia diagnostic evaluation: the clinical assessment used to detect,
classify, and grade the urgency of an abdominal-wall or groin hernia,
performed by a GP, surgical registrar, or general surgeon. Collects
presenting complaint, risk factors, examination findings, and imaging via a
14-step single-page wizard; computes a hernia **classification** (type, EHS
subtype, laterality, EHS size grade, reducibility) and an **urgency band**
(`routine` / `soon` / `urgent` / `emergency`) driven by a red-flag screen;
produces a set of safety flags; and emits a signed referral summary.

See [`index.md`](./index.md) for the full design and the 14-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (EHS classification rules,
  red-flag urgency criteria, safety-case notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — single-page clinician wizard (`index.html`) +
  review dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard;
  routes nested under `src/routes/hernia-diagnostic-evaluation/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/hernia_diagnostic_evaluation/`

## Scoring engine

- **Input shape:** `HerniaDiagnosticEvaluation` TypeScript type containing the
  14 wizard sections plus clinician-identification and patient-identification
  fields.
- **Output shape:**

  ```ts
  calculateHerniaEvaluation(data: HerniaDiagnosticEvaluation): {
    herniaType: HerniaType;
    herniaSubtype: InguinalSubtype | 'not-applicable' | '';
    ehsClassification: string;
    ehsSizeGrade: '1' | '2' | '3' | '';
    reducibilityStatus: ReducibilityStatus;
    computedUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    finalUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    overrideReason: string;
    recommendation: ManagementPlan;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** red-flag-first, not max-grade over a numeric total — any
  positive red flag in step 8 forces `computedUrgency` to `emergency` and is
  never diluted by the rest of the examination. `routine` is the default when
  nothing else fires.
- **Engine files (HTML):** `js/types.js`, `js/classification-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`,
  `classification-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
  `grader.test.ts` asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Urgency computation

```
computedUrgency =
  anyRedFlag                                             ? 'emergency'
  : reducibilityStatus === 'incarcerated'                ? 'urgent'
  : reducibilityStatus === 'irreducible'                 ? 'urgent'
  : (painScore0To10 > 4) || (ehsSizeGrade === '3')        ? 'soon'
  : 'routine'
```

Any positive answer among the seven step-8 red flags (severe pain, vomiting,
fever, absolute constipation, erythema/discolouration, previously-reducible
now-irreducible, tachycardia) sets `anyRedFlag = true` and forces
`computedUrgency = 'emergency'` regardless of every other branch — mirroring
how `perioperative-optimization`'s `insufficient-time` domain forces
`defer-surgery`. This is evaluated first, before the reducibility and
symptom branches, so it cannot be short-circuited by an earlier return.

## Clinician-observed rules

These depend on clinician examination and have no patient-self-report
analogue:

- **Cough impulse** — a positive expansile cough impulse on palpation is the
  clinical sign of a hernia; its absence with a strong history supports the
  `occult-hernia-suspected` flag when imaging has not yet been done.
- **Reducibility judgement** — whether the hernia reduces spontaneously, with
  manual pressure, or not at all is a clinician judgement recorded on step 7
  and is the primary driver of the urgency band alongside step 8.
- **Skin changes over the hernia** — erythema or discolouration is both a
  step-5 examination finding and a step-8 red flag; recording it once in each
  step is intentional, because step 8 is what drives urgency and must stay a
  self-contained safety screen that a clinician can complete without cross
  referencing earlier steps.
- **EHS size grade** — measured in cm on palpation (step 6) and banded into
  the European Hernia Society grade on step 9.

## Clinician override

The engine produces a computed classification and urgency band. The
clinician may override the **urgency band** on step 14 with a mandatory
reason. Both the computed and final values are stored in
`hernia_diagnostic_evaluation_grade` and rendered in the report, the PDF, and
the FHIR Bundle. Safety flags are computed independently of the override and
are always reported — see `doc/safety-case-notes.md` hazard H-01.

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
- LocalStorage draft key: `hernia-diagnostic-evaluation.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/hernia-diagnostic-evaluation/`, RESTful
  dashboard at `/hernia-diagnostic-evaluations/` and
  `/hernia-diagnostic-evaluations/[id]/`.
- LocalStorage draft key:
  `hernia-diagnostic-evaluation.front-end-with-svelte.<id>.v1` (`<id>` is the
  route id, `new` for a fresh evaluation).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- Miserez M, Peeters E, Aufenacker T, et al. *Update with level 1 evidence on
  the European Hernia Society (EHS) groin hernia management guideline.*
  Hernia 2007;18(2):151–63.
- Simons MP, Aufenacker T, Bay-Nielsen M, et al. *European Hernia Society
  guidelines on the treatment of inguinal hernia in adult patients.* Hernia
  2009;13(4):343–403.
- HerniaSurge Group. *International guidelines for groin hernia management.*
  Hernia 2018;22(1):1–165.
- NICE Clinical Knowledge Summaries. *Groin hernia: assessment and
  management.* <https://cks.nice.org.uk/topics/groin-hernia/>
- BMJ Best Practice. *Assessment of groin masses and hernias.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

This form is decision support; it does not diagnose and does not replace the
clinical judgement of the examining clinician. Any positive red flag requires
same-day clinical escalation regardless of what the software displays.

## Verify

```sh
bin/test-form hernia-diagnostic-evaluation
bin/test-sql-apply hernia-diagnostic-evaluation
bin/test-examples-conformance hernia-diagnostic-evaluation
bin/lily-html-refactor --check hernia-diagnostic-evaluation
```
