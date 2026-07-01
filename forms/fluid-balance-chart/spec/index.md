# Fluid Balance Chart — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `fluid-balance-chart`

## 1. Purpose

A bedside record of a patient's fluid intake and output over a charting period
(typically 24 hours). It captures timed intake volumes (oral, IV, enteral,
blood/products, other) and output volumes (urine, drains, vomit/NG, stool,
insensible/other), and computes a running and cumulative **net balance**. The
engine is not a validated named score: it arithmetically reconciles the recorded
volumes and grades the resulting **fluid status** as one of
**Balanced / Positive / Negative / Oliguria**, reports the numeric net balance
and the urine output rate in mL/kg/h, and raises safety flags. The output
prompts review, not treatment.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, computation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, fluid-prescription
calculation, and paediatric weight-band thresholds.

## 3. Data model

A **chart** header record with a collection of timed **entry** line items
(one row per recorded volume). Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Chart header.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | charting clinician |
| `clinicianRole` | enum | nurse / doctor / healthcare-assistant / other |
| `patientIdentifier` | text | local identifier |
| `wardOrUnit` | text | ward or unit name |
| `chartStartAt` | timestamp | chart period start date and time |
| `chartPeriodHours` | numeric (h) | charting period; default 24 |
| `weightKg` | numeric (kg) | patient weight; enables mL/kg/h |
| `clinicalNote` | text | free-text summary note |

**Entry line item** (`fluid_balance_entry`, many per chart).

| Field | Type | Notes |
| --- | --- | --- |
| `chartId` | uuid | foreign key to the chart header |
| `entryAt` | timestamp | time the volume was recorded |
| `direction` | enum | `intake` / `output` |
| `category` | enum | intake: `oral` / `iv` / `enteral` / `blood-products` / `other-intake`; output: `urine` / `drains` / `vomit-ng` / `stool` / `insensible-other` |
| `description` | text | optional route or free-text description |
| `volumeMl` | numeric (mL) | recorded volume |

**Derived (never stored as input).** `totalIntakeMl`, `totalOutputMl`,
`netBalanceMl`, `intakeByCategory{}`, `outputByCategory{}`, `runningBalance[]`,
`urineOutputMl`, `hoursObserved`, `urineOutputRateMlPerKgPerHour`, `fluidStatus`,
`flaggedIssues[]`.

## 4. Computation algorithm

Pure function, no I/O. Given the entries and header:

```
totalIntakeMl = Σ e.volumeMl where e.direction == 'intake'   and volumeMl != null
totalOutputMl = Σ e.volumeMl where e.direction == 'output'   and volumeMl != null
netBalanceMl  = totalIntakeMl − totalOutputMl                 // positive = net gain

intakeByCategory[c] = Σ intake volumes with category c
outputByCategory[c] = Σ output volumes with category c

// running balance: entries sorted ascending by entryAt, intake +, output −
runningBalance = scan(sortedEntries, acc + (intake ? +v : −v))   // last value == netBalanceMl

urineOutputMl              = outputByCategory['urine']
hoursObserved              = chartPeriodHours   (fallback: span(entryAt) in hours, when period null)
urineOutputRateMlPerKgPerH = (weightKg != null && weightKg > 0 && hoursObserved > 0)
                             ? urineOutputMl / weightKg / hoursObserved
                             : null
```

**Threshold scaling.** The significant-balance thresholds default to ±1000 mL
per 24 h and are scaled to the charting period:

```
scale                     = hoursObserved / 24
positiveThresholdMl       = 1000 * scale
negativeThresholdMl       = 1000 * scale
```

**Fluid-status classification** (single value, first match wins):

```
if urineOutputRateMlPerKgPerH != null
   && hoursObserved >= 6
   && urineOutputRateMlPerKgPerH < 0.5     -> 'oliguria'
else if netBalanceMl >=  positiveThresholdMl -> 'positive'
else if netBalanceMl <= -negativeThresholdMl -> 'negative'
else                                          -> 'balanced'
```

- Oliguria takes precedence because low urine output is the highest-priority
  monitoring signal, independent of the net balance sign.
- A missing `volumeMl` contributes nothing (treated as absent, not zero-valued),
  and raises a data-completeness flag.

## 5. Flagged issues (safety flags)

Emitted independently of the classification, each with a priority:

- **Fluid-overload risk** (high) — `netBalanceMl >= positiveThresholdMl`:
  significant positive balance; review for pulmonary / peripheral oedema.
- **Dehydration / hypovolaemia** (high) — `netBalanceMl <= -negativeThresholdMl`:
  significant negative balance; review perfusion and replacement.
- **Oliguria** (high) — `urineOutputRateMlPerKgPerH < 0.5` over `hoursObserved
  >= 6`: canonical low-urine-output threshold (KDIGO).
- **Anuria** (high) — `urineOutputRateMlPerKgPerH < 0.05`, or `urineOutputMl <
  100` over `hoursObserved >= 12`: effectively no urine output; urgent review.
- **Incomplete recording** (low / medium) — `weightKg` missing (mL/kg/h cannot
  be computed, medium), no entries recorded (medium), any `volumeMl` missing, or
  a charting gap longer than the expected interval (low); the balance may be
  unreliable.

## 6. Inputs and outputs

**Input.** A typed chart object with an array of entry objects, whose shape
mirrors the SQL schema in `sql/`. Unanswered text/enum fields default to `''`;
unanswered numeric, date, and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  totalIntakeMl: number;
  totalOutputMl: number;
  netBalanceMl: number;                       // intake − output
  intakeByCategory: Record<string, number>;
  outputByCategory: Record<string, number>;
  runningBalance: { entryAt: string; balanceMl: number }[];
  urineOutputMl: number;
  hoursObserved: number;
  weightKg: number | null;
  urineOutputRateMlPerKgPerHour: number | null;
  fluidStatus: 'balanced' | 'positive' | 'negative' | 'oliguria';
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

- `bin/test-form fluid-balance-chart` exits cleanly.
- The computation engine is pure (no side effects, no I/O) and unit-tested,
  covering: net balance sign, per-category subtotals, running-balance ordering,
  the mL/kg/h calculation, the oliguria boundary (0.49 vs 0.5 mL/kg/h), the
  anuria boundary, period scaling, and every classification outcome.
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

- [`index.md`](../index.md) — form description and computation details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form fluid-balance-chart
```
</content>
