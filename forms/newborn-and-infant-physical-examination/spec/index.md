# Newborn and Infant Physical Examination (NIPE) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `newborn-and-infant-physical-examination`

## 1. Purpose

A UK national-screening head-to-toe examination of a baby, performed within 72
hours of birth and again at the 6–8 week infant review. It records a systematic
physical examination and classifies four key screening components — eyes, heart,
hips, and testes (in boys) — each as **Satisfactory**, **Refer**, or **Not
examined**, then computes an overall screening outcome and referral pathways. It
is a documentation and classification instrument, not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, growth charting, and
the separate newborn hearing and bloodspot screening programmes.

## 3. Data model

A single logical examination record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Context and baby identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `practitionerName` | text | examining practitioner |
| `practitionerRole` | enum | midwife / neonatal-nurse / paediatrician / gp / nurse-practitioner / other |
| `examinedAt` | timestamp | date and time of examination |
| `examinationContext` | enum | newborn-72h / infant-6-8-week |
| `careSetting` | enum | maternity-ward / neonatal-unit / community / gp-surgery / home / other |
| `babyIdentifier` | text | NHS number / local identifier |
| `babyName` | text | baby name |
| `dateOfBirth` | date | date of birth |
| `sex` | enum | male / female / indeterminate |
| `gestationalAgeWeeks` | numeric | completed weeks at birth |
| `birthWeightGrams` | numeric | birth weight in grams |

**Risk factors.**

| Field | Type | Notes |
| --- | --- | --- |
| `breechPresentation` | enum (yes/no) | breech at/after 36 weeks or at birth — hip risk factor |
| `familyHistoryHipProblems` | enum (yes/no) | first-degree family history of hip problems — hip risk factor |
| `antenatalConcerns` | text | relevant antenatal findings |

**Key-component observations.**

| Field | Type | Component |
| --- | --- | --- |
| `eyesRedReflexRight` | enum (present/absent/not-examined) | Eyes |
| `eyesRedReflexLeft` | enum (present/absent/not-examined) | Eyes |
| `eyesAppearance` | enum (normal/abnormal/not-examined) | Eyes |
| `heartMurmur` | enum (none/present/not-examined) | Heart |
| `femoralPulsesRight` | enum (present/weak/absent/not-examined) | Heart |
| `femoralPulsesLeft` | enum (present/weak/absent/not-examined) | Heart |
| `centralCyanosis` | enum (absent/present/not-examined) | Heart |
| `oxygenSaturationPreductal` | numeric (%) | Heart |
| `oxygenSaturationPostductal` | numeric (%) | Heart |
| `barlowTest` | enum (negative/positive/not-examined) | Hips |
| `ortolaniTest` | enum (negative/positive/not-examined) | Hips |
| `hipAbduction` | enum (normal/limited/not-examined) | Hips |
| `testisRight` | enum (descended/undescended/not-palpable/not-examined) | Testes |
| `testisLeft` | enum (descended/undescended/not-palpable/not-examined) | Testes |

**Head-to-toe systematic examination.** Each field enum
`normal / abnormal / not-examined`: `generalAppearance`, `skin`,
`headAndFontanelles`, `faceAndPalate`, `neckAndClavicles`, `chestAndLungs`,
`abdomen`, `genitalia`, `anusAndSpine`, `limbsAndDigits`, `feet`,
`toneAndMovement`. Measurements: `weightGrams` (numeric),
`headCircumferenceCm` (numeric), `lengthCm` (numeric).

**Recorded results and summary.** Optional practitioner-recorded per-component
result (`eyesResultRecorded` … cross-checked against the engine),
`clinicalNote` (text).

**Derived (never stored as input).** `eyesResult`, `heartResult`, `hipsResult`,
`testesResult`, `overallOutcome`, `completeness`, `referrals[]`,
`flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Each key component resolves to a `ComponentResult`
(`'satisfactory' | 'refer' | 'not-examined'`); testes additionally supports
`'not-applicable'`.

```
eyesResult =
  any eyes observation == 'absent'/'abnormal'                 -> 'refer'
  else all eyes observations == 'not-examined'/''             -> 'not-examined'
  else                                                        -> 'satisfactory'

heartResult =
  heartMurmur == 'present'
    || femoralPulses{Right,Left} in {weak, absent}
    || centralCyanosis == 'present'
    || (sat != null && sat < 95)                              -> 'refer'
  else all heart observations unexamined                      -> 'not-examined'
  else                                                        -> 'satisfactory'

hipsResult =
  barlowTest == 'positive' || ortolaniTest == 'positive'
    || hipAbduction == 'limited'
    || breechPresentation == 'yes'
    || familyHistoryHipProblems == 'yes'                      -> 'refer'
  else all hip manoeuvres unexamined                          -> 'not-examined'
  else                                                        -> 'satisfactory'

testesResult =
  sex != 'male'                                               -> 'not-applicable'
  else testis{Right,Left} in {undescended, not-palpable}     -> 'refer'
  else both unexamined                                        -> 'not-examined'
  else                                                        -> 'satisfactory'
```

**Outcome roll-up** over applicable key components (testes excluded when
`not-applicable`):

```
overallOutcome =
  any applicable result == 'refer'          -> 'refer'
  else any applicable result == 'not-examined' -> 'incomplete'
  else                                      -> 'satisfactory'

completeness = any applicable result == 'not-examined' ? 'incomplete' : 'complete'
```

Each `refer` component emits a `Referral { component, pathway, urgency }`:

| Component | Urgency | Pathway |
| --- | --- | --- |
| Eyes | `within-2-weeks` | ophthalmology (suspected congenital cataract) |
| Heart | `same-day` if cyanosis / absent pulse / low sats; else local pathway | cardiac / neonatal |
| Hips | `within-2-weeks` if abnormal exam; `by-6-weeks` if risk-factor-only | hip ultrasound |
| Testes | `same-day` if bilateral; else `review-6-8-weeks` | senior / endocrine / urology |

## 5. Flagged issues

Emitted independently of the outcome roll-up, each with a priority:

- **Absent red reflex** (high) — `eyesRedReflex{Right,Left} == 'absent'` or
  `eyesAppearance == 'abnormal'`: urgent ophthalmology within 2 weeks.
- **Absent or weak femoral pulses** (high) — a femoral pulse `weak`/`absent`:
  possible coarctation; urgent cardiac review.
- **Central cyanosis / low saturations** (high) — `centralCyanosis == 'present'`
  or a saturation `< 95%` or `> 3%` pre-/post-ductal difference: possible
  critical congenital heart disease; urgent same-day review.
- **Heart murmur** (medium) — `heartMurmur == 'present'`: cardiac assessment.
- **Bilateral undescended testes** (high) — both testes `undescended`/
  `not-palpable`: possible disorder of sex development; same-day senior review.
- **Hip instability** (high) — positive Barlow/Ortolani or limited abduction:
  hip ultrasound within 2 weeks.
- **Hip risk factor** (medium) — breech or first-degree family history: hip
  ultrasound by 6 weeks of age.
- **Component not examined** (low) — any applicable key component
  `not-examined`: complete the screen.

## 6. Inputs and outputs

**Input.** A typed examination object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  eyesResult: 'satisfactory' | 'refer' | 'not-examined';
  heartResult: 'satisfactory' | 'refer' | 'not-examined';
  hipsResult: 'satisfactory' | 'refer' | 'not-examined';
  testesResult: 'satisfactory' | 'refer' | 'not-examined' | 'not-applicable';
  overallOutcome: 'satisfactory' | 'refer' | 'incomplete';
  completeness: 'complete' | 'incomplete';
  referrals: Referral[];
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

- `bin/test-form newborn-and-infant-physical-examination` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each component result, the girls-exclude-testes case, the outcome
  roll-up (satisfactory / refer / incomplete), and every referral urgency.
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

- [`index.md`](../index.md) — form description and screening details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form newborn-and-infant-physical-examination
```
</content>
