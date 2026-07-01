# Glasgow Coma Scale — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `glasgow-coma-scale`

## 1. Purpose

A structured, clinician-driven assessment of impaired consciousness. The
observer scores three independent responses — Eye opening (E, 1–4), Verbal
response (V, 1–5), and Motor response (M, 1–6) — and the engine computes the
total GCS (3–15), the E/V/M breakdown, and a severity band (mild / moderate /
severe). It supports a "not testable" (NT) result per component and derives the
secondary GCS-Pupils (GCS-P) score. Follows the 2014 Glasgow structured
approach (Teasdale *et al.*).

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`, each combining the wizard and a
review dashboard), and the Rust JSON-API crate. Out of scope: the paediatric GCS
for pre-verbal children, hosted deployment, authentication, multi-tenancy.

## 3. Data model

One assessment row plus a grading result. Field families:

- **Context:** `assessed_at`, `assessor_name`, `assessor_role`, `setting`,
  `reason`.
- **Components:** `eye_score` (1–4), `verbal_score` (1–5), `motor_score` (1–6);
  each `null` when the paired `*_not_testable` boolean is set.
- **Confounders:** `intubated`, `sedated`, `paralysed`, plus per-component NT
  reasons — these justify an NT rating.
- **Pupils (for GCS-P):** `left_pupil_reactive`, `right_pupil_reactive`
  (and size fields for the record).
- **Trend:** `previous_total`, `previous_motor_score`, `previous_assessed_at`.

Enum and text fields default to `''`; numeric, date, and time fields (including
NT components) default to `null`. UUIDv4 primary keys; `created_at`,
`updated_at`, `deleted_at` on every table.

## 4. Algorithm

Pure, deterministic `calculateGcs(assessment)`:

1. Resolve each component score, or `null` when its NT flag is set.
2. `total = eye + verbal + motor`, defined **only** when all three components
   are testable; otherwise `total = null` and `severityBand = null`.
3. Band the defined total:
   - 13–15 → `mild`
   - 9–12 → `moderate`
   - 3–8 → `severe` (coma)
4. `pupilReactivityScore` (PRS) = count of pupils unreactive to light (0–2),
   when both pupils are examined; otherwise `null`.
5. `gcsP = total − PRS`, range 1–15, defined only when both `total` and PRS are
   defined.
6. `breakdown` reports the three components with any NT marked (e.g.
   `E3 V-NT M5`); `totalDisplay` uses the "T" convention for an intubated
   verbal NT (e.g. `9T`).
7. Evaluate the flag rules (§5) and collect `firedRules[]` and
   `flaggedIssues[]`.

The function is total (never throws): missing inputs yield `null` outputs and a
reliability flag rather than an error.

## 5. Flagged issues

Independent of the severity band; stable rule IDs shared across all
implementations. Priority high / medium / low.

| Rule ID | Predicate | Priority |
| --- | --- | --- |
| `gcs-coma` | `total !== null && total <= 8` | high |
| `gcs-deteriorating` | `total` falls ≥ 2 vs `previousTotal`, or `motor` falls vs `previousMotorScore` | high |
| `pupils-abnormal` | pupil reactivity asymmetric, or either pupil unreactive | high |
| `component-not-testable` | any component NT (total undefined) | medium |
| `motor-falling` | `motor` falls vs `previousMotorScore` while total stable | medium |

Choose no flag when no predicate holds. A defined `total <= 8` fires
`gcs-coma`; an undefined total never fires `gcs-coma` but does fire
`component-not-testable`.

## 6. Inputs and outputs

**Inputs.** A typed assessment object mirroring the SQL schema in `sql/`.
Unanswered text / enum fields are `''`; unanswered numeric / date / time fields
are `null`.

**Outputs.** A grading object: `total`, `breakdown`, `totalDisplay`,
`severityBand`, `pupilReactivityScore`, `gcsP`, `firedRules[]`,
`flaggedIssues[]`. Rendered as HTML in the browser, and convertible to FHIR R5
Bundle (Observation resources for the total, each component, and pupils), XML,
JSON, CSV, or TSV.

## 7. Artefacts

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

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form glasgow-coma-scale` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- A defined total in 3–8 bands as `severe`; any NT component leaves the total
  and band `null` and fires `component-not-testable`.

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. Form-specific classification (Class IIa where the score
drives triage or escalation) is recorded in [`index.md`](../index.md).

## 10. References

- [`index.md`](../index.md) — form description and scoring tables
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form glasgow-coma-scale
```
