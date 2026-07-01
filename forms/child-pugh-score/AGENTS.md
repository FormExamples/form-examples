# Child-Pugh Score (Child-Turcotte-Pugh) — Agent Instructions

Prognostic score for the severity of chronic liver disease (cirrhosis).
Collects five parameters via a single continuous single-page wizard — total
bilirubin, serum albumin, INR (or prothrombin time), ascites, and hepatic
encephalopathy — scores each 1, 2, or 3 points, sums a total of 5-15, and
assigns **Class A (5-6)**, **Class B (7-9)**, or **Class C (10-15)** with
associated survival and surgical-risk estimates.

See [`index.md`](./index.md) for the full design and the parameter-threshold and
assessment-step tables, and [`spec/index.md`](./spec/index.md) for the living
domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Child-Pugh, Pugh 1973, EASL, NICE)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `ChildPughAssessment` TypeScript type — the five parameter
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeChildPugh(data: ChildPughAssessment): {
    bilirubinPoint: 1 | 2 | 3;
    albuminPoint: 1 | 2 | 3;
    coagulationPoint: 1 | 2 | 3;
    ascitesPoint: 1 | 2 | 3;
    encephalopathyPoint: 1 | 2 | 3;
    childPughScore: number;              // 5..15
    childPughClass: 'A' | 'B' | 'C';
    oneYearSurvival: string;             // banded estimate
    twoYearSurvival: string;             // banded estimate
    surgicalRisk: 'low' | 'moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the five parameters maps to 1, 2, or 3 points
  against the thresholds in spec §4; the total 5-15 bands into class A/B/C. Each
  class carries fixed survival and surgical-risk estimates. See spec §4. A
  missing parameter cannot be scored, so the engine treats an incomplete
  parameter set as a partial score and raises a data-completeness flag.
  - bilirubin: `< 34` → 1, `34-50` → 2, `> 50` µmol/L → 3
  - albumin: `> 35` → 1, `28-35` → 2, `< 28` g/L → 3
  - coagulation (INR): `< 1.7` → 1, `1.7-2.3` → 2, `> 2.3` → 3
  - ascites: none → 1, mild → 2, moderate-to-severe → 3
  - encephalopathy: none → 1, grade 1-2 → 2, grade 3-4 → 3
- **Engine files:** `types.ts`, `utils.ts`, `child-pugh-rules.ts`,
  `child-pugh-grader.ts`, `flagged-issues.ts`.
- **Tests:** `child-pugh-grader.test.ts`, `child-pugh-rules.test.ts` — cover each
  threshold boundary (bilirubin 34/50, albumin 28/35, INR 1.7/2.3), each ordinal
  grade, and every class boundary (6/7, 9/10).

## Flagged issues

Computed independently of the total (see spec §5): decompensation / poor
prognosis (`childPughClass == 'C'`, high), transplant consideration
(`childPughClass == 'C'`, high), high surgical risk (`childPughClass in {B,C}`,
high/medium), hepatic encephalopathy (`encephalopathyPoint >= 2`, high),
refractory ascites (`ascitesPoint == 3`, high), severe coagulopathy
(`coagulationPoint == 3`, medium), incomplete assessment (any parameter input
missing, low).

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

- Child C.G., Turcotte J.G. Surgery and portal hypertension. 1964.
- Pugh R.N.H. *et al.* Transection of the oesophagus for bleeding oesophageal
  varices. *Br J Surg* 1973; 60(8):646-649.
- EASL Clinical Practice Guidelines: decompensated cirrhosis. *J Hepatol* 2018.
- NICE NG50. *Cirrhosis in over 16s: assessment and management.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form child-pugh-score
```
