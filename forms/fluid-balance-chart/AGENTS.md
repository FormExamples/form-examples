# Fluid Balance Chart — Agent Instructions

A bedside record of a patient's fluid intake and output over a charting period
(typically 24 hours), captured via a single continuous single-page wizard.
Records timed intake volumes (oral, IV, enteral, blood/products, other) and
output volumes (urine, drains, vomit/NG, stool, insensible/other), then computes
a running and cumulative **net balance**, the urine output rate in **mL/kg/h**,
and a **fluid-status classification** (Balanced / Positive / Negative /
Oliguria). It is a monitoring aid, not a validated named score or a treatment
decision.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE CG174, KDIGO AKI)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Computation engine

- **Input shape:** `FluidBalanceChart` TypeScript type — the chart header
  (context, weight, charting period) plus an array of `FluidBalanceEntry`
  line items (timed intake/output volumes).
- **Output shape:**
  ```ts
  gradeFluidBalance(data: FluidBalanceChart): {
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
- **Algorithm:** sum intake and output volumes; `netBalanceMl = totalIntakeMl −
  totalOutputMl`; a running balance accumulates intake as positive and output as
  negative over time-sorted entries. The urine output rate is
  `urineOutputMl / weightKg / hoursObserved` when weight and hours are known.
  Classification is precedence-ordered — **oliguria** (urine rate < 0.5 mL/kg/h
  over ≥ 6 h) first, then **positive** (net ≥ +threshold), then **negative**
  (net ≤ −threshold), else **balanced**. Thresholds default to ±1000 mL per 24 h
  and scale to the charting period. See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `balance-rules.ts`,
  `balance-grader.ts`, `flagged-issues.ts`.
- **Tests:** `balance-grader.test.ts`, `balance-rules.test.ts` — cover the net
  balance sign, per-category subtotals, running-balance ordering, the mL/kg/h
  calculation, the oliguria boundary (0.49 vs 0.5), the anuria boundary, period
  scaling, and each classification outcome.

## Flagged issues

Computed independently of the classification (see spec §5): fluid-overload risk
(`netBalanceMl >= +threshold`, high), dehydration / hypovolaemia
(`netBalanceMl <= −threshold`, high), oliguria (`urine rate < 0.5 mL/kg/h` over
≥ 6 h, high), anuria (`urine rate < 0.05 mL/kg/h`, or urine < 100 mL over ≥ 12 h,
high), incomplete recording (missing weight, no entries, missing volume, or a
charting gap; low/medium).

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

- NICE CG174. *Intravenous fluid therapy in adults in hospital* (2013, updated
  2017).
- KDIGO. *Clinical Practice Guideline for Acute Kidney Injury* (2012) — oliguria
  = urine output < 0.5 mL/kg/h.
- Royal College of Physicians. *NEWS2* (2017).
- NCEPOD. *An Acute Problem?* (2005).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form fluid-balance-chart
```
</content>
