# Parkland Formula for Burns — Agent Instructions

A fluid-resuscitation calculator for major thermal burns. Collects body weight,
%TBSA burned, and the time of injury via a single continuous single-page wizard,
then computes the first-24-hour crystalloid volume by the Parkland formula
(`4 mL × weightKg × %TBSA`), splits it 50/50 into the first-8-hour and
next-16-hour phases measured **from the time of injury**, derives an infusion
rate for each phase (offsetting for elapsed time), and reports a urine-output
titration target of 0.5–1.0 mL/kg/h (adults).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Parkland/Baxter, ABLS, Rule of Nines)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `ParklandAssessment` TypeScript type — the calculation inputs
  (`weightKg`, `tbsaPercent`, `tbsaMethod`, `injuryAt`, `injuryTimeKnown`), the
  injury-feature flags, plus context and identification fields.
- **Output shape:**
  ```ts
  calculateParkland(data: ParklandAssessment): {
    total24hVolumeMl: number | null;
    first8hVolumeMl: number | null;
    next16hVolumeMl: number | null;
    hoursSinceInjury: number | null;
    remainingFirst8hHours: number;
    first8hRateMlPerHour: number | null;
    next16hRateMlPerHour: number | null;
    targetUrineOutputLowMlPerHour: number | null;
    targetUrineOutputHighMlPerHour: number | null;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** `total24hVolumeMl = 4 × weightKg × tbsaPercent`; each phase is
  half the total; `remainingFirst8hHours = max(8 − hoursSinceInjury, 0)` from the
  **time of injury**; `first8hRateMlPerHour = first8hVolumeMl / remainingFirst8hHours`
  (null when overdue); `next16hRateMlPerHour = next16hVolumeMl / 16`; urine-output
  band is `0.5×weight … 1.0×weight` mL/h. See spec §4. Missing weight or %TBSA
  yields `null` volumes and a data-completeness flag; no partial arithmetic.
- **Engine files:** `types.ts`, `utils.ts`, `parkland-rules.ts`,
  `parkland-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `parkland-calculator.test.ts`, `parkland-rules.test.ts` — cover the
  base formula, the 50/50 split, the time-offset (0 h / mid-window / exactly 8 h
  / overdue > 8 h), both phase rates, the urine-output band, and every flag.

## Flagged issues

Computed independently of the arithmetic (see spec §5): major-burn referral
(`tbsaPercent ≥ 15` adult / `≥ 10` child, high), inhalation / airway risk
(`inhalationSuspected == 'yes'`, high), escharotomy risk
(`circumferentialOrDeep == 'yes'`, high), resuscitation overdue
(`hoursSinceInjury > 8`, high), titrate-to-urine-output (always, medium),
special mechanism (electrical / chemical, medium), incomplete assessment
(weight, %TBSA, or time of injury missing, low).

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

## Clinical grounding

- Baxter C.R., Shires T. Physiological response to crystalloid resuscitation of
  severe burns. *Ann N Y Acad Sci* 1968; 150(3):874–894.
- Wallace A.B. The exposure treatment of burns (Rule of Nines). *Lancet* 1951.
- Lund C.C., Browder N.C. The estimation of areas of burns. *Surg Gynecol
  Obstet* 1944.
- American Burn Association. *Advanced Burn Life Support (ABLS) Provider Manual.*
- National Network for Burn Care (UK). *National Burn Care Referral Guidance.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form parkland-formula-for-burns
```
