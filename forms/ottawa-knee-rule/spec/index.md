# Ottawa Knee Rule — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `ottawa-knee-rule`

## 1. Purpose

A validated clinical decision rule that decides whether a **knee radiograph** is
needed after an acute knee injury. It records five objective bedside criteria
and applies **ANY-of** logic: a knee X-ray is **indicated** when at least one
criterion is present and **not indicated** when all five are absent.

This is a **classification / decision-rule** instrument: the output is a binary
imaging decision (`xrayIndicated`), **not** a numeric score, sum, or risk
percentage. The criteria are neither summed nor weighted — presence of any one
is sufficient.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, decision engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric use, and any
interpretation of the radiograph itself.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse-practitioner / physiotherapist / paramedic / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / minor-injuries-unit / urgent-care / other |
| `injuryMechanism` | enum | blunt-trauma / twisting / fall / other |
| `hoursSinceInjury` | numeric (hours) | time since injury; supports applicability check |
| `patientIdentifier` | text | local identifier |
| `sex` | enum | patient sex |
| `injuredSide` | enum | left / right |

**Criterion inputs.**

| Field | Type | Criterion |
| --- | --- | --- |
| `ageYears` | numeric (years) | 1 — age ≥ 55 |
| `patellarTenderness` | enum (yes/no) | 2 — tenderness at the patella |
| `otherBonyTenderness` | enum (yes/no) | 2 — other bony tenderness (used to test *isolation*) |
| `fibularHeadTenderness` | enum (yes/no) | 3 — tenderness at the head of the fibula |
| `unableToFlex90` | enum (yes/no) | 4 — inability to flex the knee to 90° |
| `unableToBearWeight` | enum (yes/no) | 5 — inability to take 4 steps both immediately and in the ED |

**Derived (never stored as input).** `ageCriterion`, `isolatedPatellarCriterion`,
`fibularHeadCriterion`, `flexionCriterion`, `weightBearingCriterion`,
`xrayIndicated`, `decision`, `firedCriteria[]`, `flaggedIssues[]`.

## 4. Decision algorithm

Pure function, no I/O. Each criterion resolves to a boolean; the decision is the
logical OR of the five:

```
ageCriterion              = ageYears != null && ageYears >= 55
isolatedPatellarCriterion = patellarTenderness == 'yes' && otherBonyTenderness == 'no'
fibularHeadCriterion      = fibularHeadTenderness == 'yes'
flexionCriterion          = unableToFlex90 == 'yes'
weightBearingCriterion    = unableToBearWeight == 'yes'

xrayIndicated = ageCriterion
             || isolatedPatellarCriterion
             || fibularHeadCriterion
             || flexionCriterion
             || weightBearingCriterion

decision = xrayIndicated ? 'xray-indicated' : 'xray-not-indicated'
```

- **ANY-of, not additive.** There is no total; one true criterion is sufficient.
  `firedCriteria[]` lists exactly which criteria drove an indicated decision.
- **Isolation matters for criterion 2.** Patellar tenderness indicates imaging
  **only when it is isolated** (no other bony tenderness). Patellar tenderness
  *with* other bony tenderness does not fire criterion 2 — but that "other bony
  tenderness" is itself a clinically meaningful finding and is surfaced as a
  flagged issue prompting clinician review.
- **Missing input is treated as criterion-absent** (a `null`/`''` input does not
  fire its criterion) and raises a data-completeness flag, because an unanswered
  criterion can cause the rule to understate the need for imaging.

## 5. Flagged issues (red flags)

Emitted independently of the decision, each with a priority:

- **X-ray indicated** (high) — `xrayIndicated == true`: one or more criteria
  positive; obtain a knee radiograph per local protocol.
- **Unable to bear weight** (high) — `unableToBearWeight == 'yes'`: cannot take
  four steps; consider significant injury and analgesia.
- **Other bony tenderness present** (medium) — `otherBonyTenderness == 'yes'`:
  bony tenderness beyond the patella; a meaningful finding even though it does
  not fire the isolated-patellar criterion.
- **Applicability caution** (medium) — `hoursSinceInjury` missing or the injury
  is not acute (e.g. > 168 hours / 7 days): the rule is validated for acute
  injury; interpret with care.
- **Incomplete assessment** (low) — any criterion input missing (`ageYears`
  null, or any tenderness / flexion / weight-bearing enum `''`): decision may
  understate the need for imaging; complete the assessment.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  ageCriterion: boolean;
  isolatedPatellarCriterion: boolean;
  fibularHeadCriterion: boolean;
  flexionCriterion: boolean;
  weightBearingCriterion: boolean;
  xrayIndicated: boolean;
  decision: 'xray-indicated' | 'xray-not-indicated';
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

- `bin/test-form ottawa-knee-rule` exits cleanly.
- The decision engine is pure (no side effects, no I/O) and unit-tested,
  covering: the age boundary (54/55), each single-criterion trigger in
  isolation, the isolated-vs-non-isolated patellar distinction, the all-absent
  negative case, and multi-criterion cases.
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

- [`index.md`](../index.md) — form description and decision-rule details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form ottawa-knee-rule
```
