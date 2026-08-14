# Partogram (Partograph) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `partogram`

## 1. Purpose

A graphical record of the progress of labour. The form records a **timed series
of intrapartum observations** and computes a **labour-progress classification**
(Normal / Alert-line crossed / Action-line crossed) plus a set of threshold
flags. Cervical dilatation is charted against an alert line (1 cm/hour from 4 cm)
and an action line four hours to its right. The output classifies progress and
prompts review; it is not a validated numeric score and not a diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema (a labour header plus a child observation-series table), the
progress / flag engine, two consolidated front-ends (`front-end-with-html`,
`front-end-with-svelte`), the Rust Loco JSON-API crate, and the generated
representations (XML, FHIR R5, protobuf, OpenAPI). Out of scope: hosted
deployment, authentication, multi-tenancy, cardiotocography interpretation,
antenatal risk scoring, and the individualized WHO Labour Care Guide reference
ranges (the classic fixed alert / action lines are used).

## 3. Data model

A labour record has one **header** and an ordered list of **observation** rows.
Fields default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Header — context, identification, admission.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | recording clinician |
| `clinicianRole` | enum | midwife / obstetrician / nurse / other |
| `careSetting` | enum | labour-ward / birth-centre / triage / other |
| `activePhaseStartAt` | timestamp | when the active phase began (dilatation 4 cm); reference time for the lines |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `parity` | enum | nulliparous / multiparous |
| `gestationWeeks` | numeric | completed weeks of gestation |
| `membranesOnAdmission` | enum | intact / ruptured |
| `riskFactors` | text | noted risk factors |
| `plannedCare` | text | planned care / management |

**Observation — one timed row per assessment (child table).**

| Field | Type | Notes |
| --- | --- | --- |
| `observedAt` | timestamp | wall-clock time of the observation |
| `cervicalDilatationCm` | numeric (0–10) | plotted against the lines |
| `descentFifths` | numeric (0–5) | fifths of head palpable above the brim |
| `contractionsPer10Min` | numeric | frequency in 10 minutes |
| `contractionDurationBand` | enum | `<20s` / `20-40s` / `>40s` |
| `contractionStrength` | enum | mild / moderate / strong |
| `fetalHeartRate` | numeric (bpm) | fetal heart rate |
| `liquorState` | enum | intact / clear / meconium / blood-stained / absent |
| `moulding` | enum | `0` / `+` / `++` / `+++` |
| `systolicBloodPressure` | numeric (mmHg) | maternal |
| `diastolicBloodPressure` | numeric (mmHg) | maternal |
| `pulse` | numeric (bpm) | maternal |
| `temperature` | numeric (°C) | maternal |
| `urineVolumeMl` | numeric (mL) | passed urine volume |
| `urineProtein` | enum | negative / trace / `+` / `++` / `+++` |
| `urineKetones` | enum | negative / trace / `+` / `++` / `+++` |
| `urineGlucose` | enum | negative / trace / `+` / `++` / `+++` |
| `oxytocinRate` | numeric | oxytocin infusion (drops/min or mU/min) |
| `drugsAndFluids` | text | other drugs and IV fluids |

**Derived (never stored as input).** `activePhaseStartAt` echo, `latestDilatationCm`,
`elapsedHours`, `alertLineExpectedCm`, `actionLineExpectedCm`,
`progressClassification`, `firedLines[]`, `flaggedIssues[]`.

## 4. Progress algorithm

Pure function, no I/O. Let the latest observation carrying a non-null
`cervicalDilatationCm` be *D* at time *T*, and let *t* be the elapsed hours from
`activePhaseStartAt` to *T* (`t = (T − activePhaseStartAt) / 3600`, clamped at
`>= 0`):

```
alertLineExpectedCm  = 4 + t
actionLineExpectedCm = t                     // 4 + (t - 4)

progressClassification =
    D >= alertLineExpectedCm  ? 'normal'
  : D >  actionLineExpectedCm ? 'alertLineCrossed'
  :                             'actionLineCrossed'
```

- A point is "right of" a line when its dilatation is **less** than the line's
  expected dilatation for the elapsed time.
- With no dilatation observation, or a null `activePhaseStartAt`, the
  classification is `normal` and an incomplete-observation flag is raised; the
  line-expected values are `null`.
- `firedLines` lists the reference lines the latest point has crossed
  (`alert`, `action`), used by the front-ends for the plotted markers.

## 5. Flagged issues (red flags)

Emitted independently of the classification, each scanned across the **whole**
observation series, each with a priority:

- **Action line crossed** (high) — latest `D <= t`.
- **Fetal heart rate abnormal** (high) — any `fetalHeartRate < 110` or `> 160`.
- **Meconium-stained liquor** (high) — any `liquorState == 'meconium'`.
- **Maternal fever** (high) — any `temperature >= 37.5`.
- **Maternal hypertension** (high) — any `systolicBloodPressure >= 140` or
  `diastolicBloodPressure >= 90`.
- **Alert line crossed** (medium) — `t < D < 4 + t`.
- **Poor progress / prolonged labour** (medium) — no increase in dilatation
  across `>= 4 h` of active labour.
- **Maternal tachycardia** (medium) — any `pulse >= 120`.
- **Maternal hypotension** (medium) — any `systolicBloodPressure < 90`.
- **Ketonuria** (low) — any `urineKetones` not `negative`/`''`.
- **Proteinuria** (low) — any `urineProtein` not `negative`/`''`.
- **Incomplete observation** (low) — a plotted row missing dilatation or time.

## 6. Inputs and outputs

**Input.** A typed labour record whose shape mirrors the SQL schema in `sql/`: a
header object plus `observations[]`. Unanswered text/enum fields default to `''`;
unanswered numeric, date, and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  activePhaseStartAt: string | null;
  latestDilatationCm: number | null;
  elapsedHours: number | null;
  alertLineExpectedCm: number | null;
  actionLineExpectedCm: number | null;
  progressClassification: 'normal' | 'alertLineCrossed' | 'actionLineCrossed';
  firedLines: FiredLine[];
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

- `bin/test-form partogram` exits cleanly.
- The progress / flag engine is pure (no side effects, no I/O) and unit-tested,
  covering the alert / action line boundaries (on / just-left / just-right),
  FHR 110/160 and maternal-vital thresholds, poor-progress detection, and the
  no-observation case.
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

- [`index.md`](../index.md) — form description and progress details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form partogram
```
