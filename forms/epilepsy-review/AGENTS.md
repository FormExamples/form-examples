# Epilepsy Annual Review — Agent Instructions

UK primary-care structured **annual epilepsy review** for adults, aligned with
NICE NG217. Collects, via a single continuous single-page wizard, the position
since the last review — seizure type and frequency, seizure-free status, ASM and
adherence and side effects, triggers, SUDEP discussion, injuries and status
epilepticus, safety (DVLA driving, bathing, occupation), valproate and
pregnancy-prevention arrangements for women of childbearing potential, mental
health, and the care plan. The engine **classifies seizure control**, **grades
review completeness**, and **raises safety flags**. It is a documentation and
decision-support instrument, not a numeric score.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NICE NG217, MHRA valproate, DVLA)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `EpilepsyReview` TypeScript type — context and epilepsy
  profile, seizure and medication fields, and the risk / safety / review-domain
  fields.
- **Output shape:**
  ```ts
  gradeEpilepsyReview(data: EpilepsyReview): {
    seizureControl: 'seizure-free' | 'controlled' | 'uncontrolled';
    reviewStatus: 'complete' | 'partial' | 'incomplete';
    completenessScore: number;   // documented required domains
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** pure classifier (see spec §4). Seizure control is driven by the
  worst finding — increasing trend, weekly/daily frequency, or any status
  epilepticus → `uncontrolled`; no seizures / seizure-free trend → `seizure-free`;
  otherwise `controlled`. Review completeness counts documented required domains;
  a missing core domain (seizure or ASM) forces `incomplete`. Valproate / PPP,
  folic acid, and contraception domains are required only when
  `womanOfChildbearingPotential == 'yes'`.
- **Engine files:** `types.ts`, `utils.ts`, `review-rules.ts`,
  `review-grader.ts`, `flagged-issues.ts`.
- **Tests:** `review-grader.test.ts`, `review-rules.test.ts` — cover each
  seizure-control class, each completeness grade, and every flag, including the
  valproate / PPP and DVLA-driving edge cases.

## Flagged issues

Computed independently of class and grade (see spec §5): specialist review
(uncontrolled / increasing seizures, high), valproate PPP (valproate in a woman
of childbearing potential without a documented pregnancy-prevention programme,
high), status epilepticus (high), driving safety (driving while not DVLA-eligible,
high), mental health (suicidality high; depression / anxiety / low mood medium),
SUDEP not documented (medium), poor adherence (medium), significant ASM side
effects (medium), folic acid missing (medium), review incomplete / overdue (low).

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

- NICE NG217. *Epilepsies in children, young people and adults* (2022).
- MHRA. *Valproate use by women and girls* — pregnancy-prevention programme and
  annual specialist review (2018, updated 2024).
- DVLA. *Assessing fitness to drive* — epilepsy and seizures.
- SUDEP Action / NICE. *Sudden Unexpected Death in Epilepsy — risk discussion.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form epilepsy-review
```
