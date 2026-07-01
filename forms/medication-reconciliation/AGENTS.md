# Medication Reconciliation — Agent Instructions

A medicines-safety document that reconciles a patient's medicines at a transition
of care (admission / transfer / discharge). Collects the best-possible medication
history (BPMH) from **two or more independent sources**, the current inpatient
list, and reconciles the two via one continuous single-page wizard — classifying
every discrepancy (omission / commission / duplication / dose / frequency / route
/ formulation), documenting the intended action (continue / hold / stop / change
/ start) with a rationale, grading the reconciliation **status** (Complete /
Discrepancies-outstanding / Incomplete), and raising **safety flags**. It is a
documentation-and-completeness form, not a numeric score.

See [`index.md`](./index.md) for the full design and the section table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (WHO High 5s, NICE NG5, RPS)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Reconciliation engine

- **Input shape:** `MedicationReconciliation` TypeScript type — the encounter /
  identification fields plus child collections: `informationSources[]`,
  `allergies[]`, `medicationLineItems[]` (each tagged `bpmh` or `inpatient`),
  and `discrepancies[]`.
- **Output shape:**
  ```ts
  reconcile(data: MedicationReconciliation): {
    status: 'complete' | 'discrepancies-outstanding' | 'incomplete';
    discrepancies: ClassifiedDiscrepancy[];
    firedRules: FiredRule[];
    flags: SafetyFlag[];
    sourceCount: number;
    unintentionalCount: number;
    highRiskUnintentionalCount: number;
  }
  ```
- **Algorithm:** compare BPMH against the inpatient list, classify each
  discrepancy by type and by `intentional`, then derive the status (first match
  wins): `< 2` sources or allergy status not documented or a line item not
  reviewed → `incomplete`; any unintentional discrepancy or any discrepancy
  missing action / rationale → `discrepancies-outstanding`; otherwise
  `complete`. See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `reconciliation-rules.ts`,
  `reconciler.ts`, `flagged-issues.ts`.
- **Tests:** `reconciler.test.ts`, `reconciliation-rules.test.ts` — cover each
  status class, each discrepancy type, intentional vs unintentional, the
  high-risk (anticoagulant / insulin / opioid) branch, the `< 2` sources branch,
  and the allergy-conflict branch.

## Safety flags

Computed independently of the status (see spec §5): high-risk unintentional
discrepancy on an anticoagulant / insulin / opioid (high); insufficient sources
(`< 2`, high); allergy conflict (high); drug interaction (high / medium);
therapeutic duplication (medium); unintentional discrepancy outstanding (medium);
allergy status not documented (low).

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

- World Health Organization. *High 5s — Medication Reconciliation*, 2014.
- NICE NG5. *Medicines optimisation*, 2015.
- Royal Pharmaceutical Society. *Keeping patients safe when they transfer between
  care providers*, 2012.
- NICE / NPSA PSG001. *Medicines reconciliation on admission of adults to
  hospital*, 2007.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form medication-reconciliation
```
