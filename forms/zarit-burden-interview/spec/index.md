# Zarit Burden Interview (ZBI) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `zarit-burden-interview`

## 1. Purpose

A caregiver self-report questionnaire measuring the subjective burden of an
informal carer looking after a person with dementia, chronic illness, or
disability. The carer rates 22 items on a 0–4 frequency scale; the items sum to a
total of 0–88, mapped to a burden band. A validated 12-item short form (total
0–48) is also supported. The output prompts carer support, respite, and
mental-health screening; it is not a diagnosis of the carer nor an assessment of
the care recipient.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, assessment of the care
recipient, and eligibility determination for services.

## 3. Data model

A single logical assessment record concerning one carer–recipient pair. Fields
default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Context and subject.**

| Field | Type | Notes |
| --- | --- | --- |
| `practitionerName` | text | administering practitioner |
| `practitionerRole` | enum | clinician / nurse / social-care / carer-support / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | memory-service / community / general-practice / social-care / other |
| `instrumentForm` | enum | `zbi22` (default) / `zbi12` — which item set is scored |
| `carerIdentifier` | text | local identifier for the carer |
| `carerRelationship` | enum | spouse-partner / adult-child / other-relative / friend / other |
| `carerCoResident` | enum | yes / no |
| `careHoursPerWeek` | numeric | approximate hours of care per week |
| `recipientIdentifier` | text | local identifier for the care recipient |
| `recipientCondition` | enum | dementia / chronic-illness / disability / other |

**Item inputs.** `item1` … `item22`, each an integer **0–4** (or `null` when
unanswered). The 12-item short form (`instrumentForm == 'zbi12'`) scores the
short-form subset (items **1, 2, 3, 6, 9, 10, 11, 12, 17, 20, 21, 22**); the
remaining items are ignored for the total but may still be recorded.

**Derived (never stored as input).** `firedItems[]`, `totalScore`, `maxScore`,
`burdenBand`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Additive sum of the answered items in the active item set:

```
activeItems = instrumentForm == 'zbi12' ? SHORT_FORM_ITEMS : ALL_22_ITEMS
totalScore  = sum(item[i] for i in activeItems where item[i] != null)   // missing => contributes 0
maxScore    = instrumentForm == 'zbi12' ? 48 : 88
```

Burden band (ZBI-22, disjoint ranges applied to `totalScore`):

```
0..21  -> 'little-or-none'
22..40 -> 'mild-to-moderate'
41..60 -> 'moderate-to-severe'
61..88 -> 'severe'
```

Short form (ZBI-12), applied to `totalScore` over 0–48:

```
0..16  -> 'lower'      (below the high-burden cut-off)
17..48 -> 'high'       (>= 17: high burden)
```

- Each item contributes its own 0–4 rating. A missing item rating contributes 0
  and raises a data-completeness flag; the total can therefore understate burden.
- The band is derived from the total only; flagged issues (§5) are computed
  independently and may fire on individual items.

## 5. Flagged issues (red flags)

Emitted independently of the band, each with a priority:

- **Severe burden** (high) — ZBI-22 `totalScore >= 61`, or ZBI-12
  `totalScore >= 17`: arrange urgent carer support and respite; screen and refer
  for carer mental-health support.
- **Moderate-to-severe burden** (high) — ZBI-22 `totalScore` in 41–60: arrange a
  carer-support assessment and respite; screen for depression and anxiety.
- **Carer mental-health screen** (high) — high or severe burden, or a maximal
  rating (`4`) on the global burden item (`item22`): screen the carer for
  depression and anxiety.
- **High global burden** (medium) — `item22 >= 3`: the carer rates their overall
  burden as quite frequent or nearly always.
- **Incomplete assessment** (low) — any active item rating missing: the total may
  understate burden; complete the outstanding items.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`; unanswered item ratings default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  firedItems: FiredItem[];      // answered items with rating >= 1
  totalScore: number;           // 0..88 (ZBI-22) or 0..48 (ZBI-12)
  maxScore: 88 | 48;
  burdenBand:
    | 'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe'  // ZBI-22
    | 'lower' | 'high';                                                        // ZBI-12
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

- `bin/test-form zarit-burden-interview` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each band boundary (21/22, 40/41, 60/61 for ZBI-22; 16/17 for ZBI-12), the
  minimum (all-0) and maximum (all-4) totals, missing-item handling, and both
  instrument forms.
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
bin/test-form zarit-burden-interview
```
