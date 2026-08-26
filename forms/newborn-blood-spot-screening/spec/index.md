# Newborn Blood Spot Screening — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `newborn-blood-spot-screening`

## 1. Purpose

A documentation and result-classification record for the NHS newborn blood spot
(heel-prick) screening test, normally taken at day 5 of life. It records the
sample event and its quality, eligibility and consent, and the per-condition
result for nine screened conditions. A pure engine classifies each condition
result, derives the overall screening outcome and referral status, validates
completeness and sample quality / timing, and raises flags — any `suspected`
condition triggers an urgent specialist referral. It is not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, laboratory analyser
integration, diagnostic confirmation.

## 3. Data model

A single logical screening record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Sample-taker and setting.**

| Field | Type | Notes |
| --- | --- | --- |
| `sampleTakerName` | text | person taking / recording the sample |
| `sampleTakerRole` | enum | midwife / health-visitor / neonatal-nurse / laboratory / other |
| `careSetting` | enum | community / home / neonatal-unit / hospital / other |
| `recordDate` | date | date of this record |

**Baby identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `nhsNumber` | text | baby's NHS number |
| `babyName` | text | baby's name (may be provisional) |
| `dateOfBirth` | date | date of birth (day 0) |
| `timeOfBirth` | time | time of birth |
| `sex` | enum | female / male / indeterminate / not-recorded |
| `gestationWeeks` | numeric (weeks) | gestation at birth (affects CF / preterm handling) |

**Eligibility and consent.**

| Field | Type | Notes |
| --- | --- | --- |
| `previouslyScreened` | enum | yes / no / unknown |
| `consentGiven` | enum | yes / no / partial |
| `declineReason` | text | reason where any condition declined |

**Sample event.**

| Field | Type | Notes |
| --- | --- | --- |
| `sampleDate` | date | date the heel-prick was taken |
| `sampleTime` | time | time the heel-prick was taken |
| `ageAtSampleDays` | numeric (days) | derived: `sampleDate − dateOfBirth`; stored for audit |
| `samplingSite` | enum | heel / other |
| `sampleNotes` | text | free-text sample-taker note |

**Sample quality.**

| Field | Type | Notes |
| --- | --- | --- |
| `sampleAdequacy` | enum | adequate / inadequate |
| `spotQualityIssue` | enum | none / insufficient / compressed / layered / contaminated / incomplete-circles |
| `isRepeat` | enum | yes / no |
| `repeatReason` | enum | not-applicable / borderline-result / inadequate-sample / too-early / technical / other |

**Condition results.** One result-class enum per condition; enum values
`not-suspected` / `suspected` / `carrier` / `repeat-required` / `declined` /
`pending`. `carrier` is valid for `scdResult` only.

| Field | Condition |
| --- | --- |
| `scdResult` | sickle cell disease |
| `cfResult` | cystic fibrosis |
| `chtResult` | congenital hypothyroidism |
| `pkuResult` | phenylketonuria |
| `mcaddResult` | MCADD |
| `msudResult` | maple syrup urine disease |
| `ivaResult` | isovaleric acidaemia |
| `ga1Result` | glutaric aciduria type 1 |
| `hcuResult` | homocystinuria (pyridoxine unresponsive) |

**Derived (never stored as input).** `ageAtSampleDays` (recomputed),
`conditionResults[]` (normalized per-condition classification with referral
target), `referrals[]`, `overallOutcome`, `referralStatus`, `sampleQuality`,
`flaggedIssues[]`.

## 4. Classification algorithm

Pure function `gradeBloodspot(data)`, no I/O.

**Per-condition normalization.** For each of the nine conditions, emit a
`ConditionResult { code, label, result, referralTarget }`. Validate that
`carrier` appears only for `scd`; a `carrier` value on any other condition is a
data-validity flag and is treated as `pending` for outcome purposes.

**Referrals.** For every condition whose `result == 'suspected'`, emit a
`Referral { code, service, urgency: 'urgent' }` pointing at that condition's
specialist service (see `index.md` condition table).

**Overall outcome** (first match wins, top to bottom):

```
if any result == 'suspected'                       → 'referral-required'
else if any result == 'repeat-required'            → 'repeat-required'
else if any result == 'pending'                    → 'incomplete'
else if all non-declined results are               → 'declined-only-outstanding'
        'declined' and at least one is 'declined'
else                                               → 'all-not-suspected'
        (every non-declined result is
         'not-suspected'; scd may be 'carrier')
```

**Referral status** is `urgent` when `overallOutcome == 'referral-required'`,
`repeat` when `repeat-required`, otherwise `routine`.

**Sample quality** derived object: `{ adequate: sampleAdequacy == 'adequate',
withinWindow, avoidableRepeat }` where `withinWindow = ageAtSampleDays != null
&& 5 <= ageAtSampleDays <= 8`, and `avoidableRepeat = isRepeat == 'yes' &&
repeatReason in { inadequate-sample, too-early, technical }`.

## 5. Flagged issues (red flags)

Emitted independently of the outcome, each with a priority:

- **Urgent referral** (high) — any condition `suspected`: refer to each named
  specialist service without delay; do not wait for the other results.
- **Inadequate sample** (high) — `sampleAdequacy == 'inadequate'` or
  `spotQualityIssue != 'none'`: sample cannot be reliably screened; repeat.
- **Sample out of window** (medium) — `ageAtSampleDays` outside day 5–8:
  early or late sample may affect reliability and timeliness.
- **Avoidable repeat** (medium) — repeat attributable to sampling technique or
  card fault (`avoidableRepeat`): record for quality monitoring.
- **Carrier result** (low) — `scdResult == 'carrier'`: communicate carrier
  status to the family; consider parental testing / genetic counselling.
- **Conditions declined** (low) — any condition `declined`: confirm the decline
  is documented and informed.
- **Incomplete screening** (low) — any condition `pending`, or a required result
  field left unanswered: results outstanding; follow up.
- **Invalid result class** (low) — `carrier` recorded for a non-SCD condition:
  data-validity error; correct the record.

## 6. Inputs and outputs

**Input.** A typed screening object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  ageAtSampleDays: number | null;
  conditionResults: ConditionResult[];   // 9 entries, one per condition
  referrals: Referral[];                  // one per 'suspected' condition
  overallOutcome:
    | 'all-not-suspected'
    | 'referral-required'
    | 'repeat-required'
    | 'incomplete'
    | 'declined-only-outstanding';
  referralStatus: 'routine' | 'repeat' | 'urgent';
  sampleQuality: {
    adequate: boolean;
    withinWindow: boolean;
    avoidableRepeat: boolean;
  };
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

- `bin/test-form newborn-blood-spot-screening` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering: each per-condition result class; `suspected` → `referral-required`
  precedence; the day 5–8 window boundaries (day 4 / 5 / 8 / 9); inadequate
  sample and avoidable-repeat detection; and the invalid `carrier`-on-non-SCD
  case.
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

- [`index.md`](../index.md) — form description and result-classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form newborn-blood-spot-screening
```
</content>
