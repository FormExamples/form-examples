# Dietetic Assessment — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and
Rust back-end) must satisfy. Treat it as the source of truth for behaviour —
update the spec before changing code.

Slug: `dietic-assessment`

## 1. Purpose

A UK-aligned, dietitian-driven dietetic assessment: a comprehensive evaluation
of a patient's nutritional status, eating patterns, medical history, and food
environment, conducted by a registered dietitian. The form computes a **MUST**
score with its risk category, a **GLIM** malnutrition diagnosis, a composite
nutrition risk level, and a set of safety-critical flags, and emits a signed
nutrition care plan.

The directory slug uses the `dietic` stem; prose uses the conventional clinical
spelling *dietetic*. See [`../AGENTS.md`](../AGENTS.md) §"Slug and spelling".

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the scoring engine, the two front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust JSON-API crate listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
and any automated onward referral. Paediatric assessment is out of scope: MUST
is not validated below 16 years, so the engine raises a `paediatric` flag and
directs the user to a paediatric-specific pathway rather than scoring.

## 3. Scoring system

**Primary instrument — MUST (BAPEN), 0–6.**

| Component | 0 | 1 | 2 |
| --- | --- | --- | --- |
| BMI (kg/m²) | > 20.0 | 18.5–20.0 | < 18.5 |
| Unplanned weight loss in 3–6 months | < 5 % | 5–10 % | > 10 % |
| Acute disease effect (acutely ill **and** no / likely no intake > 5 days) | — | — | 2 |

MUST risk category: `0` → low, `1` → medium, `≥ 2` → high.

When weight is declined or unavailable, BMI score is estimated from mid-upper
arm circumference (MUAC < 20.0 cm → 2; < 23.5 cm → 1; otherwise 0) and the
result is marked `estimated`.

**Secondary instruments.**

- **GLIM** — malnutrition diagnosis requires ≥ 1 phenotypic criterion
  (unintentional weight loss, low BMI, reduced muscle mass) **and** ≥ 1
  etiologic criterion (reduced intake or assimilation, inflammation or disease
  burden). Severity: moderate or severe.
- **NRS-2002** — 0–7; at-risk threshold ≥ 3 (acute inpatient setting).
- **SARC-F** — 0–10; at-risk threshold ≥ 4.
- **Refeeding-syndrome risk** — NICE CG32 high-risk / highest-risk criteria.
- **Bristol Stool Form Scale** 1–7; **IDDSI** levels 0–7.

**Composite nutrition risk** — Low / Moderate / High / Critical by max-grade:
the worst band across instruments wins.

| Category | Drivers |
| --- | --- |
| Low | MUST 0, no GLIM criteria, adequate intake |
| Moderate | MUST 1, single mid-band finding, SARC-F ≥ 4 |
| High | MUST ≥ 2, GLIM moderate, NRS-2002 ≥ 3, intake < 50 % of requirement |
| Critical | GLIM severe, refeeding high risk, unsafe swallow, BMI < 16, weight loss > 15 % |

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in
[`../sql/`](../sql/) (12 migration files). Unanswered text and enum fields
default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the MUST components and
total, MUST risk, GLIM criteria and diagnosis, NRS-2002, SARC-F, refeeding
risk, estimated energy and protein requirements, composite risk, `firedRules[]`,
`additionalFlags[]`, and a clinical report. Rendered as HTML in the browser,
exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle,
XML, JSON, CSV, or TSV.

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
| `examples` | filled-form JSON fixture + FHIR R5 Bundle |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup
script) are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Data model

Twelve migrations under [`../sql/`](../sql/):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | demographics + anthropometrics |
| `03_create_table_dietitian.sql` | `dietitian` | dietitian identity + registration |
| `04_create_table_medication.sql` | `medication` | medication / supplement catalogue |
| `05_create_table_patient_medication.sql` | `patient_medication` | join: patient ↔ medication |
| `06_create_table_allergy.sql` | `allergy` | food and other allergen catalogue |
| `07_create_table_patient_allergy.sql` | `patient_allergy` | join: patient ↔ allergy with reaction |
| `08_create_table_dietic_assessment.sql` | `dietic_assessment` | the 16-step wizard payload |
| `09_create_table_dietic_assessment_grade.sql` | `dietic_assessment_grade` | computed + final scores, one per assessment |
| `10_create_table_dietic_assessment_grade_rule.sql` | `dietic_assessment_grade_rule` | audit trail of fired rules |
| `11_create_table_dietic_assessment_grade_flag.sql` | `dietic_assessment_grade_flag` | safety flags with priority and action |

## 7. Acceptance criteria

- `bin/test-form dietic-assessment` exits cleanly.
- `bin/test-sql-apply dietic-assessment` applies every migration in order to a
  fresh scratch Postgres database.
- `bin/test-examples-conformance dietic-assessment` reports no drift between
  `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O) and unit-tested;
  MUST component boundaries (BMI 18.5 / 20.0, weight loss 5 % / 10 %) have
  explicit boundary tests.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check dietic-assessment` reports no drift.
- The wizard is one continuous single page — no multi-page navigation.
- Declining to be weighed never blocks completion: the form accepts a
  `declined` measurement method and estimates from MUAC.
- LocalStorage keys preserve draft state across reloads:
  - `dietic-assessment.front-end-with-html.v1` (HTML)
  - `dietic-assessment.front-end-with-svelte.v1` (SvelteKit)

## 8. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. This form is decision support: it computes validated
screening scores and surfaces flags, but does not diagnose and does not replace
the clinical judgement of a registered dietitian.

## 9. References

- [`index.md`](../index.md) — form description and scoring details
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
bin/test-form dietic-assessment
```
