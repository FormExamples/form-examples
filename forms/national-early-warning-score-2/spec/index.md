# National Early Warning Score 2 (NEWS2) — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `national-early-warning-score-2`

## 1. Purpose

A UK NHS–aligned implementation of the **National Early Warning Score 2
(NEWS2)**, the Royal College of Physicians' (RCP, 2017) standardised
track-and-trigger early warning system. The form records six routinely measured
physiological parameters, scores each against the published NEWS2 allocation,
aggregates them into a total of **0 to 20+**, and returns the resulting
clinical-risk band with the RCP's recommended monitoring frequency and clinical
response. It is a decision-support aid completed by a clinician taking a set of
adult observations.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy. NEWS2 is out of clinical scope for patients < 16, pregnant women, and spinal-cord injury; these raise an `out-of-scope` flag rather than being scored as valid.

## 3. Data model

The assessment is a single observation set with these logical groups (one SQL table each; UUIDv4 PK, `created_at` / `updated_at` / `deleted_at` on every table):

- **assessment_context** — recording clinician name + role, observation date/time, ward/location, `spo2_scale` (`scale1` | `scale2`), Scale 2 clinician endorsement.
- **patient** — NHS number, name, date of birth.
- **observations** — `respiration_rate` (breaths/min), `spo2` (%), `air_or_oxygen` (`air` | `oxygen`) with device / flow / FiO₂, `systolic_bp` (mmHg), `pulse` (beats/min), `consciousness` (ACVPU: `alert` | `confusion` | `voice` | `pain` | `unresponsive`), `temperature` (°C).
- **result** — per-parameter subscores, aggregate total, red-score boolean, risk band, monitoring frequency, escalation recommendation, fired rules, flags, clinician signature.

## 4. Grading algorithm

Pure function `gradeNews2(data) -> News2Result`. Deterministic; no I/O.

1. Score each parameter to 0–3 via the published bands in [`index.md`](../index.md) §Parameter point allocation:
   - `respiration_rate`, `systolic_bp`, `pulse`, `temperature` use fixed numeric bands.
   - `spo2` is scored against **Scale 1** or **Scale 2** per `spo2_scale`; Scale 2 additionally depends on `air_or_oxygen` (on-air vs on-oxygen sub-rows).
   - `air_or_oxygen` scores **2** when `oxygen`, else **0**.
   - `consciousness` scores **3** for any value other than `alert`; `alert` scores **0**.
2. `aggregate` = sum of the six parameter subscores + the air-or-oxygen subscore (0–20+).
3. `redScore` = true if **any single parameter** subscore = 3.
4. Determine `riskBand` and derived monitoring / response:
   - `aggregate == 0` → **low**, 12-hourly.
   - `aggregate 1–4` and not `redScore` → **low**, 4–6 hourly.
   - `redScore` (any single 3) → at least **low-medium**, 1-hourly, urgent ward-clinician review.
   - `aggregate 5–6` → **medium**, 1-hourly, urgent review by acute-illness-competent team.
   - `aggregate >= 7` → **high**, continuous monitoring, emergency critical-care assessment.
   - The band is the **worst** of the aggregate band and the red-score band (max-severity).
5. Unanswered required parameters do not contribute a score but yield an `incomplete` recommendation until supplied.

## 5. Flagged issues / safety-escalation rules

Computed independently of the band; priority high / medium / low. Rule IDs are identical across every front-end and the back-end.

- `red-score` (high) — any single parameter = 3.
- `aggregate-high` (high) — aggregate ≥ 7; emergency critical-care assessment.
- `aggregate-medium` (medium) — aggregate 5–6; urgent clinical review.
- `new-confusion` (high) — ACVPU ≠ alert; consider sepsis / hypoxia.
- `hypoxia` (high) — SpO₂ below the selected scale's target range.
- `hypotension` (high) — systolic BP ≤ 90 mmHg.
- `on-oxygen` (medium) — supplemental oxygen in use; interpret SpO₂ against target.
- `out-of-scope` (high) — age < 16, pregnancy, or spinal-cord injury; NEWS2 not validated.

## 6. Inputs and outputs

**Inputs.** A typed observation object whose shape mirrors the SQL schema in `sql/`. Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object: per-parameter subscores, `aggregate`, `redScore`, `riskBand`, `monitoringFrequency`, `recommendation`, `firedRules[]`, `flags[]`, and a clinical report. Rendered as HTML, exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

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

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form national-early-warning-score-2` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, including the published NEWS2 worked examples for Scale 1 and Scale 2.
- The HTML front-ends conform to the Lily HTML headless contract ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check national-early-warning-score-2` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `national-early-warning-score-2.front-end-with-html.v1` (HTML)
  - `national-early-warning-score-2.front-end-with-svelte.v1` (SvelteKit)

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical Device. Form-specific classification (Class IIa where output drives monitoring frequency and escalation) is recorded in [`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md).

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- Royal College of Physicians. *NEWS2* (2017).

## 11. Verify

```sh
bin/test-form national-early-warning-score-2
```
