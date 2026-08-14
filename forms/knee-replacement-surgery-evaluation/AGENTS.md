# Knee Replacement Surgery Evaluation — Agent Instructions

Orthopaedic-surgeon/extended-scope-physiotherapist-driven knee-replacement
surgery evaluation. Collects presenting history, the Oxford Knee Score (OKS),
physical examination, diagnostic imaging, and a conservative-treatment audit
via a 15-step single-page wizard; computes an **OKS** total (0–48) with its
category, a computed **surgical candidacy** recommendation, and a set of
safety flags; and emits a signed evaluation report.

See [`index.md`](./index.md) for the full design and the 15-step wizard table.

## What this form is not

It is **not** another ASA-grading pre-operative assessment. The monorepo
already has three of those
([`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../pre-anaesthesia-assessment)). This form does
not compute an ASA grade and must not grow one. Its question is *does this
patient's knee disease and functional decline justify replacement surgery, and
have conservative options been exhausted?* Step 11 (general health & surgical
fitness screen) deliberately stays high-level — it flags obvious concerns
without grading ASA physical status. If a change would make this form answer
"how risky is this patient under anaesthesia?" instead, it belongs in one of
the siblings. It is also distinct from its twin,
[`hip-replacement-surgery-evaluation`](../hip-replacement-surgery-evaluation),
which asks the same question for the hip using the Oxford Hip Score — the two
forms share structure by design, not clinical content.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (OKS scoring rules, safety-case
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
  routes nested under `src/routes/knee-replacement-surgery-evaluation/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/knee_replacement_surgery_evaluation/`

## Scoring engine

- **Input shape:** `KneeReplacementSurgeryEvaluation` TypeScript type
  containing the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateKneeEvaluation(data: KneeReplacementSurgeryEvaluation): {
    oksItemScores: Record<string, number | null>;
    oksTotal: number;
    computedOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    finalOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    maxKellgrenLawrenceGrade: number | null;
    computedCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    finalCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the OKS total and category are a straight sum and band
  lookup. The candidacy recommendation is a first-match-wins ordered rule
  list (see `oks-rules.ts` / `js/oks-rules.js`). Safety flags fire
  independently of the candidacy override.
- **Engine files (HTML):** `js/types.js`, `js/oks-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `oks-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both
  sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## OKS computation

```
oksTotal            = sum of the 12 item scores (each 0–4), so 0..48
computedOksCategory = oksTotal <= 19 ? 'severe'
                    : oksTotal <= 29 ? 'moderate'
                    : oksTotal <= 39 ? 'mild-to-moderate'
                    : 'satisfactory'
```

## Candidacy computation

Evaluated in order, first match wins (see [`spec/index.md`](spec/index.md)
§3):

1. `strong-candidate` — `oksTotal <= 19` and Kellgren–Lawrence `>= 3` in any
   compartment and conservative measures exhausted.
2. `candidate` — `oksTotal <= 29` and conservative measures exhausted and
   Kellgren–Lawrence `>= 2` in any compartment.
3. `continue-conservative` — conservative measures not exhausted, regardless
   of OKS or Kellgren–Lawrence.
4. `not-indicated` — `oksTotal >= 40`, or Kellgren–Lawrence `<= 1` in every
   compartment.
5. `mdt-review` — fallback.

## Clinician override

The engine produces a computed OKS category and a computed candidacy. The
clinician may override the **candidacy** on step 15 with a mandatory reason.
Both the computed and final values are stored in
`knee_replacement_surgery_evaluation_grade` and rendered in the report, the
PDF, and the FHIR Bundle.

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
- LocalStorage draft key:
  `knee-replacement-surgery-evaluation.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes (`$state`, `$derived`,
  `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for the PDF report endpoint.
- Vitest for engine unit tests.
- Routes nested under `src/routes/knee-replacement-surgery-evaluation/`,
  RESTful dashboard at `/knee-replacement-surgery-evaluations/` and
  `/knee-replacement-surgery-evaluations/[id]/`.
- LocalStorage draft key:
  `knee-replacement-surgery-evaluation.front-end-with-svelte.<id>.v1`
  (`<id>` is the route id, `new` for a fresh evaluation).

## Back-end stack

- Rust edition 2021 (as scaffolded by loco-rs 1.0.1).
- Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).
- `serde(rename_all = "camelCase")` for front-end interop.

## Clinical grounding

- Dawson J, Fitzpatrick R, Murray D, Carr A. *Questionnaire on the perceptions
  of patients about total knee replacement.* Journal of Bone and Joint
  Surgery (Br) 1998;80-B(1):63–9. — the Oxford Knee Score.
- Kellgren JH, Lawrence JS. *Radiological assessment of osteo-arthrosis.*
  Annals of the Rheumatic Diseases 1957;16(4):494–502.
- NHS. *Knee replacement.*
  <https://www.nhs.uk/tests-and-treatments/knee-replacement/>
- NICE. *Joint replacement (primary): hip, knee and shoulder* (NG157).
  <https://www.nice.org.uk/guidance/ng157>

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
bin/test-form knee-replacement-surgery-evaluation
bin/test-sql-apply knee-replacement-surgery-evaluation
bin/test-examples-conformance knee-replacement-surgery-evaluation
bin/lily-html-refactor --check knee-replacement-surgery-evaluation
bin/lily-svelte-refactor --check knee-replacement-surgery-evaluation
```
