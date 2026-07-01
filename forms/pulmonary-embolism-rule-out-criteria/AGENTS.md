# Pulmonary Embolism Rule-out Criteria (PERC) — Agent Instructions

Bedside rule-out screen for adults with a **low** clinician pre-test probability
of pulmonary embolism (PE). Collects eight objective criteria via a single
continuous single-page wizard — age < 50, heart rate < 100, SpO₂ ≥ 95%, no
unilateral leg swelling, no haemoptysis, no recent surgery/trauma needing general
anaesthesia within 4 weeks, no prior DVT/PE, no exogenous oestrogen — plus the
clinician's gestalt pre-test probability. When the pre-test probability is **low
and all eight criteria are satisfied**, the result is **PERC-negative** and PE is
excluded without D-dimer or imaging; otherwise the result is **PERC-positive**
and workup proceeds. The output is a **binary classification**, not a numeric
score.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Kline PERC, PROPER, NICE NG158)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

This is a **status / classification** engine, not a numeric scorer — it emits a
`perc-negative` / `perc-positive` result from a boolean conjunction.

- **Input shape:** `PercAssessment` TypeScript type — the eight criterion inputs
  (age is shared with identification), the `pretestProbability` gate, plus
  context and identification fields.
- **Output shape:**
  ```ts
  gradePerc(data: PercAssessment): {
    criterionResults: CriterionResult[];   // one per criterion, satisfied|failed
    failedCriteria: CriterionId[];
    allCriteriaSatisfied: boolean;
    applicable: boolean;                    // pretestProbability === 'low'
    percClassification: 'perc-negative' | 'perc-positive';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** boolean conjunction (see spec §4). Each criterion is `satisfied`
  only in its reassuring state; a missing input is treated as **failed** and
  raises a data-completeness flag. `perc-negative` requires
  `pretestProbability === 'low'` **and** all eight criteria satisfied; anything
  else is `perc-positive`. It is not a count or a sum — one failure is decisive.
  - age < 50 → satisfied
  - heartRate < 100 → satisfied
  - oxygenSaturation ≥ 95 → satisfied
  - unilateralLegSwelling == 'no' → satisfied
  - haemoptysis == 'no' → satisfied
  - recentSurgeryOrTrauma == 'no' → satisfied
  - priorVenousThromboembolism == 'no' → satisfied
  - oestrogenUse == 'no' → satisfied
- **Engine files:** `types.ts`, `utils.ts`, `perc-rules.ts`, `perc-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `perc-grader.test.ts`, `perc-rules.test.ts` — cover each threshold
  boundary (age 49/50, HR 99/100, SpO₂ 94/95), each criterion failing in
  isolation, the all-satisfied case, and the `not-low` pre-test override.

## Flagged issues

Computed independently of the classification (see spec §5): requires PE workup
(`percClassification == 'perc-positive'`, high), not applicable — pre-test
probability not low (`pretestProbability != 'low'`, high), hypoxia
(`oxygenSaturation < 95`, high), tachycardia (`heartRate >= 100`, medium), prior
venous thromboembolism (`priorVenousThromboembolism == 'yes'`, medium),
incomplete assessment (any criterion input or pre-test probability missing, low).

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

- Kline J.A. *et al.* Clinical criteria to prevent unnecessary diagnostic testing
  in emergency department patients with suspected pulmonary embolism.
  *J Thromb Haemost* 2004; 2(8):1247–1255.
- Kline J.A. *et al.* Prospective multicenter evaluation of the pulmonary
  embolism rule-out criteria. *J Thromb Haemost* 2008; 6(5):772–780.
- Freund Y. *et al.* PROPER trial. *JAMA* 2018; 319(6):559–566.
- NICE NG158. *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form pulmonary-embolism-rule-out-criteria
```
