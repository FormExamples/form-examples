# Ottawa Ankle Rules (and Ottawa Foot Rules) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `ottawa-ankle-rules`

## 1. Purpose

A validated clinical decision rule that decides, after an acute ankle or midfoot
injury, whether an **ankle X-ray** and/or a **foot X-ray** is indicated. It
records objective bedside findings (pain zone, bone tenderness at four
landmarks, ability to bear weight) and applies a boolean decision algorithm to
produce two independent imaging decisions. This is a **classification /
decision-rule** instrument, **not** a numeric score: there is no total and no
risk band, only two boolean outputs plus the criteria that fired.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, decision engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, and paediatric scoring
(the rule targets adults ≥ 18; paediatric variants are out of scope).

## 3. Data model

A single logical assessment record. Text/enum fields default to `''`; numeric,
date, and time fields default to `null`. Bedside findings are captured as
`yes` / `no` enums (default `''`) so an unanswered finding is distinguishable
from a negative one.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse-practitioner / paramedic / physiotherapist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / minor-injury-unit / urgent-care / other |
| `injuredSide` | enum | left / right |
| `hoursSinceInjury` | numeric | time since injury (hours) |
| `patientIdentifier` | text | local identifier |
| `ageYears` | numeric | patient age in years |
| `sex` | enum | patient sex |

**Applicability.**

| Field | Type | Notes |
| --- | --- | --- |
| `assessmentReliable` | enum (yes/no) | no intoxication, distracting injury, or sensory deficit |

**Criterion inputs.**

| Field | Type | Criterion |
| --- | --- | --- |
| `malleolarZonePain` | enum (yes/no) | ankle precondition |
| `lateralMalleolusTenderness` | enum (yes/no) | A1 — posterior edge/tip lateral malleolus |
| `medialMalleolusTenderness` | enum (yes/no) | A2 — posterior edge/tip medial malleolus |
| `midfootZonePain` | enum (yes/no) | foot precondition |
| `fifthMetatarsalBaseTenderness` | enum (yes/no) | F1 — base of fifth metatarsal |
| `navicularTenderness` | enum (yes/no) | F2 — navicular |
| `ableToBearWeightImmediately` | enum (yes/no) | weight-bearing immediately after injury |
| `ableToBearWeightNow` | enum (yes/no) | weight-bearing at assessment |

**Derived (never stored as input).** `unableToBearWeight`, `ankleXrayIndicated`,
`footXrayIndicated`, `firedCriteria[]`, `flaggedIssues[]`.

## 4. Decision algorithm

Pure function, no I/O. Booleans below treat the enum value `'yes'` as true and
anything else (`'no'`, `''`) as false.

```
unableToBearWeight =
  ableToBearWeightImmediately == 'no' && ableToBearWeightNow == 'no'
  // "unable to bear weight" = cannot take four steps BOTH immediately AND now

ankleXrayIndicated =
  malleolarZonePain == 'yes'
  && ( lateralMalleolusTenderness == 'yes'
       || medialMalleolusTenderness == 'yes'
       || unableToBearWeight )

footXrayIndicated =
  midfootZonePain == 'yes'
  && ( fifthMetatarsalBaseTenderness == 'yes'
       || navicularTenderness == 'yes'
       || unableToBearWeight )
```

- The two decisions are **independent**: any of {ankle only, foot only, both,
  neither} is a valid result.
- `unableToBearWeight` requires **both** weight-bearing questions to be `'no'`.
  If the patient can take four steps at either time point, weight-bearing does
  **not** trigger imaging (though tenderness or zone pain still may).
- The `unableToBearWeight` finding contributes to **both** the ankle and the
  foot decisions.
- Because the rule is designed for high sensitivity, `''` (unanswered) is
  treated as a **negative** finding for the decision itself, but any unanswered
  criterion input raises a data-completeness flag (see §5) so the decision is
  not silently understated.

## 5. Flagged issues (red flags)

Emitted independently of the decision, each with a priority:

- **Ankle X-ray indicated** (high) — `ankleXrayIndicated == true`: request an
  ankle radiograph series.
- **Foot X-ray indicated** (high) — `footXrayIndicated == true`: request a foot
  radiograph series.
- **Unable to bear weight** (high) — `unableToBearWeight == true`: cannot take
  four steps immediately and at assessment; drives both regions.
- **Applicability — age** (medium) — `ageYears != null && ageYears < 18`: rule
  validated for adults; apply paediatric caution / local guidance.
- **Applicability — unreliable assessment** (medium) —
  `assessmentReliable == 'no'`: intoxication, distracting injury, or sensory
  deficit may invalidate the rule; consider imaging on clinical judgement.
- **Incomplete assessment** (low) — any criterion input for a region whose zone
  pain is present is missing: decision may understate the need for imaging;
  re-assess.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A decision object emitted by the engine:

```ts
{
  unableToBearWeight: boolean;
  ankleXrayIndicated: boolean;
  footXrayIndicated: boolean;
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

- `bin/test-form ottawa-ankle-rules` exits cleanly.
- The decision engine is pure (no side effects, no I/O) and unit-tested,
  covering: each ankle criterion (A1/A2/A3) in isolation, each foot criterion
  (F1/F2/F3) in isolation, the zone-pain precondition gating (tenderness present
  but no zone pain → not indicated), the `unableToBearWeight` truth table (both
  `no` → true; any `yes` → false), and the independence of the ankle and foot
  decisions (ankle only, foot only, both, neither).
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

- [`index.md`](../index.md) — form description and decision rule
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form ottawa-ankle-rules
```
