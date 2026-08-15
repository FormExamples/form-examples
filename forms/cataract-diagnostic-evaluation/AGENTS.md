# Cataract Diagnostic Evaluation — Agent Instructions

Optometrist/ophthalmologist-driven cataract diagnostic evaluation. Collects
presenting symptoms, ocular/medical history, visual acuity, refraction,
slit-lamp LOCS III grading, glare testing, tonometry, dilated fundus
examination, competing-pathology screen, biometry, and functional impact via
a 15-step single-page wizard; computes a **LOCS III** severity band per eye
and a composite surgical-candidacy recommendation, plus a set of safety
flags; and emits a signed cataract evaluation report.

See [`index.md`](./index.md) for the full design and the 15-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (LOCS III grading, safety-case
  notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — single-page clinician wizard (`index.html`) +
  review dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard;
  routes nested under `src/routes/cataract-diagnostic-evaluation/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/cataract_diagnostic_evaluation/`

## Scoring engine

- **Input shape:** `CataractDiagnosticEvaluation` TypeScript type containing
  the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateCataractEvaluation(data: CataractDiagnosticEvaluation): {
    locsIIISeverityRight: 'mild' | 'moderate' | 'severe' | '';
    locsIIISeverityLeft: 'mild' | 'moderate' | 'severe' | '';
    computedSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    finalSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    overrideReason: string;
    functionalImpactScore: number | null;    // 0..12 (three 0..4 sub-scores)
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worse eye's LOCS III severity band and the
  worse of acuity/glare drive the computed surgical candidacy; safety flags
  fire independently and are never suppressed by a clinician override.
  `not-indicated` is the default when no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/locs-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `locs-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both
  sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## LOCS III severity banding (this form's own simplification)

LOCS III (Chylack et al., Arch Ophthalmol 1993) is a continuous four-subscale
grading scale read against standard photographs; it does not itself define a
severity band. This form's severity band is an operational simplification
for surgical-candidacy triage only:

```
severity = 'severe'   if any of NO, NC, C, P >= 5.0
severity = 'moderate' if not severe and any of NO, NC, C, P is 3.0-4.9
severity = 'mild'     if all four subscores < 3.0
```

Computed independently per eye. See [`doc/locs-iii-grading.md`](./doc/locs-iii-grading.md).

## Surgical-candidacy computation

Evaluated in order, later conditions override earlier ones:

```
'not-indicated'   mild severity both eyes AND best-corrected acuity
                  >= 6/12 (LogMAR <= 0.30) both eyes
'consider'        moderate severity in the affected eye, OR acuity worse
                  than 6/12 in the affected eye
'indicated'       severe severity in the affected eye, OR best-corrected
                  acuity worse than 6/18 (LogMAR >= 0.48), OR severe
                  glare-testing functional impact
'urgent-referral' any safety/referral flag has fired
```

## Clinician-observed rules

- **Glare testing** — a severe functional impact of glare independently
  raises the computed candidacy to `indicated`, even with a mild LOCS III
  grade, because glare disability is a recognised surgical indication not
  captured by static acuity.
- **View obscured by cataract** — when the cataract is too dense to assess
  the fundus and the dilated exam was not performed, the
  `view-obscured-fundus-not-assessed` flag fires because competing
  posterior-segment pathology cannot be excluded.
- **Rapid progression** — symptom duration under 3 months combined with a
  severe LOCS III grade raises `rapid-progression`, prompting consideration
  of a non-age-related cause (e.g. steroid-induced, traumatic, diabetic).

## Clinician override

The engine produces a computed LOCS III severity band per eye and a computed
surgical-candidacy recommendation. The clinician may override the **final
surgical-candidacy recommendation** on step 15 with a mandatory reason. Both
the computed and final values are stored in
`cataract_diagnostic_evaluation_grade` and rendered in the report, the PDF,
and the FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde;
  snake_case in SQL and Rust internals.
- Bilateral findings use paired `_right` / `_left` SQL columns on the single
  wizard table (matching `eye-vision-test-result`), not a per-eye child table.
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
- LocalStorage draft key: `cataract-diagnostic-evaluation.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/cataract-diagnostic-evaluation/`, RESTful
  dashboard at `/cataract-diagnostic-evaluations/` and
  `/cataract-diagnostic-evaluations/[id]/`.
- LocalStorage draft key:
  `cataract-diagnostic-evaluation.front-end-with-svelte.<id>.v1` (`<id>` is
  the route id, `new` for a fresh evaluation).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- Chylack LT Jr, Wolfe JK, Singer DM, et al. *The Lens Opacities
  Classification System III.* Arch Ophthalmol. 1993;111(6):831–6.
- NICE. *Cataracts in adults: management* (NG77).
- Royal College of Ophthalmologists. *Cataract Surgery Guidelines.*
- Snellen H. *Test-types for the determination of the acuity of vision* (1862).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

This form is decision support; it does not diagnose and does not replace the
clinical judgement of an optometrist or ophthalmologist.

## Verify

```sh
bin/test-form cataract-diagnostic-evaluation
bin/test-sql-apply cataract-diagnostic-evaluation
bin/test-examples-conformance cataract-diagnostic-evaluation
bin/lily-html-refactor --check cataract-diagnostic-evaluation
```
