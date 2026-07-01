# Mental State Examination (MSE) — Agent Instructions

Structured clinician record of a psychiatric mental state examination across
seven domains (ASEPTIC: appearance and behaviour, speech, emotion, perception,
thought, insight, cognition), collected via a single continuous single-page
wizard. It is a **documentation and completeness** instrument, not a numeric
score: the engine grades the record **Complete** or **Partial**, computes a
completeness percentage, and derives a **risk indicator** (none / low / moderate
/ high) from safety flags (suicidal or homicidal ideation, command
hallucinations, thoughts of self-harm, psychosis with risk, lack of insight with
risk).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (MSE domains, risk documentation)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Grading engine

- **Input shape:** `MseAssessment` TypeScript type — the seven domain finding
  groups plus context and identification fields.
- **Output shape:**
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
- **Algorithm:** completeness is documented-domains ÷ 7; `status` is `complete`
  only when all seven domains have a non-blank finding. `riskLevel` is the
  highest priority among the flags raised (high > moderate > low > none) — it is
  **not** a sum of points. See spec §4–§5.
- **Engine files:** `types.ts`, `utils.ts`, `mse-rules.ts`, `mse-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `mse-grader.test.ts`, `mse-rules.test.ts` — cover each flag
  threshold, every risk level, and the completeness boundary (none documented,
  partial, all seven documented).

## Flagged issues

Computed independently of completeness (see spec §5), each with a priority:
suicidal ideation (high), homicidal ideation / harm to others (high), command
hallucinations (high), psychosis with risk (high), recent self-harm (high),
thoughts of self-harm (moderate), delusional content (moderate), lack of insight
with risk (moderate), cognitive impairment (moderate), agitation (low), low mood
(low), incomplete examination (low). `riskLevel` is derived from the highest
priority present.

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
- British English throughout.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Semple D., Smyth R. *Oxford Handbook of Psychiatry* — the mental state
  examination.
- Trzepacz P.T., Baker R.W. *The Psychiatric Mental Status Examination.*
- Geeky Medics. *Mental State Examination (MSE) — OSCE Guide.*
- Royal College of Psychiatrists. Assessment and documentation standards.
- NICE NG225. *Self-harm: assessment, management and preventing recurrence.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form mental-state-examination
```
