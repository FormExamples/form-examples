# Centor Score for Streptococcal Pharyngitis — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `centor-score-for-streptococcal-pharyngitis`

## 1. Purpose

A clinical prediction tool that estimates the likelihood that an acute sore
throat is caused by group A beta-haemolytic streptococcus (GABHS) and therefore
whether antibiotics are likely to help. It records four objective Centor
criteria (each 0 or 1) for a Centor total of 0–4, applies the McIsaac age
modifier (+1 for ages 3–14, 0 for 15–44, −1 for ≥ 45) to give a modified score
of −1 to 5, and produces a risk band that guides testing and antibiotic
decisions. It is a decision aid, not a diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, children under 3 years,
and the alternative FeverPAIN tool (referenced but not implemented here).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | gp / nurse-practitioner / pharmacist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | general-practice / urgent-care / pharmacy / emergency-department / other |
| `patientIdentifier` | text | local identifier |
| `patientAge` | numeric (years) | drives the McIsaac age modifier |
| `sex` | enum | patient sex |

**Criterion inputs.** Each yes/no enum; `'yes'` scores 1 point.

| Field | Type | Criterion |
| --- | --- | --- |
| `tonsillarExudate` | enum (yes/no) | 1 — tonsillar exudate or swelling |
| `tenderAnteriorCervicalNodes` | enum (yes/no) | 2 — tender anterior cervical lymphadenopathy |
| `feverPresent` | enum (yes/no) | 3 — temperature > 38 °C or history of fever |
| `measuredTemperature` | numeric (°C) | 3 — optional measured temperature; > 38 sets fever |
| `coughAbsent` | enum (yes/no) | 4 — cough absent (scores when **absent**) |

**Red-flag inputs.** Each yes/no enum; presence raises a red-flag issue
regardless of score.

| Field | Type | Red flag |
| --- | --- | --- |
| `stridorOrBreathingDifficulty` | enum (yes/no) | airway compromise |
| `droolingOrCannotSwallow` | enum (yes/no) | airway / peritonsillar abscess |
| `trismus` | enum (yes/no) | peritonsillar abscess (quinsy) |
| `muffledVoice` | enum (yes/no) | peritonsillar abscess (quinsy) |
| `unilateralNeckSwelling` | enum (yes/no) | peritonsillar abscess (quinsy) |

**Derived (never stored as input).** `tonsillarExudatePoint`,
`tenderNodesPoint`, `feverPoint`, `coughAbsentPoint`, `centorScore` (0–4),
`ageModifier` (−1..+1), `mcIsaacScore` (−1..5), `riskBand`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes 0 or 1:

```
tonsillarExudatePoint = tonsillarExudate == 'yes'            ? 1 : 0
tenderNodesPoint      = tenderAnteriorCervicalNodes == 'yes' ? 1 : 0
feverPoint            = (feverPresent == 'yes')
                        || (measuredTemperature != null && measuredTemperature > 38.0) ? 1 : 0
coughAbsentPoint      = coughAbsent == 'yes'                 ? 1 : 0

centorScore = tonsillarExudatePoint + tenderNodesPoint + feverPoint + coughAbsentPoint  // 0..4

ageModifier = patientAge == null           ? 0
            : patientAge >= 3 && patientAge <= 14 ? +1
            : patientAge >= 45                    ? -1
            : 0                                    // 15..44

mcIsaacScore = centorScore + ageModifier   // -1..5

riskBand = mcIsaacScore <= 1 ? 'low'
         : mcIsaacScore <= 3 ? 'moderate'
         : 'high'                           // 4..5
```

- The fever criterion scores when either the yes/no flag is `'yes'` **or** a
  measured temperature exceeds 38 °C, so the tool works at the bedside with or
  without a thermometer.
- A missing age (`patientAge == null`) applies a modifier of 0 (the adult
  15–44 default) and raises a data-completeness flag; the McIsaac adjustment is
  then absent.
- The original Centor total is retained; banding uses the McIsaac score.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Airway / quinsy red flag** (high) — any of `stridorOrBreathingDifficulty`,
  `droolingOrCannotSwallow`, `trismus`, `muffledVoice`, or
  `unilateralNeckSwelling` is `'yes'`: possible peritonsillar abscess (quinsy)
  or airway compromise; arrange urgent same-day assessment irrespective of the
  Centor/McIsaac score.
- **Antibiotic consideration** (high) — `mcIsaacScore >= 4`: high probability of
  streptococcal infection; consider a RADT/throat swab or empirical antibiotics
  under antimicrobial-stewardship principles, with safety-netting.
- **Testing consideration** (medium) — `mcIsaacScore` is 2 or 3: consider a
  rapid antigen detection test or throat swab; treat only if positive or
  clinically indicated.
- **Antimicrobial stewardship** (low) — `mcIsaacScore <= 1`: low probability;
  avoid antibiotics and a swab, give self-care and safety-netting advice.
- **Incomplete assessment** (low) — a criterion input or `patientAge` is
  missing: the score may be inaccurate; complete the assessment.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  tonsillarExudatePoint: 0 | 1;
  tenderNodesPoint: 0 | 1;
  feverPoint: 0 | 1;
  coughAbsentPoint: 0 | 1;
  centorScore: 0 | 1 | 2 | 3 | 4;
  ageModifier: -1 | 0 | 1;
  mcIsaacScore: number; // -1..5
  riskBand: 'low' | 'moderate' | 'high';
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

- `bin/test-form centor-score-for-streptococcal-pharyngitis` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the fever boundary (38.0/38.1 °C), each age-modifier band boundary
  (2/3, 14/15, 44/45 years), every Centor total 0–4, and the full McIsaac range
  −1 to 5.
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
bin/test-form centor-score-for-streptococcal-pharyngitis
```
