# Recognition Of Stroke In the Emergency Room (ROSIER) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `recognition-of-stroke-in-the-emergency-room`

## 1. Purpose

A bedside stroke-recognition screen for adults presenting acutely to the
emergency department. It records two mimic-exclusion criteria (loss of
consciousness / syncope, seizure activity) scoring −1 each and five acute-onset
neurological signs (asymmetric facial / arm / leg weakness, speech disturbance,
visual field defect) scoring +1 each, and produces a signed total of **−2 to
+5**. A total **> 0** is a positive screen (**stroke likely**) that triggers
the acute stroke pathway; **≤ 0** makes stroke unlikely but does not exclude it.
Blood glucose is measured first to exclude the hypoglycaemia mimic.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, imaging / definitive
diagnosis, paediatric scoring.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / paramedic / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | emergency-department / acute-medical / other |
| `symptomOnsetAt` | timestamp | reported time of symptom onset |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Precondition.**

| Field | Type | Notes |
| --- | --- | --- |
| `bloodGlucose` | numeric (mmol/L) | measured before scoring; `< 3.5` flags hypoglycaemia mimic |
| `hypoglycaemiaCorrected` | enum (yes/no/na) | whether hypoglycaemia was corrected before applying the score |

**Criterion inputs.** Each enum `yes` / `no`.

| Field | Type | Criterion | Points |
| --- | --- | --- | --- |
| `lossOfConsciousness` | enum (yes/no) | 1 — LOC / syncope | −1 if yes |
| `seizureActivity` | enum (yes/no) | 2 — seizure activity | −1 if yes |
| `facialWeakness` | enum (yes/no) | 3 — asymmetric facial weakness | +1 if yes |
| `armWeakness` | enum (yes/no) | 4 — asymmetric arm weakness | +1 if yes |
| `legWeakness` | enum (yes/no) | 5 — asymmetric leg weakness | +1 if yes |
| `speechDisturbance` | enum (yes/no) | 6 — speech disturbance | +1 if yes |
| `visualFieldDefect` | enum (yes/no) | 7 — visual field defect | +1 if yes |

**Derived (never stored as input).** `rosierScore`, `band`, `firedCriteria[]`,
`flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O. Each mimic contributes 0 or −1; each sign contributes 0
or +1:

```
lossOfConsciousnessPoint = lossOfConsciousness == 'yes' ? -1 : 0
seizureActivityPoint     = seizureActivity     == 'yes' ? -1 : 0
facialWeaknessPoint      = facialWeakness       == 'yes' ? 1 : 0
armWeaknessPoint         = armWeakness          == 'yes' ? 1 : 0
legWeaknessPoint         = legWeakness          == 'yes' ? 1 : 0
speechDisturbancePoint   = speechDisturbance    == 'yes' ? 1 : 0
visualFieldDefectPoint   = visualFieldDefect    == 'yes' ? 1 : 0

rosierScore = lossOfConsciousnessPoint + seizureActivityPoint
            + facialWeaknessPoint + armWeaknessPoint + legWeaknessPoint
            + speechDisturbancePoint + visualFieldDefectPoint    // -2..+5
band        = rosierScore > 0 ? 'stroke-likely' : 'stroke-unlikely'
```

- The score is a signed sum; its range is −2 (both mimics, no signs) to +5 (all
  five signs, no mimics).
- The `> 0` threshold is strict: a total of exactly 0 is **stroke-unlikely**.
- The score is only clinically valid once hypoglycaemia has been excluded or
  corrected; a low `bloodGlucose` raises a flag regardless of the total.

## 5. Flagged issues (red flags)

Emitted independently of the total, each with a priority:

- **Activate stroke pathway** (high) — `rosierScore > 0`: positive screen;
  activate the acute stroke pathway, urgent imaging, and start the
  thrombolysis / reperfusion clock (time-critical).
- **Hypoglycaemia mimic** (high) — `bloodGlucose != null && bloodGlucose < 3.5`:
  correct hypoglycaemia and reassess; the ROSIER score is not valid while the
  patient is hypoglycaemic.
- **Seizure / LOC caution** (medium) — `seizureActivity == 'yes'` or
  `lossOfConsciousness == 'yes'`: mimic present and pulling the score down; a
  negative total does not exclude stroke — weigh clinical suspicion.
- **Clinical suspicion override** (medium) — `rosierScore <= 0` but any
  neurological sign present: stroke unlikely by score yet focal signs recorded;
  escalate if suspicion remains.
- **Incomplete assessment** (low) — `bloodGlucose == null` or any criterion
  unanswered: precondition or score inputs missing; the total may be unreliable.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  rosierScore: number;          // -2..+5
  band: 'stroke-unlikely' | 'stroke-likely';
  firedCriteria: FiredCriterion[];
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

- `bin/test-form recognition-of-stroke-in-the-emergency-room` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the boundary at the `> 0` threshold (total 0 vs +1), the extremes (−2 and +5),
  and the hypoglycaemia flag at glucose 3.4 / 3.5.
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
bin/test-form recognition-of-stroke-in-the-emergency-room
```
