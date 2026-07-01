# Bhutani Bilirubin Nomogram — Agent Instructions

Predictive risk-stratification tool for neonatal hyperbilirubinaemia. Collects a
newborn's total serum bilirubin (TSB) and age in hours via a single continuous
single-page wizard, plots the point on the hour-specific Bhutani nomogram to
assign a **percentile risk zone** (low, low-intermediate, high-intermediate,
high), and compares the same point with the age- and gestation-specific
**phototherapy** and **exchange-transfusion** treatment-threshold graphs. It is a
**classification**, not an additive score.

See [`index.md`](./index.md) for the full design and the risk-zone model, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Bhutani 1999, NICE CG98)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `BhutaniAssessment` TypeScript type — the measurement inputs
  (`ageHours`, `totalSerumBilirubin`, `measurementMethod`), gestational age, the
  risk-factor flags, and context / identification fields.
- **Output shape:**
  ```ts
  gradeBhutani(data: BhutaniAssessment): {
    ageHours: number | null;
    riskZone: 'low' | 'low-intermediate' | 'high-intermediate' | 'high' | null;
    percentileBand: '<40' | '40-75' | '75-95' | '>=95' | null;
    phototherapyThreshold: number | null;
    exchangeThreshold: number | null;
    abovePhototherapy: boolean;
    aboveExchange: boolean;
    firedRiskFactors: FiredRiskFactor[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** two independent lookups (see spec §4). (a) Interpolate the
  40th/75th/95th percentile TSB tracks at `ageHours` and band the measured TSB
  into a zone. (b) Select the phototherapy and exchange curves for the infant's
  gestational band, interpolate at `ageHours`, and set `abovePhototherapy` /
  `aboveExchange`. `ageHours` is clamped to the nomogram domain (~0–168 h);
  out-of-range or missing inputs yield a `null` zone and a data flag rather than
  extrapolation.
- **Engine files:** `types.ts`, `utils.ts`, `bhutani-rules.ts` (the tabulated
  percentile and threshold curves + interpolation), `bhutani-grader.ts` (the
  `gradeBhutani` classifier), `flagged-issues.ts`.
- **Tests:** `bhutani-grader.test.ts`, `bhutani-rules.test.ts` — cover each zone
  boundary (below/at p40, p75, p95), each threshold boundary (just below / at the
  phototherapy and exchange lines), gestation-curve selection, out-of-range age,
  and missing inputs.

## Flagged issues

Computed independently of the zone (see spec §5): above exchange threshold
(`aboveExchange`, high/urgent), above phototherapy threshold
(`abovePhototherapy`, high), high-risk zone (`riskZone == 'high'`, high), rapid
rise (high, when a prior TSB is available), early jaundice (`onsetUnder24Hours`,
high), risk factors present (any risk-factor flag, medium), high-intermediate
zone (medium), out-of-range age (low), incomplete assessment (missing `ageHours`
or `totalSerumBilirubin`, low).

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
- Bilirubin recorded in **µmol/L** (SI units, UK convention).
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Bhutani V.K., Johnson L., Sivieri E.M. Predictive ability of a predischarge
  hour-specific serum bilirubin. *Pediatrics* 1999; 103(1):6–14.
- NICE CG98. *Jaundice in newborn babies under 28 days* (treatment-threshold
  graphs by gestational age).
- American Academy of Pediatrics. *Management of Hyperbilirubinemia in the
  Newborn Infant 35 or More Weeks of Gestation* (2022).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form bhutani-bilirubin-nomogram
```
