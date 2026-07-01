# Mental Health Act Assessment — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `mental-health-act-assessment`

## 1. Purpose

A formal assessment under the UK Mental Health Act 1983 (as amended 2007) to
determine whether a person should be detained under a section, admitted
informally, or supported in the community. It records the AMHP-coordinated
assessment plus the required medical recommendations, documents the statutory
criteria and the required signatories, and produces a **legal-completeness
status** (`valid` / `incomplete`), a **recommended-section classification**, an
**urgency classification**, and a set of **flagged issues**. It is a
documentation and legal-completeness instrument, **not** a numeric severity
score and **not** an automated decision to detain.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, validation/classification engine, two consolidated
front-ends (`front-end-with-html`, `front-end-with-svelte`), the Rust Loco
JSON-API crate, and the generated representations (XML, FHIR R5, protobuf,
OpenAPI). Out of scope: hosted deployment, authentication, multi-tenancy, the
legally prescribed statutory forms themselves, Scotland (Mental Health (Care and
Treatment) (Scotland) Act 2003) and Northern Ireland regimes.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `assessedAt` | timestamp | date and time of assessment |
| `location` | enum | hospital-ward / emergency-department / place-of-safety / care-home / community / other |
| `referralSource` | text | who requested the assessment |
| `reasonForAssessment` | text | presenting concern |
| `personIdentifier` | text | local identifier |
| `ageBand` | enum | child / adolescent / adult / older-adult |
| `sex` | enum | person sex |
| `firstLanguage` | text | interpreter need if not English |

**Assessing professionals.**

| Field | Type | Notes |
| --- | --- | --- |
| `amhpName` | text | Approved Mental Health Professional |
| `amhpApproved` | enum (yes/no) | AMHP approval confirmed |
| `doctor1Name` | text | first medical practitioner |
| `doctor1GmcNumber` | text | GMC registration |
| `doctor1Section12Approved` | enum (yes/no) | s12(2) approved |
| `doctor1ExaminedAt` | timestamp | examination time |
| `doctor2Name` | text | second medical practitioner (may be absent for s4/s5/s136) |
| `doctor2GmcNumber` | text | GMC registration |
| `doctor2Section12Approved` | enum (yes/no) | s12(2) approved |
| `doctor2ExaminedAt` | timestamp | examination time |
| `priorAcquaintance` | enum (yes/no) | at least one doctor previously acquainted with the patient |

**Statutory criteria** (each `met` / `not-met` / `not-applicable` + evidence text).

| Field | Type | Criterion |
| --- | --- | --- |
| `mentalDisorderPresent` | enum | 1 — mental disorder of a nature or degree |
| `mentalDisorderEvidence` | text | supporting evidence |
| `riskToOwnHealth` | enum | 2 — own health |
| `riskToOwnSafety` | enum | 2 — own safety |
| `riskToOthers` | enum | 2 — protection of others |
| `riskEvidence` | text | supporting evidence |
| `riskImminence` | enum | none / low / moderate / imminent |
| `leastRestrictiveMet` | enum | 3 — no less restrictive alternative |
| `alternativesConsidered` | text | informal / community / MCA options considered |
| `appropriateTreatmentAvailable` | enum | 4 — appropriate medical treatment available (s3) |
| `treatmentPlanSummary` | text | proposed treatment / where |

**Nearest relative / consultees.**

| Field | Type | Notes |
| --- | --- | --- |
| `nearestRelativeIdentified` | enum (yes/no) | |
| `nearestRelativeConsulted` | enum (yes/no/not-practicable) | |
| `nearestRelativeObjection` | enum (yes/no/unknown) | objection to a s3 application |
| `consultationRecord` | text | AMHP consultation notes |

**Recommendation and outcome.**

| Field | Type | Notes |
| --- | --- | --- |
| `recommendedSection` | enum | 2 / 3 / 4 / 5-2 / 5-4 / 136 / none |
| `outcome` | enum | detain-under-section / informal-admission / community / no-action |
| `bedIdentified` | enum (yes/no) | receiving bed confirmed |
| `conveyance` | enum | ambulance / police / self / other |
| `clinicalLegalNote` | text | free-text clinical and legal note |

**Derived (never stored as input).** `completenessStatus`,
`recommendedSectionClass`, `urgencyClass`, `requiredSignatories[]`,
`criteriaSummary[]`, `flaggedIssues[]`.

## 4. Validation and classification algorithm

Pure function, no I/O. It does **not** decide whether to detain; it validates
that the documentation supporting the chosen section is complete and classifies
the section and urgency.

**Step 1 — recommended section class.** Map `recommendedSection` to the class
enum: `2→section-2`, `3→section-3`, `4→section-4`, `5-2→section-5-2`,
`5-4→section-5-4`, `136→section-136`, `none→none`.

**Step 2 — required signatories per section.**

```
section-2, section-3 : AMHP approved + doctor1 present + doctor2 present
                       + at least one doctor Section 12 approved
section-4            : AMHP approved + doctor1 present (second doctor NOT required)
section-5-2          : doctor1 present (registered clinician in charge)
section-5-4          : nurse of prescribed class (recorded via doctor1 slot / role)
section-136          : AMHP present + doctor1 present at the place of safety
none                 : no statutory signatories required
```

**Step 3 — required criteria per section.**

```
section-2, section-4, section-5-*, section-136 : mentalDisorderPresent == met
                                                 AND (riskToOwnHealth|riskToOwnSafety|riskToOthers == met)
                                                 AND leastRestrictiveMet == met
section-3                                       : the above AND appropriateTreatmentAvailable == met
none                                            : no criteria required
```

**Step 4 — completeness status.**

```
completenessStatus = 'valid'      when recommendedSectionClass != 'none'
                                    AND all required signatories for that class are present
                                    AND all required criteria for that class are met with evidence
                   = 'valid'      when recommendedSectionClass == 'none'
                                    AND outcome is a resolved value (informal-admission / community / no-action)
                   = 'incomplete' otherwise
```

**Step 5 — urgency class.**

```
urgencyClass = 'emergency' when recommendedSectionClass in {section-4, section-5-2, section-5-4, section-136}
                            OR riskImminence == 'imminent'
             = 'urgent'    when recommendedSectionClass in {section-2, section-3}
             = 'routine'   otherwise
```

Statutory time limits are checked for the flags in §5 (e.g. for s2/s3 the two
medical examinations must be within **5 days** of each other; the application
must follow within **14 days** of the later examination).

## 5. Flagged issues (red flags)

Emitted independently of the completeness status, each with a priority:

- **Criteria not met** (high) — a criterion required by the recommended section
  is `not-met` (e.g. mental disorder not established, no risk limb met, or a less
  restrictive alternative is available). A detaining section cannot lawfully rest
  on unmet criteria.
- **Missing second medical recommendation** (high) — `recommendedSectionClass`
  is `section-2` or `section-3` but `doctor2Name` is empty.
- **Section 12 doctor absent** (high) — `section-2`/`section-3` but neither
  doctor is Section 12 approved.
- **Least-restrictive / human-rights concern** (high) — `leastRestrictiveMet` is
  `not-met` while a detaining section is recommended, or alternatives were not
  documented; Article 5 (right to liberty) concern.
- **Appropriate treatment not available** (high) — `section-3` but
  `appropriateTreatmentAvailable` is `not-met`.
- **Nearest relative not consulted** (medium) — `section-3` recommended but
  `nearestRelativeConsulted` is `no` (and not `not-practicable`), or a recorded
  objection is unresolved.
- **Statutory time limit exceeded** (medium) — the two medical examinations are
  more than 5 days apart, or examination-to-application exceeds the limit.
- **No prior acquaintance** (low) — neither doctor previously acquainted with the
  patient (Code of Practice recommends one should be, where practicable).
- **No bed identified** (medium) — a detaining section is recommended but
  `bedIdentified` is `no`.
- **Incomplete documentation** (low) — any required signatory or evidence field
  is empty; the assessment cannot yet be classified `valid`.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A validation/classification object emitted by the engine:

```ts
{
  completenessStatus: 'valid' | 'incomplete';
  recommendedSectionClass:
    'section-2' | 'section-3' | 'section-4'
    | 'section-5-2' | 'section-5-4' | 'section-136' | 'none';
  urgencyClass: 'routine' | 'urgent' | 'emergency';
  requiredSignatories: RequiredSignatory[]; // present/absent per role
  criteriaSummary: CriterionResult[];       // met/not-met/not-applicable per criterion
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

- `bin/test-form mental-health-act-assessment` exits cleanly.
- The engine is pure (no side effects, no I/O) and unit-tested, covering: each
  section's required signatories and criteria; the `valid` / `incomplete`
  boundary (e.g. s2 with one doctor is `incomplete`; s3 with an unmet treatment
  criterion is `incomplete`); each urgency class; and every flagged issue.
- The engine performs no automated detention decision — it validates
  documentation and classifies only.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Governed by the Mental Health Act 1983 (as amended
2007), its Code of Practice (2015), and the Human Rights Act 1998 (Article 5);
the prescribed statutory forms remain the definitive legal record. Form-specific
classification is recorded in [`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md)
where it differs from the baseline.

## 10. References

- [`index.md`](../index.md) — form description and classification model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form mental-health-act-assessment
```
