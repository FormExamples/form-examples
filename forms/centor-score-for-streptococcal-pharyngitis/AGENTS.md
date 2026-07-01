# Centor Score for Streptococcal Pharyngitis — Agent Instructions

A clinical prediction tool that estimates the likelihood that an acute sore
throat is caused by group A beta-haemolytic streptococcus (GABHS) and therefore
whether antibiotics are likely to help. Collects four objective Centor criteria
via a single continuous single-page wizard — tonsillar exudate, tender anterior
cervical lymphadenopathy, fever (> 38 °C or history of fever), and absence of
cough — each scoring 0 or 1 for a Centor total of 0–4, then applies the McIsaac
age modifier (+1 ages 3–14, 0 ages 15–44, −1 ages ≥ 45) for a modified score of
−1 to 5. The score bands guide testing and antibiotic decisions. UK primary care
may use FeverPAIN as an alternative tool (NICE NG84).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Centor, McIsaac, NICE NG84)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `CentorAssessment` TypeScript type — the four criterion
  inputs, optional measured temperature, patient age, plus context,
  identification, and red-flag fields.
- **Output shape:**
  ```ts
  gradeCentor(data: CentorAssessment): {
    tonsillarExudatePoint: 0 | 1;
    tenderNodesPoint: 0 | 1;
    feverPoint: 0 | 1;
    coughAbsentPoint: 0 | 1;
    centorScore: 0 | 1 | 2 | 3 | 4;
    ageModifier: -1 | 0 | 1;
    mcIsaacScore: number; // -1..5
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the Centor total
  0–4 plus the McIsaac age modifier gives the modified score −1 to 5, which
  determines the risk band (`≤ 1` → low, `2–3` → moderate, `4–5` → high). See
  spec §4.
  - tonsillar exudate = yes → 1
  - tender anterior cervical nodes = yes → 1
  - fever = yes, or measured temperature > 38 °C → 1
  - cough absent = yes → 1
  - age 3–14 → +1; 15–44 → 0; ≥ 45 → −1 (missing age → 0)
- **Engine files:** `types.ts`, `utils.ts`, `centor-rules.ts`,
  `centor-grader.ts`, `flagged-issues.ts`.
- **Tests:** `centor-grader.test.ts`, `centor-rules.test.ts` — cover the fever
  boundary (38.0/38.1 °C), each age-modifier boundary (2/3, 14/15, 44/45 years),
  every Centor total 0–4, and the full McIsaac range −1 to 5.

## Flagged issues

Computed independently of the total (see spec §5): airway/quinsy red flag (any
red-flag input = yes, high), antibiotic consideration (`mcIsaacScore >= 4`,
high), testing consideration (`mcIsaacScore` 2–3, medium), antimicrobial
stewardship (`mcIsaacScore <= 1`, low), incomplete assessment (any criterion
input or age missing, low).

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

- Centor R.M. *et al.* The diagnosis of strep throat in adults in the emergency
  room. *Medical Decision Making* 1981; 1(3):239–246.
- McIsaac W.J. *et al.* A clinical score to reduce unnecessary antibiotic use in
  patients with sore throat. *CMAJ* 1998; 158(1):75–83.
- McIsaac W.J. *et al.* Empirical validation of guidelines for the management of
  pharyngitis. *JAMA* 2004; 291(13):1587–1595.
- NICE NG84. *Sore throat (acute): antimicrobial prescribing* (2018).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form centor-score-for-streptococcal-pharyngitis
```
