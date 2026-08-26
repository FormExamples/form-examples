# Newborn Blood Spot Screening — Agent Instructions

Documentation and result-classification record for the NHS newborn blood spot
(heel-prick) screening test, normally taken at day 5 of life. Collected via a
single continuous single-page wizard: the sample event and its quality,
eligibility and consent, and a per-condition result for nine conditions
(SCD, CF, CHT, PKU, MCADD, MSUD, IVA, GA1, HCU). A pure engine classifies each
condition result, derives the overall outcome and referral status, validates
completeness and sample quality / timing, and raises flags — any `suspected`
condition triggers an **urgent** specialist referral.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS NBS programme handbook)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `BloodspotScreening` TypeScript type — the sample-taker,
  identification, consent, sample-event, sample-quality, and nine
  condition-result fields.
- **Output shape:**
  ```ts
  gradeBloodspot(data: BloodspotScreening): {
    ageAtSampleDays: number | null;
    conditionResults: ConditionResult[];   // 9 entries
    referrals: Referral[];                  // one per 'suspected' condition
    overallOutcome:
      | 'all-not-suspected'
      | 'referral-required'
      | 'repeat-required'
      | 'incomplete'
      | 'declined-only-outstanding';
    referralStatus: 'routine' | 'repeat' | 'urgent';
    sampleQuality: { adequate: boolean; withinWindow: boolean; avoidableRepeat: boolean };
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** classification, not scoring. Normalize each condition to a
  `ConditionResult` (result class + specialist referral target); emit a
  `Referral` for every `suspected` condition; derive `overallOutcome` by
  precedence (`suspected` → `referral-required` wins over `repeat-required` →
  `incomplete` → `declined-only-outstanding` → `all-not-suspected`). Derive
  `sampleQuality` from adequacy, the day 5–8 window on `ageAtSampleDays`, and
  the repeat reason. See spec §4. `carrier` is valid for `scd` only.
- **Engine files:** `types.ts`, `utils.ts`, `bloodspot-rules.ts`,
  `bloodspot-grader.ts`, `flagged-issues.ts`.
- **Tests:** `bloodspot-grader.test.ts`, `bloodspot-rules.test.ts` — cover each
  result class, `suspected` referral precedence, the day 5-8 window boundaries
  (day 4/5/8/9), inadequate-sample and avoidable-repeat detection, and the
  invalid `carrier`-on-non-SCD case.

## Flagged issues

Computed independently of the outcome (see spec §5): urgent referral (any
`suspected`, high), inadequate sample (`sampleAdequacy == 'inadequate'` or a
spot-quality issue, high), sample out of window (`ageAtSampleDays` outside day
5–8, medium), avoidable repeat (medium), carrier result (SCD carrier, low),
conditions declined (low), incomplete screening (any `pending` / missing result,
low), invalid result class (`carrier` on a non-SCD condition, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.
- British English throughout (paediatric, haemoglobinopathy, isovaleric
  acidaemia).

## Clinical grounding

- NHS Newborn Blood Spot Screening Programme — programme handbook and standards
  (UK National Screening Committee).
- NHS *Screening tests for you and your baby* — parent information.
- UK National Screening Committee — recommended newborn screening conditions.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form newborn-blood-spot-screening
```
</content>
