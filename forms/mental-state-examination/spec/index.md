# Mental State Examination (MSE) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `mental-state-examination`

## 1. Purpose

A structured clinician record of a psychiatric mental state examination across
seven domains (ASEPTIC: appearance and behaviour, speech, emotion, perception,
thought, insight, cognition). It is a **documentation and completeness**
instrument, not a numeric score. The engine reports whether the record is
**Complete** or **Partial**, computes a completeness percentage, and derives a
**risk indicator** (none / low / moderate / high) from safety flags raised across
the domains. The output supports the mental state section of a clinical record
and prompts escalation where risk is flagged; it is not diagnostic and does not
replace a full risk assessment.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, grading engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, formal cognitive-test
scoring (MMSE / MoCA), and full risk-assessment workflows.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | psychiatrist / mental-health-nurse / gp / liaison / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | outpatient / inpatient / liaison / crisis / primary-care / other |
| `assessmentReason` | text | reason for assessment / referral |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | age band |
| `sex` | enum | patient sex |

**Domain 1 — Appearance and behaviour.**

| Field | Type | Notes |
| --- | --- | --- |
| `appearanceGrooming` | enum | well-kempt / dishevelled / other |
| `appearanceEyeContact` | enum | normal / reduced / intense / avoidant |
| `appearanceRapport` | enum | good / guarded / hostile / withdrawn |
| `appearancePsychomotor` | enum | normal / agitation / retardation |
| `appearanceAbnormalMovements` | text | tics, tremor, dystonia, etc. |
| `appearanceNotes` | text | free text |

**Domain 2 — Speech.**

| Field | Type | Notes |
| --- | --- | --- |
| `speechRate` | enum | normal / slow / rapid / pressured |
| `speechVolume` | enum | normal / quiet / loud |
| `speechQuantity` | enum | normal / poverty / excessive |
| `speechFluency` | enum | fluent / hesitant / dysarthric / mute |
| `speechNotes` | text | free text |

**Domain 3 — Emotion (mood and affect).**

| Field | Type | Notes |
| --- | --- | --- |
| `moodSubjective` | text | patient's own words |
| `moodDescriptor` | enum | euthymic / low / elevated / anxious / irritable / other |
| `affectRange` | enum | full / restricted / blunted / flat |
| `affectCongruence` | enum | congruent / incongruent |
| `affectReactivity` | enum | reactive / non-reactive |
| `emotionNotes` | text | free text |

**Domain 4 — Perception.**

| Field | Type | Notes |
| --- | --- | --- |
| `hallucinationsPresent` | enum | none / auditory / visual / olfactory / gustatory / tactile / multiple |
| `commandHallucinations` | enum | yes / no / not-applicable |
| `illusions` | enum | present / absent |
| `depersonalisation` | enum | present / absent |
| `derealisation` | enum | present / absent |
| `perceptionNotes` | text | free text |

**Domain 5 — Thought (form and content).**

| Field | Type | Notes |
| --- | --- | --- |
| `thoughtForm` | enum | linear / circumstantial / tangential / flight-of-ideas / thought-block / loosening |
| `delusions` | enum | none / persecutory / grandiose / reference / nihilistic / other |
| `obsessions` | enum | present / absent |
| `suicidalIdeation` | enum | none / passive / active-no-plan / active-with-plan |
| `homicidalIdeation` | enum | none / thoughts / intent |
| `selfHarmThoughts` | enum | none / thoughts / recent-acts |
| `thoughtNotes` | text | free text |

**Domain 6 — Insight and judgement.**

| Field | Type | Notes |
| --- | --- | --- |
| `insightLevel` | enum | full / partial / none |
| `treatmentUnderstanding` | enum | accepts / ambivalent / refuses |
| `judgement` | enum | intact / impaired |
| `insightNotes` | text | free text |

**Domain 7 — Cognition.**

| Field | Type | Notes |
| --- | --- | --- |
| `orientation` | enum | orientated / disorientated-time / disorientated-place / disorientated-person / global |
| `attention` | enum | normal / impaired |
| `memory` | enum | intact / short-term-impaired / long-term-impaired / global-impairment |
| `cognitiveImpression` | enum | no-concern / mild-concern / significant-concern |
| `cognitionNotes` | text | free text |

**Summary.** `clinicalFormulation` (text).

**Derived (never stored as input).** `domainStatuses[]` (per-domain documented
flag), `completenessPercent`, `status`, `riskLevel`, `firedRules[]`, `flags[]`.

## 4. Completeness and risk algorithm

Pure function, no I/O.

**Domain completeness.** Each of the seven domains is **documented** when at
least one of its findings fields is non-empty (`''` / `null` counts as blank).

```
documentedCount   = number of the 7 domains with any non-blank finding
completenessPercent = round(documentedCount / 7 * 100)          // 0..100
status              = documentedCount == 7 ? 'complete' : 'partial'
```

**Risk indicator.** Derived from the priority of the flags raised in §5, not
from a sum:

```
riskLevel = 'high'     if any high-priority flag
          = 'moderate' if any moderate-priority flag (and no high)
          = 'low'      if any low-priority flag (and no moderate/high)
          = 'none'     otherwise
```

## 5. Flagged issues (risk flags)

Emitted independently of completeness, each with a priority:

- **Suicidal ideation** (high) — `suicidalIdeation` is `active-no-plan` or
  `active-with-plan`: complete a full risk assessment and escalate.
- **Homicidal ideation / harm to others** (high) — `homicidalIdeation` is
  `thoughts` or `intent`.
- **Command hallucinations** (high) — `commandHallucinations == 'yes'`.
- **Psychosis with risk** (high) — hallucinations present or delusions present
  **and** any high-priority ideation flag also raised.
- **Recent self-harm** (high) — `selfHarmThoughts == 'recent-acts'`.
- **Thoughts of self-harm** (moderate) — `selfHarmThoughts == 'thoughts'`, or
  `suicidalIdeation == 'passive'`.
- **Delusional content** (moderate) — `delusions` other than `none`.
- **Lack of insight with risk** (moderate) — `insightLevel == 'none'` and any
  risk flag raised, or `treatmentUnderstanding == 'refuses'` with a moderate/high
  flag present.
- **Cognitive impairment** (moderate) — `cognitiveImpression == 'significant-concern'`
  or `orientation == 'global'`.
- **Agitation** (low) — `appearancePsychomotor == 'agitation'`.
- **Low mood** (low) — `moodDescriptor == 'low'` without an ideation flag.
- **Incomplete examination** (low) — `status == 'partial'`: one or more domains
  outstanding.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
assess(mse: MseAssessment): {
  status: 'complete' | 'partial';
  riskLevel: 'none' | 'low' | 'moderate' | 'high';
  completenessPercent: number;      // 0..100
  domainStatuses: DomainStatus[];   // per-domain documented flag
  firedRules: FiredRule[];
  flags: FlaggedIssue[];
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

- `bin/test-form mental-state-examination` exits cleanly.
- The grading engine is pure (no side effects, no I/O) and unit-tested, covering
  each risk-flag threshold, every risk level (none / low / moderate / high), and
  the completeness boundary (0, partial, and all-seven-documented).
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

- [`index.md`](../index.md) — form description and documentation model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form mental-state-examination
```
