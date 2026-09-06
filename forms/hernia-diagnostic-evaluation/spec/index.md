# Hernia Diagnostic Evaluation — specification

This file is the **living domain spec** for this form. It captures the
contract each implementation (SQL schema, generated representations,
front-ends, and Rust back-end) must satisfy. Treat it as the source of truth
for behaviour — update the spec before changing code.

Slug: `hernia-diagnostic-evaluation`

## 1. Purpose

A hernia diagnostic evaluation: the clinical assessment used to detect,
classify, and grade the urgency of an abdominal-wall or groin hernia,
performed by a GP, surgical registrar, or general surgeon. It is a
**diagnostic classification** form, not a pre-operative-readiness form — its
job is to answer three questions: what type of hernia is this, is it
reducible, and does it need emergency referral today?

The form computes a hernia **classification** (type, EHS subtype, laterality,
EHS size grade, reducibility status) and an **urgency band**
(`routine` / `soon` / `urgent` / `emergency`), rather than a single numeric
score — no single validated numeric instrument dominates this domain. The
design is grounded in the European Hernia Society (EHS) groin-hernia
classification and standard surgical red-flag criteria for strangulation and
incarceration.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the classification/urgency engine, the two front-ends
(form + dashboard, each in HTML and SvelteKit), and the Rust JSON-API crate
listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
operative planning, and post-operative follow-up. This form does not replace
[`pre-operative-assessment-by-clinician`](../../pre-operative-assessment-by-clinician)
or [`pre-operative-assessment-by-patient`](../../pre-operative-assessment-by-patient):
those assess fitness for a *planned* operation once a decision to operate has
been made; this form is upstream of that decision — it decides *whether* and
*how urgently* a hernia needs a surgical opinion at all.

## 3. Classification and urgency system

**Primary output — hernia classification.** Hernia type (inguinal / femoral /
umbilical / epigastric / incisional / paraumbilical / spigelian / other); for
inguinal hernias, the EHS subtype (direct / indirect / pantaloon /
uncertain); laterality (left / right / bilateral); EHS size grade
(1 < 2 cm, 2 = 2–4 cm, 3 > 4 cm); reducibility status (reducible /
irreducible / incarcerated).

**Primary output — urgency band.** `routine` / `soon` / `urgent` /
`emergency`, computed as follows:

| Computed urgency | Condition |
| --- | --- |
| `emergency` | Any red-flag symptom (step 8) is positive, **or** reducibility is `incarcerated` **and** any red flag is positive |
| `urgent` | Reducibility is `irreducible` with no red flags, **or** `incarcerated` with no red flags |
| `soon` | Reducible **and** symptomatic (pain score > 4/10), **or** EHS size grade 3 |
| `routine` | Otherwise |

This mirrors the pattern in
[`perioperative-optimization`](../../perioperative-optimization)'s
`insufficient-time` domain forcing `defer-surgery`: a single safety-critical
finding in step 8 overrides every other input and cannot be diluted by an
otherwise reassuring examination.

**Safety flags**, independent of the urgency band and never suppressed by a
clinician override (same pattern as
[`perioperative-optimization/front-end-with-svelte/src/lib/engine/flagged-issues.ts`](../../perioperative-optimization/front-end-with-svelte/src/lib/engine/flagged-issues.ts)):

| Category | Priority | Fires when |
| --- | --- | --- |
| `strangulation-suspected` | high | Irreducible **and** any red flag positive |
| `incarceration-risk` | high | Irreducible, no red flags yet |
| `emergency-surgical-referral` | high | Any red flag positive |
| `atypical-presentation` | medium | Imaging inconclusive after an inconclusive or atypical exam |
| `occult-hernia-suspected` | medium | High clinical suspicion, negative exam, imaging not yet done |
| `recurrent-hernia` | medium | Prior repair recorded at the same site |
| `paediatric` | high | Patient younger than 16 years |
| `pregnancy` | medium | Patient is pregnant |
| `capacity-concern` | medium | A documented capacity concern |
| `other` | variable | Free-text clinician-raised concern |

`occult-hernia-suspected`'s "negative exam" excludes an irreducible or
incarcerated hernia even when its cough impulse is not elicitable: that
absence is expected once a hernia stops reducing and does not indicate an
inconclusive exam when the mass itself is definitively palpable and the
diagnosis is already confirmed. Fixed 2026-09-06; previously verified and
documented (not silently patched) in `examples/personas.json`.

## 4. Inputs and outputs

**Inputs.** A typed evaluation object whose shape mirrors the SQL schema in
[`../sql/`](../sql/) (7 migration files). Unanswered text and enum fields
default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: `herniaType`,
`herniaSubtype`, `ehsClassification`, `ehsSizeGrade`, `reducibilityStatus`,
`computedUrgency`, `finalUrgency`, `overrideReason`, `recommendation`,
`firedRules[]`, and `flags[]`. Rendered as HTML in the browser, exported as
PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 5. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |
| `examples` | filled-form JSON fixture + FHIR R5 Bundle sample |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup
script) are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Data model

Seven migrations under [`../sql/`](../sql/):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | demographics + basic anthropometrics |
| `03_create_table_clinician.sql` | `clinician` | clinician identity + registration |
| `04_create_table_hernia_diagnostic_evaluation.sql` | `hernia_diagnostic_evaluation` | the 14-step wizard payload |
| `05_create_table_hernia_diagnostic_evaluation_grade.sql` | `hernia_diagnostic_evaluation_grade` | computed + final classification and urgency, one per evaluation |
| `06_create_table_hernia_diagnostic_evaluation_grade_flag.sql` | `hernia_diagnostic_evaluation_grade_flag` | safety flags with priority and action |

## 7. Acceptance criteria

- `bin/test-form hernia-diagnostic-evaluation` exits cleanly.
- `bin/test-sql-apply hernia-diagnostic-evaluation` applies every migration in
  order to a fresh scratch Postgres database.
- `bin/test-examples-conformance hernia-diagnostic-evaluation` reports no
  drift between `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O, no `Date.now()` inside
  rule predicates — the caller passes `assessmentDate`); every urgency-band
  boundary (pain score > 4, EHS grade 3, reducibility transitions) has an
  explicit boundary test.
- Safety flags fire independently of the urgency band and are never
  suppressed by a clinician override — see `doc/safety-case-notes.md`.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check hernia-diagnostic-evaluation` reports no
  drift.
- The wizard is one continuous single page — no multi-page navigation.
- LocalStorage keys preserve draft state across reloads:
  - `hernia-diagnostic-evaluation.front-end-with-html.v1` (HTML)
  - `hernia-diagnostic-evaluation.front-end-with-svelte.v1` (SvelteKit)

## 8. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. This form is decision support: it computes a
classification and an urgency band and surfaces safety flags, but does not
diagnose and does not replace the clinical judgement of the examining
clinician. Any positive red flag or safety flag requires same-day clinical
escalation regardless of what the software displays.

## 9. References

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`doc/index.md`](../doc/index.md) — clinical reference documentation
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 10. Verify

```sh
bin/test-form hernia-diagnostic-evaluation
```
