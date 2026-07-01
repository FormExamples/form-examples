# Emergency Department Triage Note — Agent Instructions

A first-contact ED triage assessment. Collects arrival, presenting complaint,
brief history, triage vital signs, and a pain score via a single continuous
single-page wizard, then **classifies** the patient into one of the five
Manchester Triage System (MTS) priority levels — 1 Red/Immediate (0 min),
2 Orange/Very urgent (10 min), 3 Yellow/Urgent (60 min), 4 Green/Standard
(120 min), 5 Blue/Non-urgent (240 min). A supporting NEWS2 aggregate can escalate
the category, and red-flag issues (life threat, sepsis, time-critical
presentations, incomplete triage) prompt escalation.

This is a **classification** form: the engine selects the most urgent level
justified by the findings; it does not sum a numeric total.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (MTS, NEWS2, NICE NG51)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `TriageNote` TypeScript type — arrival, identification,
  presenting complaint, vital-sign, pain, and discriminator-flag fields.
- **Output shape:**
  ```ts
  triage(data: TriageNote): {
    news2Total: number;
    news2AnyParameterThree: boolean;
    firedDiscriminators: FiredDiscriminator[];
    priorityLevel: 1 | 2 | 3 | 4 | 5;
    priorityColour: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
    priorityName: 'Immediate' | 'Very urgent' | 'Urgent' | 'Standard' | 'Non-urgent';
    targetMinutes: 0 | 10 | 60 | 120 | 240;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** classification, not additive (see spec §4). Evaluate the MTS
  discriminators, compute a supporting NEWS2 aggregate, apply NEWS2 escalation
  (≥ 7 or any parameter 3 → at least Level 2; 5–6 → at least Level 3), then assign
  `priorityLevel` = the most urgent (lowest number) level. `priorityColour`,
  `priorityName`, and `targetMinutes` derive directly from the level. Missing
  vital signs never lower the category and raise a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `triage-rules.ts`,
  `triage-grader.ts`, `flagged-issues.ts`.
- **Tests:** `triage-grader.test.ts`, `triage-rules.test.ts` — cover each MTS
  level 1–5, NEWS2 escalation thresholds, pain-score bands (≥ 7, 4–6), and the
  "highest discriminator wins" selection.

## Triage levels & target times

| Level | Colour | Name | Target time |
| --- | --- | --- | --- |
| 1 | Red | Immediate | 0 minutes |
| 2 | Orange | Very urgent | 10 minutes |
| 3 | Yellow | Urgent | 60 minutes |
| 4 | Green | Standard | 120 minutes |
| 5 | Blue | Non-urgent | 240 minutes |

## Flagged issues

Computed independently of the assigned level (see spec §5): life threat /
category 1 (any Level-1 discriminator, high), sepsis / high NEWS2
(`sepsisFeatures` or NEWS2 ≥ 7 or any parameter 3, high), time-critical
presentation (chest pain / stroke / paediatric red flag, high), severe pain
(`painScore ≥ 7`, medium), incomplete triage (any core vital sign missing, low).

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

- Mackway-Jones K. *et al.* *Emergency Triage: Manchester Triage Group.* 3rd ed.
  Wiley-Blackwell, 2014.
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- Royal College of Emergency Medicine. *Initial Assessment of Emergency
  Department Patients.*
- NICE NG51. *Sepsis: recognition, diagnosis and early management.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form emergency-department-triage-note
```
