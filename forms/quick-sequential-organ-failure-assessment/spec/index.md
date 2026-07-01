# Quick Sequential Organ Failure Assessment (qSOFA) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `quick-sequential-organ-failure-assessment`

## 1. Purpose

A bedside sepsis-risk screen for adults with suspected or confirmed infection.
It records three objective criteria (respiratory rate, mentation, systolic blood
pressure), scores each 0 or 1, and produces a total qSOFA score of 0–3 with a
risk band. A score of **≥ 2** is a positive screen that prompts escalation (full
SOFA, sepsis workup, senior review). It is not a diagnostic test for sepsis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / paramedic / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / ward / pre-hospital / other |
| `suspectedSource` | text | suspected or confirmed infection source |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Criterion inputs.**

| Field | Type | Criterion |
| --- | --- | --- |
| `respiratoryRate` | numeric (breaths/min) | 1 — respiratory rate |
| `glasgowComaScale` | numeric (3–15) | 2 — mentation |
| `mentationAltered` | enum (yes/no) | 2 — mentation (fallback when GCS unavailable) |
| `systolicBloodPressure` | numeric (mmHg) | 3 — systolic BP |

**Derived (never stored as input).** `respiratoryRatePoint`, `mentationPoint`,
`systolicBloodPressurePoint`, `qsofaScore`, `riskBand`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes 0 or 1:

```
respiratoryRatePoint      = respiratoryRate      != null && respiratoryRate      >= 22  ? 1 : 0
mentationPoint            = (glasgowComaScale != null && glasgowComaScale < 15)
                            || mentationAltered == 'yes'                                 ? 1 : 0
systolicBloodPressurePoint = systolicBloodPressure != null && systolicBloodPressure <= 100 ? 1 : 0

qsofaScore = respiratoryRatePoint + mentationPoint + systolicBloodPressurePoint   // 0..3
riskBand   = qsofaScore >= 2 ? 'higher' : 'lower'
```

- A missing numeric input contributes 0 points for that criterion (absent, not
  positive) and raises a data-completeness flag.
- `mentationAltered == 'yes'` scores the mentation point even when GCS is null,
  so the criterion works at the bedside without a formal GCS.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Sepsis escalation** (high) — `qsofaScore >= 2`: positive screen; escalate to
  full SOFA + sepsis workup + senior review.
- **Hypotension** (high) — `systolicBloodPressure <= 100`: systolic BP at or
  below threshold; risk of shock.
- **Altered mentation** (high) — `glasgowComaScale < 15` or
  `mentationAltered == 'yes'`: new confusion / reduced consciousness.
- **Tachypnoea** (medium) — `respiratoryRate >= 22`: raised respiratory rate.
- **Incomplete assessment** (low) — any of the three criterion inputs missing:
  score may understate risk; re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  respiratoryRatePoint: 0 | 1;
  mentationPoint: 0 | 1;
  systolicBloodPressurePoint: 0 | 1;
  qsofaScore: 0 | 1 | 2 | 3;
  riskBand: 'lower' | 'higher';
  firedCriteria: FiredCriterion[];
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

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

- `bin/test-form quick-sequential-organ-failure-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each threshold boundary (RR 21/22, GCS 14/15, SBP 100/101) and every total
  0–3.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form quick-sequential-organ-failure-assessment
```
