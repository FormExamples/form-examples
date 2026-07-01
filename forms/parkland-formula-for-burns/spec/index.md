# Parkland Formula for Burns — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `parkland-formula-for-burns`

## 1. Purpose

A fluid-resuscitation calculator for major thermal burns. Given body weight,
%TBSA burned, and the time of injury, it computes the total 24-hour crystalloid
volume by the Parkland formula, splits it into the first-8-hour and next-16-hour
phases, derives an infusion rate for each phase (offsetting for time already
elapsed since injury), and reports a urine-output titration target. It estimates
a **starting** prescription only; fluids are then titrated to physiological
endpoints. It is not a definitive burns-management tool.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, colloid / modified
formulas (Brooke, Muir–Barclay), and definitive burns management.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / paramedic / other |
| `careSetting` | enum | emergency-department / burns-unit / intensive-care / retrieval / other |
| `assessedAt` | timestamp | date and time of assessment |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult / child age band |
| `sex` | enum | patient sex |

**Calculation inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `weightKg` | numeric (kg) | body weight |
| `tbsaPercent` | numeric (0–100) | %TBSA, partial-thickness or deeper; superficial excluded |
| `tbsaMethod` | enum | rule-of-nines / lund-browder / other |
| `injuryAt` | timestamp | date and time the burn occurred |
| `injuryTimeKnown` | enum | known / estimated |

**Injury features (drive flags, not the arithmetic).**

| Field | Type | Notes |
| --- | --- | --- |
| `inhalationSuspected` | enum | yes / no |
| `circumferentialOrDeep` | enum | yes / no — escharotomy risk |
| `mechanism` | enum | thermal / electrical / chemical / other |

**Derived (never stored as input).** `total24hVolumeMl`, `first8hVolumeMl`,
`next16hVolumeMl`, `hoursSinceInjury`, `remainingFirst8hHours`,
`first8hRateMlPerHour`, `next16hRateMlPerHour`, `targetUrineOutputMlPerHour`
(low / high band), `flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. All volumes in millilitres, rates in mL/hour.

```
total24hVolumeMl = (weightKg != null && tbsaPercent != null)
                     ? 4 * weightKg * tbsaPercent
                     : null

first8hVolumeMl  = total24hVolumeMl != null ? total24hVolumeMl / 2 : null
next16hVolumeMl  = total24hVolumeMl != null ? total24hVolumeMl / 2 : null

// time-since-injury offset
hoursSinceInjury      = (injuryAt != null && assessedAt != null)
                          ? (assessedAt - injuryAt) in hours (>= 0)
                          : null
remainingFirst8hHours = hoursSinceInjury != null ? max(8 - hoursSinceInjury, 0) : 8

// infusion rates
first8hRateMlPerHour  = (first8hVolumeMl != null && remainingFirst8hHours > 0)
                          ? first8hVolumeMl / remainingFirst8hHours
                          : null   // null when overdue: give outstanding volume now
next16hRateMlPerHour  = next16hVolumeMl != null ? next16hVolumeMl / 16 : null

// titration target derived from weight (adult band 0.5–1.0 mL/kg/h)
targetUrineOutputLowMlPerHour  = weightKg != null ? 0.5 * weightKg : null
targetUrineOutputHighMlPerHour = weightKg != null ? 1.0 * weightKg : null
```

- The **coefficient is 4** mL/kg/%TBSA. The **8h / 16h split is measured from the
  time of injury**, not from arrival, so `remainingFirst8hHours` shrinks as time
  passes and the first-phase rate rises accordingly.
- When `hoursSinceInjury > 8` the first phase is **overdue**:
  `remainingFirst8hHours = 0`, `first8hRateMlPerHour = null`, and an overdue flag
  fires — the outstanding first-phase volume is given as a priority.
- A missing weight or %TBSA yields `null` derived volumes and a
  data-completeness flag; no partial arithmetic is invented.
- Superficial (epidermal) burns are excluded from `tbsaPercent` by definition;
  this is a data-entry rule, not computed here.

## 5. Flagged issues (red flags)

Emitted independently of the arithmetic, each with a priority:

- **Major burn — burns-unit referral** (high) —
  `tbsaPercent >= 15` (adult) or `>= 10` (child): refer to a specialist burns
  service and commence formal resuscitation.
- **Inhalation / airway risk** (high) — `inhalationSuspected == 'yes'`: assess
  airway early; consider intubation before oedema develops.
- **Escharotomy risk** (high) — `circumferentialOrDeep == 'yes'`: circumferential
  or deep burn; monitor perfusion and compartment pressures.
- **Resuscitation overdue** (high) — `hoursSinceInjury > 8`: first-phase window
  from injury has passed; give outstanding volume now and re-plan.
- **Titrate to urine output** (medium) — always when a plan is produced: the
  formula is a starting estimate; titrate to 0.5–1.0 mL/kg/h (adult) and adjust.
- **Special mechanism** (medium) — `mechanism` is `electrical` or `chemical`:
  higher fluid requirement / occult injury; seek specialist advice.
- **Incomplete assessment** (low) — `weightKg`, `tbsaPercent`, or `injuryAt`
  missing: the plan cannot be fully derived; complete and re-calculate.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A calculation object emitted by the engine:

```ts
{
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

- `bin/test-form parkland-formula-for-burns` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering: the base formula (`4 × weight × %TBSA`), the exact 50/50 phase split,
  the time-offset (`remainingFirst8hHours` at 0 h, mid-window, exactly 8 h, and
  overdue > 8 h), both phase rates, the urine-output band, and every flag.
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

- [`index.md`](../index.md) — form description and calculation details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form parkland-formula-for-burns
```
