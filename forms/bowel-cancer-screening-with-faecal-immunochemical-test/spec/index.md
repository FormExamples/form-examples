# Bowel Cancer Screening with Faecal Immunochemical Test (FIT) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `bowel-cancer-screening-with-faecal-immunochemical-test`

## 1. Purpose

A documentation and result-classification form for the NHS Bowel Cancer
Screening Programme. It records a home FIT kit outcome — eligibility, kit return
and adequacy, and the measured faecal haemoglobin concentration in µg Hb/g — and
classifies the result against the programme threshold, setting a management
action. It documents and classifies a screening result; it is not a diagnostic
test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, colonoscopy reporting,
and laboratory assay control.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician / administrator |
| `clinicianRole` | enum | screening-administrator / screening-practitioner / gp / ssp / other |
| `reviewedAt` | timestamp | date the result was reviewed |
| `screeningHub` | text | hub / centre name |
| `participantIdentifier` | text | local identifier |
| `nhsNumber` | text | NHS number |
| `participantAge` | numeric (years) | participant age |
| `sex` | enum | participant sex |

**Eligibility and invitation.**

| Field | Type | Notes |
| --- | --- | --- |
| `withinAgeRange` | enum | eligible / over-age-self-request / not-eligible |
| `recallInterval` | enum | two-yearly / other |
| `invitationDate` | date | kit issued date |
| `previousOutcome` | enum | first-invitation / prior-negative / prior-positive / unknown |

**Kit return and adequacy.**

| Field | Type | Notes |
| --- | --- | --- |
| `kitReturned` | enum | yes / no |
| `returnDate` | date | sample received date |
| `sampleAdequacy` | enum | adequate / spoilt / insufficient / expired |
| `spoiltReason` | enum | leaked / undated / unlabelled / too-old / damaged / '' |

**FIT result.**

| Field | Type | Notes |
| --- | --- | --- |
| `faecalHaemoglobin` | numeric (µg Hb/g) | measured concentration |
| `assay` | text | analyser / assay identifier |
| `thresholdApplied` | numeric (µg Hb/g) | programme threshold, default **120** |

**Symptoms.**

| Field | Type | Notes |
| --- | --- | --- |
| `redFlagSymptoms` | enum | yes / no |
| `clinicalNote` | text | free-text note |

**Derived (never stored as input).** `resultClass`, `managementAction`,
`symptomaticPathway`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Priority order (first match wins for `resultClass` /
`managementAction`):

```
if kitReturned == 'no':
    resultClass      = ''            // no sample to classify
    managementAction = 'repeat-kit' // send reminder / reissue kit
elif sampleAdequacy in ('spoilt', 'insufficient', 'expired'):
    resultClass      = 'spoilt'
    managementAction = 'repeat-kit'
elif faecalHaemoglobin != null && faecalHaemoglobin >= thresholdApplied:
    resultClass      = 'positive'
    managementAction = 'refer-colonoscopy'
elif faecalHaemoglobin != null && faecalHaemoglobin < thresholdApplied:
    resultClass      = 'negative'
    managementAction = 'routine-recall'
else:                                // returned & adequate but no numeric result
    resultClass      = ''
    managementAction = 'repeat-kit'  // incomplete; raise completeness flag

// Independent of the numeric result:
symptomaticPathway = redFlagSymptoms == 'yes'   // urgent suspected-cancer referral
```

- `thresholdApplied` defaults to **120 µg Hb/g** (screening). Configuring it to
  **10 µg Hb/g** yields the NICE DG56 symptomatic behaviour with the same engine.
- A missing `faecalHaemoglobin` on a returned, adequate kit is treated as
  incomplete (not negative) and raises a data-completeness flag.
- `symptomaticPathway` is orthogonal to `resultClass`: a symptomatic participant
  is referred urgently even when FIT is `negative`.

## 5. Flagged issues (red flags)

Emitted independently of the result class, each with a priority:

- **Positive screen** (high) — `resultClass == 'positive'`: faecal Hb at or above
  threshold; refer for colonoscopy.
- **Symptomatic — suspected cancer** (high) — `redFlagSymptoms == 'yes'`: route to
  the urgent suspected-cancer pathway regardless of the FIT result; a negative
  screen does not exclude cancer.
- **Kit not returned / overdue** (medium) — `kitReturned == 'no'`: no sample;
  send reminder and reissue.
- **Spoilt / inadequate kit** (medium) — `sampleAdequacy != 'adequate'`: repeat
  kit required.
- **Incomplete result** (low) — kit returned and adequate but
  `faecalHaemoglobin` missing: cannot classify; obtain the assay value.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  resultClass: '' | 'negative' | 'positive' | 'spoilt';
  managementAction: 'routine-recall' | 'refer-colonoscopy' | 'repeat-kit';
  symptomaticPathway: boolean;
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

- `bin/test-form bowel-cancer-screening-with-faecal-immunochemical-test` exits
  cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering the threshold boundary (119 / 120 / 121 µg Hb/g), each result class
  (negative / positive / spoilt), non-return, and the symptomatic-pathway
  override on a negative result.
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

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form bowel-cancer-screening-with-faecal-immunochemical-test
```
