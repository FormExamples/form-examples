# Child Safeguarding Referral — Agent Instructions

A structured referral to children's social care when a professional believes a
child may be at risk of harm. Collects the child and family details, the concern
or allegation, the category of abuse, presenting evidence, immediate risk and
safety, the consent / information-sharing basis, who else has been informed, and
the action requested — via a single continuous single-page wizard. The engine
grades the referral's **completeness / validity**, classifies its **urgency**
(emergency / urgent s47 or standard s17), and raises **safeguarding flags**.
This is a documentation-completeness and risk-classification form, not a numeric
score.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — statutory reference documentation (Children Act 1989, Working
  Together to Safeguard Children, Keeping Children Safe in Education)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Grading engine

- **Input shape:** `SafeguardingReferral` TypeScript type — referrer, child,
  family/household, concern, category, immediate-risk, consent, informed, and
  requested-action fields.
- **Output shape:**
  ```ts
  assess(referral: SafeguardingReferral): {
    status: 'complete' | 'partial' | 'incomplete';
    urgency: 'emergency' | 'urgent' | 'standard';
    completenessPercent: number; // 0..100
    firedRules: FiredRule[];
    flags: Flag[];
  }
  ```
- **Algorithm:** completeness by mandatory-field presence plus a consent-basis
  rule; urgency by immediate danger → `emergency`, else significant-harm
  triggers (sexual category, disclosure, alleged person in contact, other
  children at risk) → `urgent`, else `standard`. See spec §4. Urgency is always
  computed even when the referral is `incomplete`, so danger is never hidden.
- **Engine files:** `types.ts`, `utils.ts`, `safeguarding-rules.ts`,
  `referral-grader.ts`, `flagged-issues.ts`.
- **Tests:** `referral-grader.test.ts`, `safeguarding-rules.test.ts` — cover each
  status, each urgency, the consent-basis rule, and every flag.

## Safeguarding flags

Computed independently of status and urgency (see spec §5): immediate danger
(`immediateDanger == 'yes'`, high), disclosure of abuse (`childDisclosed ==
'yes'`, high), sexual abuse category (`primaryCategory == 'sexual'`, high),
other children at risk (`otherChildrenAtRisk == 'yes'`, high), no consent basis
documented (high), mandatory field missing (medium), child unaware / unsafe to
inform (medium), previous safeguarding history (low).

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
- British English throughout.

## Statutory grounding

- HM Government. *Working Together to Safeguard Children* (2023).
- *Children Act 1989*, sections 17 (child in need) and 47 (significant harm).
- Department for Education. *Keeping Children Safe in Education*.
- HM Government. *Information Sharing: advice for practitioners providing
  safeguarding services* (2018).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification) — administrative
  documentation and routing tool; records and routes a referral rather than
  diagnosing or treating.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form child-safeguarding-referral
```
