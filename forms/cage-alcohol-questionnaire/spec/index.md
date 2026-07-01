# CAGE Alcohol Questionnaire — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `cage-alcohol-questionnaire`

## 1. Purpose

A brief four-item screen for alcohol misuse and dependence in adults. It records
four lifetime yes/no questions (Cut down, Annoyed, Guilty, Eye-opener), scores
each 0 or 1, and produces a total CAGE score of 0–4 with a result band. A score
of **≥ 2** is a positive screen that prompts a fuller assessment of drinking. It
is not a diagnostic test for an alcohol-use disorder.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, consumption
quantification, paediatric scoring, the CAGE-AID drug-inclusive variant.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | screening clinician |
| `clinicianRole` | enum | doctor / nurse / midwife / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | primary-care / ward / emergency-department / antenatal / other |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Criterion inputs.** Each is an enum `'' | 'yes' | 'no'` (`''` = unanswered).

| Field | Letter | Question |
| --- | --- | --- |
| `cutDown` | C | felt you should cut down on drinking |
| `annoyed` | A | people annoyed you by criticising your drinking |
| `guilty` | G | felt bad or guilty about your drinking |
| `eyeOpener` | E | morning drink to steady nerves or cure a hangover |

**Derived (never stored as input).** `cutDownPoint`, `annoyedPoint`,
`guiltyPoint`, `eyeOpenerPoint`, `cageScore`, `resultBand`, `positiveItems[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each criterion contributes 0 or 1:

```
cutDownPoint   = cutDown   == 'yes' ? 1 : 0
annoyedPoint   = annoyed   == 'yes' ? 1 : 0
guiltyPoint    = guilty    == 'yes' ? 1 : 0
eyeOpenerPoint = eyeOpener == 'yes' ? 1 : 0

cageScore  = cutDownPoint + annoyedPoint + guiltyPoint + eyeOpenerPoint   // 0..4
resultBand = cageScore >= 2 ? 'positive'
           : cageScore == 1 ? 'low'
           :                  'negative'
```

- An unanswered item (`''`) contributes 0 points (treated as "no" for scoring)
  and raises a data-completeness flag.
- The eye-opener item is scored identically to the others but carries additional
  clinical weight as a dependence marker (see §5).

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Positive screen** (high) — `cageScore >= 2`: clinically significant; undertake
  a fuller assessment of consumption, dependence, and harm and consider a brief
  intervention or referral.
- **Eye-opener positive** (high) — `eyeOpener == 'yes'`: morning drinking to
  steady nerves or relieve a hangover is a marker of physical dependence; warrants
  attention even when the total is below 2.
- **Sub-threshold positive** (medium) — `cageScore == 1`: one positive item;
  below the standard cut-off but warrants further inquiry into drinking patterns.
- **Incomplete assessment** (low) — any of the four items unanswered: the score
  may understate risk; complete the questionnaire.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  cutDownPoint: 0 | 1;
  annoyedPoint: 0 | 1;
  guiltyPoint: 0 | 1;
  eyeOpenerPoint: 0 | 1;
  cageScore: 0 | 1 | 2 | 3 | 4;
  resultBand: 'negative' | 'low' | 'positive';
  positiveItems: PositiveItem[];
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

- `bin/test-form cage-alcohol-questionnaire` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  each item's yes/no contribution, every total 0–4, and the `≥ 2` threshold
  boundary (score 1 vs 2).
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
bin/test-form cage-alcohol-questionnaire
```
