# Cataract Diagnostic Evaluation — specification

This file is the **living domain spec** for this form. It captures the
contract each implementation (SQL schema, generated representations,
front-ends, and Rust back-end) must satisfy. Treat it as the source of truth
for behaviour — update the spec before changing code.

Slug: `cataract-diagnostic-evaluation`

## 1. Purpose

A comprehensive ophthalmic diagnostic evaluation performed by an optometrist
or ophthalmologist to confirm the presence of a cataract, grade its severity
against the validated LOCS III instrument, assess its functional impact on
the patient's daily life, rule out competing posterior-segment pathology
(glaucoma, age-related macular degeneration, diabetic retinopathy), and
determine surgical candidacy.

This form is distinct from [`eye-vision-test-result`](../../eye-vision-test-result)
(a general vision-test-result record) in that it is specifically
cataract-focused: LOCS III lens grading, glare testing, biometry for
intraocular-lens (IOL) planning, and a computed surgical-candidacy
recommendation.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the LOCS III grading and surgical-candidacy engine, the
two front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust
JSON-API crate listed in §5.

Out of scope: hosted deployment, authentication, multi-tenancy, prescribing,
and any automated onward referral. Paediatric cataract is out of scope: LOCS
III and the adult cataract-referral pathway modelled here are not validated
below 16 years, so the engine raises a `paediatric` flag and directs the user
to a paediatric ophthalmology pathway rather than scoring.

## 3. Scoring system

**Primary instrument — LOCS III (Lens Opacities Classification System III),
Chylack et al., Arch Ophthalmol 1993.** Four subscales, each graded per eye on
a continuous 0.1-step decimal scale against the LOCS III standard
photographs:

| Subscale | Range | Meaning |
| --- | --- | --- |
| Nuclear Opalescence (NO) | 0.1–6.9 | density of the nuclear opacity |
| Nuclear Colour (NC) | 0.1–6.9 | yellow/brunescent colouration of the nucleus |
| Cortical cataract (C) | 0.1–5.9 | extent of cortical spoking/opacity |
| Posterior Subcapsular cataract (P) | 0.1–5.9 | extent of posterior subcapsular plaque |

LOCS III itself does not define a severity band; it is a continuous grading
scale read against reference photographs. **This form's own operational
simplification** (not part of the original LOCS III publication) collapses
the four subscores per eye into a three-level severity band, used only to
drive this form's surgical-candidacy recommendation:

```
severity = 'severe'   if any of NO, NC, C, P >= 5.0
severity = 'moderate' if not severe and any of NO, NC, C, P is 3.0-4.9
severity = 'mild'     if all four subscores < 3.0
```

Because C and P only range to 5.9, "any subscore ≥ 5.0" for those two
subscales is a comparatively small window near their ceiling; NO and NC range
to 6.9. The band is computed independently per eye.

**Computed surgical candidacy** (`computedSurgicalCandidacy`), derived from
the worse eye's severity band, best-corrected visual acuity, and glare
testing:

```
'not-indicated'  if severity is mild in both eyes AND best-corrected
                 visual acuity is 6/12 or better (LogMAR <= 0.30) in both eyes
'consider'       if severity is moderate in the affected eye, OR
                 best-corrected acuity is worse than 6/12 in the affected eye
'indicated'      if severity is severe in the affected eye, OR
                 best-corrected acuity is worse than 6/18 (LogMAR >= 0.48), OR
                 glare-testing functional impact is severe
'urgent-referral' if any safety/referral flag below has fired
```

These bands are evaluated in the order above (later conditions win), so a
severe finding or a fired flag always overrides a milder computed band.

**Functional / quality-of-life score.** A simple 0–4 self-report composite
(not a validated instrument) covering difficulty with reading, driving, and
daily activities, mirroring the simple composite functional scores used
elsewhere in this repository (e.g. `dietic-assessment`'s SARC-F). It informs
the clinical picture but does not itself gate the computed surgical
candidacy.

## 4. Safety / referral flags

Computed independently of the surgical-candidacy recommendation and never
suppressed by a clinician override. Priority: high / medium / low.

| Flag | Priority | Fires when |
| --- | --- | --- |
| `competing-pathology-suspected` | high | glaucoma, AMD, or diabetic retinopathy suspected (step 11) |
| `raised-iop` | high | intraocular pressure > 21 mmHg in either eye (step 9) |
| `view-obscured-fundus-not-assessed` | medium | cataract view obscures the fundus in either eye AND the dilated fundus exam was not performed (steps 7/10) |
| `rapid-progression` | medium | symptom duration < 3 months AND a severe LOCS III grade in either eye |
| `biometry-incomplete-for-surgical-planning` | low | management recommendation is a surgical referral AND biometry was not performed (steps 12/14) |
| `paediatric` | standard | patient age < 16 years — LOCS III and this form's adult referral pathway are not validated for paediatric cataract; direct to a paediatric ophthalmology pathway instead of scoring |

## 5. Inputs and outputs

**Inputs.** A typed evaluation object whose shape mirrors the SQL schema in
[`../sql/`](../sql/). Unanswered text and enum fields default to `''`;
unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the LOCS III severity
band per eye, the computed and final surgical-candidacy recommendation, the
functional/QoL composite score, `firedRules[]`, `flags[]`, and a clinical
report. Rendered as HTML in the browser, exported as PDF via the SvelteKit
endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 6. Artefacts

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

## 7. Data model

Five migrations under [`../sql/`](../sql/) (after the two shared bootstrap
migrations):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | patient demographics |
| `03_create_table_clinician.sql` | `clinician` | optometrist/ophthalmologist identity + registration |
| `04_create_table_cataract_diagnostic_evaluation.sql` | `cataract_diagnostic_evaluation` | the 14-step wizard payload |
| `05_create_table_cataract_diagnostic_evaluation_grade.sql` | `cataract_diagnostic_evaluation_grade` | computed + final grading, one per evaluation |
| `06_create_table_cataract_diagnostic_evaluation_grade_flag.sql` | `cataract_diagnostic_evaluation_grade_flag` | safety flags with priority and action |

Several fields are naturally per-eye (visual acuity, refraction, LOCS III
subscores, tonometry, fundus findings, biometry). These use paired
`_right` / `_left` column-suffix columns on the single wizard table, matching
the precedent in [`../../eye-vision-test-result/sql/`](../../eye-vision-test-result/sql)
(e.g. `visual_acuity_right`/`visual_acuity_left`), rather than a per-eye child
table.

## 8. Acceptance criteria

- `bin/test-form cataract-diagnostic-evaluation` exits cleanly.
- `bin/test-sql-apply cataract-diagnostic-evaluation` applies every migration
  in order to a fresh scratch Postgres database.
- `bin/test-examples-conformance cataract-diagnostic-evaluation` reports no
  drift between `examples/assessment.json` and the schema.
- The scoring engine is pure (no side effects, no I/O) and unit-tested; every
  LOCS III severity-band threshold (3.0, 5.0) and every surgical-candidacy
  threshold (LogMAR 0.30, 0.48) has explicit boundary tests on both sides.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check cataract-diagnostic-evaluation` reports no
  drift.
- The wizard is one continuous single page — no multi-page navigation.
- LocalStorage keys preserve draft state across reloads:
  - `cataract-diagnostic-evaluation.front-end-with-html.v1` (HTML)
  - `cataract-diagnostic-evaluation.front-end-with-svelte.v1` (SvelteKit)

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. This form is decision support: it computes a
validated lens-grading instrument and this form's own operational
severity/candidacy bands, and surfaces safety flags, but does not diagnose
and does not replace the clinical judgement of an optometrist or
ophthalmologist.

## 10. Clinical grounding

- Chylack LT Jr, Wolfe JK, Singer DM, et al. *The Lens Opacities
  Classification System III.* Arch Ophthalmol. 1993;111(6):831–6.
- NICE. *Cataracts in adults: management* (NG77).
  <https://www.nice.org.uk/guidance/ng77>
- Royal College of Ophthalmologists. *Cataract Surgery Guidelines* (2010, and
  subsequent commissioning guidance). <https://www.rcophth.ac.uk/>
- Snellen H. *Test-types for the determination of the acuity of vision*
  (1862) — the Snellen visual-acuity notation used alongside LogMAR.
- Medical News Today. *How is cataract diagnosed?*
  <https://www.medicalnewstoday.com/articles/cataract-diagnosis>

## 11. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`doc/index.md`](../doc/index.md) — clinical reference documentation
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 12. Verify

```sh
bin/test-form cataract-diagnostic-evaluation
```
