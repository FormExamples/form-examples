# Rockall Score for Upper Gastrointestinal Bleeding — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `rockall-score-for-upper-gastrointestinal-bleeding`

## 1. Purpose

A risk-stratification instrument for adults with acute upper GI bleeding. It
records three clinical parameters (age, shock, comorbidity) to produce a
**pre-endoscopy (clinical) Rockall score of 0–7**, and — when endoscopy has been
performed — adds two endoscopic parameters (diagnosis, stigmata of recent
haemorrhage) to produce a **full (post-endoscopy) Rockall score of 0–11**. A
higher score means a higher risk of rebleeding and death; a full score of **≤ 2**
identifies a low-risk group. It is a risk estimate and escalation prompt, not a
diagnostic or treatment decision.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, lower GI bleeding, and
paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / gastroenterologist / endoscopist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / ward / endoscopy-unit / other |
| `presentingComplaint` | text | e.g. haematemesis, melaena, coffee-ground vomiting |
| `patientIdentifier` | text | local identifier |
| `ageYears` | numeric | patient age in years (scoring input for age parameter) |
| `sex` | enum | patient sex |

**Clinical parameter inputs.**

| Field | Type | Parameter |
| --- | --- | --- |
| `heartRate` | numeric (bpm) | shock |
| `systolicBloodPressure` | numeric (mmHg) | shock |
| `comorbidity` | enum (`none` / `major` / `severe`) | comorbidity |

`comorbidity` values: `none` (no major comorbidity, 0), `major` (cardiac
failure, ischaemic heart disease, or any major comorbidity, 2), `severe` (renal
failure, liver failure, or disseminated malignancy, 3).

**Endoscopic parameter inputs (full score only).**

| Field | Type | Parameter |
| --- | --- | --- |
| `endoscopyPerformed` | enum (`yes` / `no`) | gates the full score |
| `diagnosis` | enum (`mallory-weiss-or-none` / `all-other` / `upper-gi-malignancy`) | diagnosis |
| `stigmata` | enum (`none-or-dark-spot` / `high-risk`) | stigmata of recent haemorrhage |

`diagnosis` values map to 0 / 1 / 2; `stigmata` values map to 0 / 2 (`high-risk`
= blood in upper GI tract, adherent clot, or visible / spurting vessel).

**Derived (never stored as input).** `agePoints`, `shockPoints`,
`comorbidityPoints`, `clinicalRockallScore`, `diagnosisPoints`, `stigmataPoints`,
`fullRockallScore`, `riskBand`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each parameter maps to exact points.

```
agePoints         = ageYears == null           ? 0
                  : ageYears >= 80              ? 2
                  : ageYears >= 60              ? 1
                  :                                0

shockPoints       = systolicBloodPressure != null && systolicBloodPressure < 100 ? 2
                  : heartRate != null && heartRate >= 100                          ? 1
                  :                                                                   0

comorbidityPoints = comorbidity == 'severe' ? 3
                  : comorbidity == 'major'  ? 2
                  :                            0

clinicalRockallScore = agePoints + shockPoints + comorbidityPoints          // 0..7

diagnosisPoints   = diagnosis == 'upper-gi-malignancy'     ? 2
                  : diagnosis == 'all-other'               ? 1
                  :                                           0             // mallory-weiss-or-none / ''

stigmataPoints    = stigmata == 'high-risk' ? 2 : 0

fullRockallScore  = endoscopyPerformed == 'yes'
                    ? clinicalRockallScore + diagnosisPoints + stigmataPoints  // 0..11
                    : null

score      = fullRockallScore != null ? fullRockallScore : clinicalRockallScore
riskBand   = fullRockallScore != null
             ? (fullRockallScore <= 2 ? 'low' : fullRockallScore <= 4 ? 'intermediate' : 'high')
             : (clinicalRockallScore == 0 ? 'low' : 'clinical-only')
```

- **Shock** is derived from the two vital signs: hypotension (SBP < 100) takes
  precedence (2 points) over tachycardia (HR ≥ 100, 1 point) over no shock (0).
- The **full score** is only computed when `endoscopyPerformed == 'yes'`;
  otherwise the clinical score stands and the band is reported as
  `clinical-only` (except a clinical 0, reported `low`).
- A missing numeric input contributes 0 points for its parameter and raises a
  data-completeness flag — the score can understate risk.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **High mortality / rebleeding risk** (high) — `fullRockallScore >= 5` (or
  `clinicalRockallScore >= 3` when endoscopy not yet done): admit, monitor,
  arrange endoscopic / surgical intervention.
- **Shock** (high) — `shockPoints >= 1`: tachycardia or hypotension; resuscitate
  and monitor. Hypotension (`shockPoints == 2`) is the more severe.
- **High-risk endoscopic stigmata** (high) — `stigmata == 'high-risk'`: active
  bleeding, non-bleeding visible vessel, or adherent clot; endoscopic therapy
  indicated.
- **Upper GI malignancy** (medium) — `diagnosis == 'upper-gi-malignancy'`:
  arrange oncology / MDT referral.
- **Incomplete assessment** (low) — `ageYears`, `heartRate`, or
  `systolicBloodPressure` missing, or (when relevant) endoscopic parameters
  unrecorded: score may understate risk; reassess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  agePoints: 0 | 1 | 2;
  shockPoints: 0 | 1 | 2;
  comorbidityPoints: 0 | 2 | 3;
  clinicalRockallScore: number;        // 0..7
  diagnosisPoints: 0 | 1 | 2;
  stigmataPoints: 0 | 2;
  fullRockallScore: number | null;     // 0..11 or null (no endoscopy)
  riskBand: 'low' | 'intermediate' | 'high' | 'clinical-only';
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

- `bin/test-form rockall-score-for-upper-gastrointestinal-bleeding` exits
  cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each threshold boundary (age 59/60/79/80, HR 99/100, SBP 99/100, every
  comorbidity / diagnosis / stigmata value) and the clinical-only vs full path.
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
bin/test-form rockall-score-for-upper-gastrointestinal-bleeding
```
