# Anaesthetic Record — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `anaesthetic-record`

## 1. Purpose

The intra-operative anaesthesia chart: the contemporaneous clinical record of an
anaesthetic. It documents pre-induction checks, ASA and airway assessment, drugs
and doses, airway management, monitoring, timed physiological observations,
fluids and blood loss, regional / neuraxial technique, events and complications,
and recovery handover. Its engine grades **completeness and validity** (not a
numeric severity score) and raises **safety flags**.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the completeness / validation engine, two consolidated
front-ends (`front-end-with-html`, `front-end-with-svelte`), the Rust Loco
JSON-API crate, and the generated representations (XML, FHIR R5, protobuf,
OpenAPI). Out of scope: hosted deployment, authentication, multi-tenancy,
automated device / monitor data capture, closed-loop drug delivery, and
pre-operative or post-operative documentation (separate forms).

## 3. Data model

One logical anaesthetic record (parent) with repeating child rows for **drug
administrations**, **timed observations**, and **intra-operative events**. Fields
default to `''` (text/enum) or `null` (numeric/date/time) when unanswered.

**Case identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | local identifier |
| `patientName` | text | patient name |
| `dateOfBirth` | date | patient DOB |
| `sex` | enum | patient sex |
| `weightKg` | numeric | body weight (kg) |
| `heightCm` | numeric | height (cm) |
| `theatre` | text | theatre / location |
| `operationDate` | date | date of anaesthetic |
| `anaesthetistName` | text | responsible anaesthetist |
| `assistantName` | text | ODP / anaesthetic assistant |
| `surgeonName` | text | operating surgeon |
| `plannedProcedure` | text | planned operation |
| `urgency` | enum | elective / urgent / emergency / immediate |

**Pre-induction checks.**

| Field | Type | Notes |
| --- | --- | --- |
| `machineChecked` | enum (yes/no) | anaesthetic machine check performed |
| `whoSignIn` | enum (yes/no) | WHO Sign In performed |
| `whoTimeOut` | enum (yes/no) | WHO Time Out performed |
| `consentConfirmed` | enum (yes/no) | consent confirmed |
| `fastingConfirmed` | enum (yes/no) | fasting confirmed |
| `ivAccess` | text | IV access sites |
| `allergyBandChecked` | enum (yes/no) | allergy band checked |
| `documentedAllergies` | text | documented allergies (for conflict check) |

**ASA & airway assessment.**

| Field | Type | Notes |
| --- | --- | --- |
| `asaStatus` | enum | I / II / III / IV / V / VI |
| `asaEmergencyModifier` | enum (yes/no) | ASA `E` modifier |
| `mallampatiClass` | numeric (1–4) | Mallampati class |
| `mouthOpeningCm` | numeric | inter-incisor gap |
| `thyromentalDistanceCm` | numeric | thyromental distance |
| `dentition` | text | dentition / loose teeth |
| `anticipatedDifficultAirway` | enum (yes/no) | anticipated difficult airway |
| `priorDifficultIntubation` | enum (yes/no) | prior difficult intubation |

**Airway management.**

| Field | Type | Notes |
| --- | --- | --- |
| `airwayTechnique` | enum | facemask / supraglottic / tracheal-tube / tracheostomy / awake-FOI |
| `deviceSize` | text | device / tube size |
| `tubeDepthCm` | numeric | tube depth at teeth |
| `cuffed` | enum (yes/no) | cuffed device |
| `cormackLehaneGrade` | numeric (1–4) | grade of laryngoscopic view |
| `intubationAttempts` | numeric | number of attempts |
| `capnographyConfirmed` | enum (yes/no) | placement confirmed by capnography |

**Monitoring.** `monitoringModalities` — multi-select enum set (ECG, NIBP,
arterial-line, SpO₂, capnography, temperature, neuromuscular, depth-of-
anaesthesia, CVP, urine-output).

**Anaesthetic technique.** `anaestheticTechnique` — enum (general / regional /
sedation / MAC / combined).

**Fluids & blood loss.**

| Field | Type | Notes |
| --- | --- | --- |
| `crystalloidMl` | numeric | crystalloid volume |
| `colloidMl` | numeric | colloid volume |
| `bloodProductsMl` | numeric | blood products volume |
| `estimatedBloodLossMl` | numeric | estimated blood loss |
| `urineOutputMl` | numeric | urine output |
| `cellSalvageMl` | numeric | cell-salvage returned |

**Regional / neuraxial.**

| Field | Type | Notes |
| --- | --- | --- |
| `regionalTechnique` | enum | none / spinal / epidural / CSE / peripheral-block |
| `regionalLevel` | text | interspace / target |
| `regionalDrug` | text | agent |
| `regionalDoseMg` | numeric | dose |
| `blockHeight` | text | achieved block height / effect |
| `regionalComplications` | text | complications |

**Recovery handover.**

| Field | Type | Notes |
| --- | --- | --- |
| `recoveryDestination` | enum | recovery / HDU / ICU / ward |
| `handoverAirwayStatus` | text | airway status at handover |
| `analgesiaPlan` | text | analgesia plan |
| `antiemeticPlan` | text | antiemetic plan |
| `oxygenPlan` | text | oxygen plan |
| `outstandingTasks` | text | outstanding tasks |
| `handoverAt` | timestamp | handover time |
| `receivingPractitioner` | text | receiving practitioner |

**Sign-off.** `anaesthetistSignature` (text), `signedAt` (timestamp).

**Drug administration (child rows).** `drugName` (text), `dose` (numeric),
`doseUnit` (enum), `route` (enum), `category` (enum: induction / neuromuscular-
blocker / maintenance / reversal / analgesia / antiemetic / antibiotic /
vasoactive), `administeredAt` (timestamp).

**Timed observation (child rows).** `observedAt` (timestamp),
`systolicBloodPressure` (numeric), `diastolicBloodPressure` (numeric),
`heartRate` (numeric), `spo2` (numeric), `endTidalCo2` (numeric),
`temperature` (numeric), `agentPercent` (numeric), `freshGasFlowL` (numeric).

**Intra-operative event (child rows).** `eventType` (enum: desaturation /
hypotension / arrhythmia / laryngospasm / bronchospasm / anaphylaxis /
difficult-airway / awareness / other), `occurredAt` (timestamp),
`management` (text).

**Derived (never stored as input).** `status`, `completenessPercent`,
`firedRules[]`, `flags[]`.

## 4. Completeness / validation algorithm

Pure function, no I/O. The engine evaluates a fixed set of **mandatory-item
rules**, each tagged `critical` or `noncritical`, then classifies status:

```
satisfied      = count(mandatory rules whose item is present and valid)
total          = count(mandatory rules)
completenessPercent = round(100 * satisfied / total)

anyCriticalMissing    = some critical rule unsatisfied
anyNoncriticalMissing = some non-critical rule unsatisfied

status =
  anyCriticalMissing    ? 'incomplete'
  : anyNoncriticalMissing ? 'partial'
  : 'complete'
```

**Critical mandatory items** (missing → `incomplete`): `patientIdentifier`,
`anaesthetistName`, `asaStatus`, `anaestheticTechnique`, `airwayTechnique`,
WHO checklist status (`whoSignIn` and `whoTimeOut`), at least one timed
observation row, and `anaesthetistSignature`.

**Non-critical mandatory items** (missing → `partial`): `weightKg`,
`monitoringModalities` (non-empty), a fluids summary (`estimatedBloodLossMl` or
any fluid volume present), and `recoveryDestination`.

`firedRules[]` lists every mandatory rule with its satisfied / unsatisfied state,
criticality, and a human-readable label, so the UI can show exactly what is
missing.

## 5. Flagged issues (safety flags)

Emitted independently of completeness status, each with a priority:

- **WHO checklist not done** (high) — `whoSignIn != 'yes'` or
  `whoTimeOut != 'yes'`.
- **Allergy conflict** (high) — a `drugName` in the drug rows matches a term in
  `documentedAllergies` (case-insensitive substring match).
- **Difficult airway** (high) — `anticipatedDifficultAirway == 'yes'`, or
  `cormackLehaneGrade >= 3`, or `intubationAttempts >= 3`.
- **Drug / anaphylaxis event** (high) — an event row with `eventType` of
  `anaphylaxis` (or a drug-reaction event) is present.
- **Unlogged consent** (high) — `consentConfirmed != 'yes'`.
- **Physiological derangement** (medium) — any timed observation breaches a
  configured limit (e.g. `spo2 < 92`, sustained low `systolicBloodPressure`).
- **Incomplete assessment** (low) — one or more non-critical mandatory items
  missing (mirrors `status == 'partial'`).

## 6. Inputs and outputs

**Input.** A typed record object whose shape mirrors the SQL schema in `sql/`,
including the drug, observation, and event child arrays. Unanswered text/enum
fields default to `''`; unanswered numeric, date, and time fields default to
`null`.

**Output.** A validation object emitted by the engine:

```ts
validate(record: AnaestheticRecord): {
  status: 'complete' | 'partial' | 'incomplete';
  completenessPercent: number;   // 0..100
  firedRules: FiredRule[];       // mandatory-item rule results
  flags: Flag[];                 // safety flags, each with a priority
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

- `bin/test-form anaesthetic-record` exits cleanly.
- The validation engine is pure (no side effects, no I/O) and unit-tested,
  covering: each status class (Complete / Partial / Incomplete), each mandatory
  rule's satisfied / unsatisfied path, and every safety flag firing and not
  firing.
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

- [`index.md`](../index.md) — form description and completeness / safety model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form anaesthetic-record
```
