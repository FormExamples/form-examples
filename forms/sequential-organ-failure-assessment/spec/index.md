# Sequential Organ Failure Assessment (SOFA) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
backend) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `sequential-organ-failure-assessment`

## 1. Purpose

A UK NHS–aligned, clinician-driven Sequential Organ Failure Assessment (SOFA)
score that records objective physiological and laboratory findings for six organ
systems and computes a per-system sub-score (0–4), a total SOFA score (0–24), the
change from a prior assessment (delta-SOFA), a mortality-risk band, and
safety-critical flags. The output is a signed clinician report suitable for the
intensive-care record and for Sepsis-3 screening.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, the two consolidated front-ends (form +
dashboard in HTML, and form + dashboard in SvelteKit), and the Rust Loco JSON
API crate listed in §5. Out of scope: hosted deployment, authentication,
multi-tenancy, and the paediatric pSOFA variant.

## 3. Data model — six organ systems

The assessment object carries one input group per organ system plus context and
baseline fields. Unanswered text and enum fields default to `''`; unanswered
numeric, date, and time fields default to `null`.

| System | Inputs | Sub-score driver |
| --- | --- | --- |
| Respiration | `pao2`, `fio2` (or `pao2Fio2Ratio`), `respiratorySupport` | PaO₂/FiO₂ ratio; scores 3–4 require respiratory support |
| Coagulation | `platelets` (×10⁹/L) | platelet count |
| Liver | `bilirubin` (µmol/L or mg/dL) | bilirubin |
| Cardiovascular | `map`, `vasopressor` (agent), `vasopressorDose` (µg/kg/min) | highest of MAP band and vasopressor band |
| CNS | `glasgowComaScale` (3–15), `sedated` | GCS |
| Renal | `creatinine` (µmol/L or mg/dL), `urineOutput` (mL/day) | higher of creatinine band and urine-output band |

Context/baseline fields: `assessorName`, `assessorRole`, `assessedAt`,
`patientId`, `admissionDiagnosis`, `suspectedInfection`, `baselineSofaTotal`,
`hoursSinceAdmission`.

## 4. Grading algorithm

1. For each of the six systems, map the input(s) to a sub-score `0..4` using the
   published thresholds in [`index.md`](../index.md) §Scoring system. Each
   sub-score is deterministic and independent.
2. **Cardiovascular** and **Renal** take the **maximum** band across their two
   criteria (MAP vs vasopressor; creatinine vs urine output).
3. **Respiration** sub-scores of 3 and 4 apply only when `respiratorySupport` is
   truthy; otherwise cap at 2.
4. `totalSofa = sum(subScores)` in `0..24`.
5. `deltaSofa = totalSofa − baselineSofaTotal` when a baseline is present; else
   `null`. Baseline is assumed 0 for patients with no known pre-existing organ
   dysfunction.
6. `mortalityBand` derived from `totalSofa`: 0–6 low, 7–9 moderate, 10–12 high,
   13–14 very high, 15–24 extreme.
7. `sepsis3` is `true` when `suspectedInfection` is affirmative **and**
   `deltaSofa ≥ 2`.
8. A missing input yields a `null` sub-score for that system, an incomplete
   total, and a completeness flag; the engine never guesses.

The engine is **pure** — no side effects, no I/O — and fully unit-tested.

## 5. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth (one migration + one entity per table) |
| `xml` | generated |
| `fhir` | generated (FHIR R5) |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit + Lily (`/<plural>/` list + `/<plural>/[id]` form) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script)
are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md)
§Tools after schema changes.

## 6. Inputs and outputs

**Input.** A typed `SofaAssessment` object whose shape mirrors the SQL schema.

**Output.** A grading object emitted by the engine:

```ts
{
  subScores: {
    respiration: 0|1|2|3|4|null;
    coagulation: 0|1|2|3|4|null;
    liver: 0|1|2|3|4|null;
    cardiovascular: 0|1|2|3|4|null;
    cns: 0|1|2|3|4|null;
    renal: 0|1|2|3|4|null;
  };
  totalSofa: number;            // 0..24
  deltaSofa: number | null;     // totalSofa - baselineSofaTotal
  mortalityBand: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
  sepsis3: boolean;
  firedRules: FiredRule[];
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 7. Flagged issues

Computed independently of the total score. Priority: high / medium / low.

- **Severe single-organ failure** — any system sub-score = 4 (high).
- **Multi-organ failure** — two or more systems sub-scored ≥ 3 (high).
- **Rising SOFA** — `deltaSofa ≥ 2` (high; drives the Sepsis-3 flag when
  infection is suspected).
- **Marked deterioration** — `deltaSofa ≥ 4` over the interval (high).
- **High mortality risk** — `totalSofa ≥ 12` (high).
- **Improving trajectory** — `deltaSofa ≤ −2` (low; informational).
- **Incomplete assessment** — one or more sub-scores `null` (medium).

## 8. Acceptance criteria

- `bin/test-form sequential-organ-failure-assessment` exits cleanly.
- The scoring engine is pure and unit-tested (per-system boundary cases + total).
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- LocalStorage keys preserve draft state across reloads:
  - `sequential-organ-failure-assessment.front-end-with-html.v1` (HTML)
  - `sequential-organ-failure-assessment.front-end-with-svelte.v1` (SvelteKit)

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device. Form-specific classification (Class IIa where output
informs escalation or sepsis screening) is recorded in [`index.md`](../index.md)
and [`AGENTS.md`](../AGENTS.md).

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form sequential-organ-failure-assessment
```
