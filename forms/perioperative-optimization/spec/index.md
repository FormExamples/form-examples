# Perioperative Optimization — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `perioperative-optimization`

## 1. Purpose

A UK NHS–aligned perioperative optimisation and prehabilitation intake: identify
**reversible** health problems before elective surgery, decide what can be
treated in the time available, and build a personalised prehabilitation plan.
The engine grades eight optimisation domains against the time remaining before
surgery, computes a composite surgical readiness band, raises safety flags, and
emits a domain-by-domain plan.

The directory slug uses the US `optimization` stem; prose uses the UK
*optimisation*. See [`../AGENTS.md`](../AGENTS.md) §"Slug and spelling".

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the scoring engine, the two front-ends (form + dashboard,
each in HTML and SvelteKit), and the Rust JSON-API crate listed in §6.

Out of scope, deliberately:

- **ASA grading.** Three sibling forms already compute it. This form must not
  grow an ASA grade; see [`../AGENTS.md`](../AGENTS.md) §"What this form is not".
- **Emergency surgery.** There is no lead time to optimise in. The form records
  the urgency and directs the user to the assessment siblings.
- **Paediatrics.** MUST and the Clinical Frailty Scale are not validated below
  16 years; the engine raises a `paediatric` flag and redirects.
- Hosted deployment, authentication, multi-tenancy, prescribing, and any
  automated onward referral.

## 3. The eight domains

Each domain is `{ key, leadTimeWeeks, trigger, intervention }`, defined once in
`DOMAIN_DEFINITIONS` and read by every implementation.

| Key | Lead time | Trigger | Intervention |
| --- | --- | --- | --- |
| `anaemia` | 4 | Hb < 130 g/L (men) or < 120 g/L (women); or ferritin < 30 µg/L; or ferritin 30–100 µg/L with TSAT < 20 % | oral or intravenous iron |
| `glycaemic-control` | 12 | HbA1c ≥ 48 mmol/mol | diabetes-team review, medication adjustment |
| `smoking` | 4 | current smoker | cessation support and nicotine replacement |
| `alcohol` | 4 | > 14 units/week, or AUDIT-C ≥ 5 (men) / ≥ 4 (women) | brief intervention, reduction plan |
| `nutrition` | 3 | MUST ≥ 2, or unintentional weight loss > 10 % | dietitian referral, oral nutritional supplements |
| `physical-fitness` | 6 | METs < 4, DASI < 34, 6-minute walk < 400 m, or CPET AT < 11 ml/kg/min | prehabilitation exercise programme |
| `medication` | 1 | anticoagulant, antiplatelet, SGLT2 inhibitor, GLP-1 agonist, ACE inhibitor / ARB, steroid, or immunosuppressant in use without an agreed hold plan | agreed hold-and-restart plan |
| `cardiorespiratory` | 4 | systolic ≥ 180 or diastolic ≥ 110 mmHg; uncontrolled asthma or COPD; ejection fraction < 40 %; or STOP-BANG ≥ 5 with no sleep-apnoea assessment | specialty referral, inhaler review, sleep study |

## 4. Time-to-surgery gating

```
weeksToSurgery = floor((plannedSurgeryDate - assessmentDate) / 7)   // null if either is absent
```

| Condition | Domain status |
| --- | --- |
| domain not triggered, and the domain applies | `optimised` |
| domain not applicable (e.g. no diabetes) | `not-applicable` |
| triggered, intervention started, `weeks >= leadTime` | `in-progress` |
| triggered, not started, `weeks >= leadTime` | `action-required` |
| triggered, `weeks < leadTime` | `insufficient-time` |
| triggered, `weeksToSurgery === null` | `action-required` (ungated; the report says so) |

`weeksShortfall = leadTime - weeksToSurgery` when positive, else `null`.

## 5. Surgical readiness (max-grade)

| Band | Requirement |
| --- | --- |
| `ready` | every domain `optimised` or `not-applicable` |
| `optimisation-in-progress` | at least one `in-progress`, none worse |
| `optimisation-required` | at least one `action-required`, none worse |
| `defer-surgery` | any `insufficient-time`, or HbA1c ≥ 69 mmol/mol, or Hb < 80 g/L |

Gate decision recorded on step 16: `proceed`, `proceed-with-prehabilitation`,
`defer-and-optimise`, `accept-unoptimised-risk`, `mdt-review`, or `cancel`.

## 6. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml`, `fhir`, `protobuf`, `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |
| `examples` | filled-form JSON fixture + FHIR R5 Bundle |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 7. Data model

Twelve migrations under [`../sql/`](../sql/):

| File | Table | Role |
| --- | --- | --- |
| `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` |
| `01_create_function_set_updated_at.sql` | — | `updated_at` trigger function |
| `02_create_table_patient.sql` | `patient` | demographics + anthropometrics |
| `03_create_table_clinician.sql` | `clinician` | assessor identity + registration |
| `04_create_table_medication.sql` | `medication` | medicine catalogue with perioperative hold guidance |
| `05_create_table_patient_medication.sql` | `patient_medication` | join, with the hold-and-restart plan |
| `06_create_table_allergy.sql` | `allergy` | allergen catalogue |
| `07_create_table_patient_allergy.sql` | `patient_allergy` | join, with reaction and severity |
| `08_create_table_perioperative_optimization.sql` | `perioperative_optimization` | the 16-step wizard payload |
| `09_create_table_perioperative_optimization_grade.sql` | `..._grade` | computed + final readiness, one per assessment |
| `10_create_table_perioperative_optimization_grade_domain.sql` | `..._grade_domain` | per-domain status, lead time, shortfall |
| `11_create_table_perioperative_optimization_grade_flag.sql` | `..._grade_flag` | safety flags with priority and action |

Note the per-domain child table: unlike the sibling forms, the fired-rule audit
trail and the **domain result set** are distinct, because the domain statuses
are the primary output rather than a by-product.

## 8. Acceptance criteria

- `bin/test-form perioperative-optimization` exits cleanly.
- `bin/test-sql-apply perioperative-optimization` applies every migration in
  order to a fresh scratch PostgreSQL database.
- `bin/test-examples-conformance perioperative-optimization` reports no drift.
- The engine is pure (no I/O, no clock) and unit-tested. Every domain threshold
  and every gating boundary (`weeks == leadTime`, `weeks == leadTime - 1`) has
  an explicit test on both sides.
- An `insufficient-time` domain always forces `defer-surgery` and always raises
  the `insufficient-time-to-optimise` flag.
- A clinician override changes the readiness band only; the safety-flag list is
  byte-identical with and without it.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- The wizard is one continuous single page — no multi-page navigation.
- LocalStorage keys preserve draft state across reloads:
  - `perioperative-optimization.front-end-with-html.v1`
  - `perioperative-optimization.front-end-with-svelte.<id>.v1`

## 9. Compliance

Inherits the monorepo baseline: MDCG 2019-11 Rev.1, UK Medical Devices
Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical
Device. Decision support only: the form surfaces what is modifiable and whether
there is time, but the decision to proceed, defer, or accept unoptimised risk
belongs to the responsible surgical and anaesthetic team.

## 10. References

- [`index.md`](../index.md) — form description, domain table, wizard table
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`doc/index.md`](../doc/index.md) — clinical reference documentation
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form perioperative-optimization
```
