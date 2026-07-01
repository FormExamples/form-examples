# Mental Health Act Assessment — Agent Instructions

Formal assessment under the UK Mental Health Act 1983 (as amended 2007) to
determine whether a person should be detained under a section, admitted
informally, or supported in the community. Collects the AMHP-coordinated
assessment plus medical recommendations via a single continuous single-page
wizard, documents the statutory criteria and required signatories, and produces
a **legal-completeness status** (`valid` / `incomplete`), a **recommended-section
classification** (`section-2` / `section-3` / `section-4` / `section-5-2` /
`section-5-4` / `section-136` / `none`), an **urgency classification**, and a set
of **flagged issues**. This is a documentation and legal-completeness instrument
— **not** a numeric score and **not** an automated decision to detain.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — legal and clinical reference documentation (MHA 1983, Code of
  Practice 2015, Reference Guide)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Validation / classification engine

This form is a **documentation-completeness and classification engine**, not a
numeric scorer. It validates that the elements required by the recommended
section are documented and classifies the section and urgency.

- **Input shape:** `MentalHealthActAssessment` TypeScript type — context and
  identification, assessing professionals, statutory criteria, nearest-relative
  fields, and recommendation / outcome fields.
- **Output shape:**
  ```ts
  gradeMentalHealthActAssessment(data: MentalHealthActAssessment): {
    completenessStatus: 'valid' | 'incomplete';
    recommendedSectionClass:
      'section-2' | 'section-3' | 'section-4'
      | 'section-5-2' | 'section-5-4' | 'section-136' | 'none';
    urgencyClass: 'routine' | 'urgent' | 'emergency';
    requiredSignatories: RequiredSignatory[];
    criteriaSummary: CriterionResult[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm** (see spec §4): classify the recommended section; look up that
  section's **required signatories** (s2/s3 need two doctors, one Section 12
  approved; s4/s136 need one doctor + AMHP; s5(2)/s5(4) are holding powers) and
  **required criteria** (mental disorder + a risk limb + least-restrictive for
  all detaining sections; plus appropriate-treatment-available for s3). Emit
  `valid` only when every required signatory is present and every required
  criterion is `met` with evidence; otherwise `incomplete`. Urgency is
  `emergency` for the emergency powers (s4/s5/s136) or imminent risk, `urgent`
  for s2/s3, else `routine`. The engine makes **no** automated detention
  decision.
- **Engine files:** `types.ts`, `utils.ts`, `mha-rules.ts`, `mha-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `mha-grader.test.ts`, `mha-rules.test.ts` — cover each section's
  signatory and criteria requirements, the `valid` / `incomplete` boundary
  (e.g. s2 with one doctor → `incomplete`; s3 with unmet treatment criterion →
  `incomplete`), each urgency class, and every flagged issue.

## Flagged issues

Computed independently of the completeness status (see spec §5): criteria not met
(high), missing second medical recommendation (high), Section 12 doctor absent
(high), least-restrictive / human-rights concern (high), appropriate treatment
not available for s3 (high), nearest relative not consulted (medium), statutory
time limit exceeded (medium), no bed identified (medium), no prior acquaintance
(low), incomplete documentation (low).

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

## Legal and clinical grounding

- Mental Health Act 1983 (as amended by the Mental Health Act 2007).
- Department of Health. *Mental Health Act 1983: Code of Practice* (2015).
- Mental Health (Hospital, Guardianship and Treatment) (England) Regulations 2008
  — prescribed statutory forms.
- Reference Guide to the Mental Health Act 1983 (Department of Health).
- Human Rights Act 1998, Article 5 (right to liberty); Mental Capacity Act 2005.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*
- This tool documents and validates the assessment; the statutory forms remain
  the definitive legal record and no automated detention decision is made.

## Verify

```sh
bin/test-form mental-health-act-assessment
```
