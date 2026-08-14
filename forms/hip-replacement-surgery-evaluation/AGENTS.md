# Hip Replacement Surgery Evaluation — Agent Instructions

Orthopaedic hip-replacement surgery evaluation. Collects presenting history,
the Oxford Hip Score, physical examination, imaging, and a conservative-
treatment audit via a 15-step single-page wizard; computes an **Oxford Hip
Score (OHS)** total (0–48) with its category, and a composite
**surgical-candidacy recommendation**; and emits a signed evaluation report.

See [`index.md`](./index.md) for the full design and the 15-step wizard table.

## What this form is not

It is **not** another ASA-grading pre-operative assessment. The monorepo
already has three of those
([`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../pre-anaesthesia-assessment)), plus a
dedicated fitness-for-surgery form,
[`perioperative-optimization`](../perioperative-optimization). This form does
not compute an ASA grade and must not grow one. Its question is *does this
patient's hip disease and functional decline justify replacement surgery, and
have conservative options been exhausted?* Step 11 records only a brief
general-fitness screening note (diabetes control, cardiac disease, bleeding
disorder/anticoagulant use, smoking status). If a change would make this form
answer "how risky is this patient under anaesthesia?" instead, it belongs in
one of the siblings above.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (OHS scoring, safety-case notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — single-page clinician wizard (`index.html`) +
  review dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard;
  routes nested under `src/routes/hip-replacement-surgery-evaluation/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/hip_replacement_surgery_evaluation/`

## Scoring engine

- **Input shape:** `HipReplacementSurgeryEvaluation` TypeScript type containing
  the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateHipEvaluation(data: HipReplacementSurgeryEvaluation): {
    ohsTotal: number;                     // 0..48
    ohsCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory';
    kellgrenLawrenceGrade: number | null; // 0..4
    computedCandidacy: 'strong-candidate' | 'candidate'
                      | 'continue-conservative' | 'not-indicated' | 'mdt-review';
    finalCandidacy: 'strong-candidate' | 'candidate'
                   | 'continue-conservative' | 'not-indicated' | 'mdt-review';
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** rule-order evaluation — `continue-conservative` is checked
  first (conservative measures not exhausted overrides everything else), then
  `not-indicated`, then `strong-candidate`, then `candidate`, then
  `mdt-review` as the fallback. Safety flags fire independently of the
  candidacy recommendation.
- **Engine files (HTML):** `js/types.js`, `js/ohs-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `ohs-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both sides
  of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Oxford Hip Score computation

OHS total = sum of the 12 items (each 0 worst to 4 best), 0–48.

```
ohsTotal    = sum(item1..item12)
ohsCategory = ohsTotal <= 19 ? 'severe'
            : ohsTotal <= 29 ? 'moderate'
            : ohsTotal <= 39 ? 'mild-to-moderate'
            : 'satisfactory'
```

This four-band split is this form's operational convention, documented in
[`spec/index.md`](spec/index.md) §3 — do not change the boundaries without
updating the spec and the boundary tests together.

## Surgical-candidacy computation

```
conservativeMeasuresExhausted === 'no'      -> 'continue-conservative'
ohsTotal >= 40 || kellgrenLawrenceGrade <= 1 -> 'not-indicated'
ohsTotal <= 19 && kellgrenLawrenceGrade >= 3 -> 'strong-candidate'
ohsTotal <= 29 && kellgrenLawrenceGrade >= 2 -> 'candidate'
otherwise                                    -> 'mdt-review'
```

## Clinician override

The engine produces a computed OHS total, category, and candidacy
recommendation. The clinician may override the **candidacy recommendation**
on step 15 with a mandatory reason. Both the computed and final values are
stored in `hip_replacement_surgery_evaluation_grade` and rendered in the
report, the PDF, and the FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- Yes/no fields are the string union `'yes' | 'no' | ''` so they round-trip to
  the SQL `CHECK` constraints without a boolean-to-enum translation layer.
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
- LocalStorage draft key:
  `hip-replacement-surgery-evaluation.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/hip-replacement-surgery-evaluation/`,
  RESTful dashboard at `/hip-replacement-surgery-evaluations/` and
  `/hip-replacement-surgery-evaluations/[id]/`.
- LocalStorage draft key:
  `hip-replacement-surgery-evaluation.front-end-with-svelte.<id>.v1`
  (`<id>` is the route id, `new` for a fresh evaluation).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- Dawson J, Fitzpatrick R, Carr A, Murray D. *Questionnaire on the perceptions
  of patients about total hip replacement.* J Bone Joint Surg Br.
  1996;78(2):185–190. (Oxford Hip Score.)
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.* Ann
  Rheum Dis. 1957;16(4):494–502.
- NHS Getting It Right First Time (GIRFT), *Orthopaedics.*
- National Joint Registry (NJR) annual reports.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

This form is decision support; it does not diagnose and does not replace the
clinical judgement of the orthopaedic surgeon or extended-scope
physiotherapist.

## Verify

```sh
bin/test-form hip-replacement-surgery-evaluation
bin/test-sql-apply hip-replacement-surgery-evaluation
bin/test-examples-conformance hip-replacement-surgery-evaluation
bin/lily-html-refactor --check hip-replacement-surgery-evaluation
bin/lily-svelte-refactor --check hip-replacement-surgery-evaluation
```
