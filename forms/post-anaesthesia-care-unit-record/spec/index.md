# Post-Anaesthesia Care Unit (PACU) Record — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `post-anaesthesia-care-unit-record`

## 1. Purpose

A recovery-room record for patients emerging from anaesthesia or sedation. It
records serial post-operative observations and computes a discharge-readiness
score. The primary instrument is the Modified Aldrete Score (five parameters,
each 0–2, total 0–10); an Aldrete of **≥ 9 with the oxygen-saturation parameter
scoring 2** is the conventional PACU discharge threshold. An optional PADSS
(Post-Anaesthesia Discharge Scoring System, five criteria 0–2, total 0–10, ≥ 9
= street-fit) covers discharge home for day-surgery patients. The record is a
decision-support and documentation aid, not an automated discharge order.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric recovery
scoring, and intensive-care handover.

## 3. Data model

A single logical recovery record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `nurseName` | text | recording recovery nurse |
| `nurseRole` | enum | recovery-nurse / odp / anaesthetist / other |
| `anaesthetistName` | text | supervising anaesthetist |
| `admittedAt` | timestamp | date and time of PACU admission |
| `anaestheticTechnique` | enum | general / regional / sedation / combined |
| `procedure` | text | operation or procedure performed |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `asaStatus` | enum | ASA physical status I–V |
| `baselineSystolicBp` | numeric (mmHg) | pre-anaesthetic baseline systolic BP |
| `ambulatoryCase` | enum (yes/no) | day-surgery case → enables PADSS |

**Aldrete parameter inputs** (each an enum mapped to a 0/1/2 level).

| Field | Type | Parameter |
| --- | --- | --- |
| `activity` | enum (all-four / two / none) | Activity |
| `respiration` | enum (deep-cough / limited / apnoeic) | Respiration |
| `circulation` | enum (within-20 / within-50 / over-50) | Circulation (vs baseline) |
| `consciousness` | enum (awake / arousable / unresponsive) | Consciousness |
| `oxygenSaturation` | enum (room-air / needs-o2 / low-on-o2) | Oxygen saturation |

**Airway, pain and PONV.**

| Field | Type | Notes |
| --- | --- | --- |
| `airwayStatus` | enum | patent / oral-airway / other support |
| `painScore` | numeric (0–10) | verbal / numeric rating scale |
| `ponvSeverity` | enum | none / mild / moderate / severe |
| `analgesiaGiven` | text | analgesics administered in PACU |
| `antiemeticsGiven` | text | antiemetics administered in PACU |

**PADSS criterion inputs** (optional; ambulatory cases only, each 0/1/2).

| Field | Type | Criterion |
| --- | --- | --- |
| `padssVitalSigns` | enum | Vital signs vs baseline |
| `padssAmbulation` | enum | Ambulation |
| `padssNauseaVomiting` | enum | Nausea and vomiting |
| `padssPain` | enum | Pain |
| `padssSurgicalBleeding` | enum | Surgical bleeding |

**Derived (never stored as input).** `activityScore`, `respirationScore`,
`circulationScore`, `consciousnessScore`, `oxygenSaturationScore`,
`aldreteTotal`, `readinessBand`, `padssTotal`, `padssStreetFit`,
`firedParameters[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each Aldrete parameter enum maps to a 0/1/2 score:

```
activityScore         = { all-four: 2, two: 1, none: 0 }[activity]
respirationScore      = { deep-cough: 2, limited: 1, apnoeic: 0 }[respiration]
circulationScore      = { within-20: 2, within-50: 1, over-50: 0 }[circulation]
consciousnessScore    = { awake: 2, arousable: 1, unresponsive: 0 }[consciousness]
oxygenSaturationScore = { room-air: 2, needs-o2: 1, low-on-o2: 0 }[oxygenSaturation]

aldreteTotal  = activityScore + respirationScore + circulationScore
              + consciousnessScore + oxygenSaturationScore                 // 0..10

readinessBand = (aldreteTotal >= 9 && oxygenSaturationScore === 2)
              ? 'discharge-ready' : 'not-ready'
```

PADSS, when the case is ambulatory and all five criteria are supplied:

```
padssTotal     = padssVitalSigns + padssAmbulation + padssNauseaVomiting
               + padssPain + padssSurgicalBleeding                         // 0..10
padssStreetFit = padssTotal >= 9
```

- A missing Aldrete parameter contributes 0 points for that parameter and raises
  a data-completeness flag — the total can understate risk.
- Discharge-readiness is **gated on oxygen saturation**: a total of 9 achieved
  with `oxygenSaturationScore < 2` stays `not-ready`, because an oxygenation
  deficit is the highest-risk parameter.
- PADSS is scored only when `ambulatoryCase === 'yes'` and every criterion is
  supplied; otherwise `padssTotal` and `padssStreetFit` are `null`.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Not ready for discharge** (high) — `aldreteTotal < 9` or
  `oxygenSaturationScore < 2`: PACU discharge criteria not met.
- **Hypoxia** (high) — `oxygenSaturationScore < 2`: SpO₂ below the room-air
  threshold or oxygen-dependent.
- **Unstable vital signs** (high) — `circulationScore < 2` (blood pressure far
  from baseline) or `respirationScore < 2` (compromised breathing).
- **Uncontrolled pain** (medium) — `painScore` above the acceptable threshold
  (e.g. ≥ 4/10).
- **Uncontrolled PONV** (medium) — `ponvSeverity` moderate or severe.
- **Surgical bleeding** (high) — `padssSurgicalBleeding < 2`: more than minimal
  bleeding.
- **Incomplete assessment** (low) — any Aldrete parameter input missing.

## 6. Inputs and outputs

**Input.** A typed record object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  activityScore: 0 | 1 | 2;
  respirationScore: 0 | 1 | 2;
  circulationScore: 0 | 1 | 2;
  consciousnessScore: 0 | 1 | 2;
  oxygenSaturationScore: 0 | 1 | 2;
  aldreteTotal: number;            // 0..10
  readinessBand: 'not-ready' | 'discharge-ready';
  padssTotal: number | null;       // 0..10 or null
  padssStreetFit: boolean | null;
  firedParameters: FiredParameter[];
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

- `bin/test-form post-anaesthesia-care-unit-record` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the discharge boundary (total 8/9), the SpO₂-gated case (total 9 with oxygen
  saturation < 2 stays not-ready), every parameter's 0/1/2 levels, and the PADSS
  ≥ 9 boundary.
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
bin/test-form post-anaesthesia-care-unit-record
```
