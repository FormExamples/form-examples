# Newborn and Infant Physical Examination (NIPE) — Agent Instructions

UK national-screening head-to-toe examination of a baby, performed within 72
hours of birth and repeated at the 6–8 week infant review. Collected via a
single continuous single-page wizard, it records a systematic examination and
classifies the four key screening components — **eyes**, **heart**, **hips**,
and **testes** (in boys) — as **Satisfactory**, **Refer**, or **Not examined**,
then computes an overall screening outcome and referral pathways.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NIPE programme handbook, standards)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily;
  RESTful `/examinations/` list + `/examinations/[id]` form)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `NipeExamination` TypeScript type — context and baby
  identification, risk factors, the observation fields for each key component,
  the head-to-toe systematic-examination fields, and a per-component recorded
  result.
- **Output shape:**
  ```ts
  gradeNipe(data: NipeExamination): {
    eyesResult: ComponentResult;      // 'satisfactory' | 'refer' | 'not-examined'
    heartResult: ComponentResult;
    hipsResult: ComponentResult;
    testesResult: ComponentResult | 'not-applicable';
    overallOutcome: 'satisfactory' | 'refer' | 'incomplete';
    completeness: 'complete' | 'incomplete';
    referrals: Referral[];            // { component, pathway, urgency }
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** per-component classification followed by an outcome roll-up
  (see spec §4). Each key component resolves to `satisfactory` / `refer` /
  `not-examined` (testes → `not-applicable` for girls). The overall outcome is
  `refer` if any component is `refer`; else `incomplete` if any applicable
  component is `not-examined`; else `satisfactory`. Each `refer` component emits
  a `Referral` with a pathway and urgency (`same-day` / `within-2-weeks` /
  `by-6-weeks` / `review-6-8-weeks`).
- **Engine files:** `types.ts`, `utils.ts`, `nipe-rules.ts`, `nipe-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `nipe-grader.test.ts`, `nipe-rules.test.ts` — cover each component
  result, the girls-exclude-testes case, the outcome roll-up (satisfactory /
  refer / incomplete), and every referral urgency.

## Flagged issues

Computed independently of the outcome roll-up (see spec §5), each with a
priority:

- **Absent red reflex** (high) — eyes: absent/abnormal red reflex → urgent
  ophthalmology within 2 weeks (suspected congenital cataract).
- **Absent or weak femoral pulses** (high) — heart: possible coarctation →
  urgent cardiac review.
- **Central cyanosis / low or discordant saturations** (high) — heart: possible
  critical congenital heart disease → urgent same-day cardiac / neonatal review.
- **Heart murmur** (medium) — heart: → cardiac assessment per local pathway.
- **Bilateral undescended testes** (high) — testes: possible disorder of sex
  development → same-day senior / endocrine review.
- **Hip instability** (high) — hips: positive Barlow/Ortolani or limited
  abduction → hip ultrasound within 2 weeks.
- **Hip risk factor** (medium) — hips: breech or first-degree family history →
  hip ultrasound by 6 weeks of age.
- **Component not examined** (low) — any applicable key component not examined →
  complete the screen.

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

- Public Health England / NHS England. *NIPE Screening Programme Handbook* and
  programme standards.
- UK National Screening Committee. *NIPE programme overview and pathways.*
- NICE NG194. *Postnatal care* (2021).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form newborn-and-infant-physical-examination
```
</content>
