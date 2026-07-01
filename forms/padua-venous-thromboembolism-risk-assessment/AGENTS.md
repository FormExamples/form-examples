# Padua Venous Thromboembolism Risk Assessment — Agent Instructions

VTE (venous thromboembolism) risk-stratification tool for hospitalised
**medical** patients. Collects eleven weighted risk factors via a single
continuous single-page wizard, sums a Padua Prediction Score of **0–20**, and
classifies **Padua ≥ 4** as **high risk** (consider pharmacological
thromboprophylaxis, subject to a bleeding-risk check) versus **< 4** as low
risk.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Barbar 2010, ACCP, NICE NG89)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `PaduaAssessment` TypeScript type — the eleven risk-factor
  inputs plus the bleeding-risk fields and context and identification fields.
- **Output shape:**
  ```ts
  gradePadua(data: PaduaAssessment): {
    factorPoints: Record<string, number>; // per-factor contribution
    paduaScore: number;                   // 0..20
    riskBand: 'low' | 'high';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
    prophylaxisRecommendation: 'pharmacological' | 'mechanical' | 'none';
  }
  ```
- **Algorithm:** additive weighted — each factor contributes its weight when
  present; the total 0–20 determines the risk band (`≥ 4` → `high`). See spec
  §4. A missing numeric input (`ageYears`, `bodyMassIndex`) contributes 0 points
  and raises a data-completeness flag.
  - active cancer (3), previous VTE (3), reduced mobility ≥ 3 days (3), known
    thrombophilia (3)
  - recent trauma/surgery ≤ 1 month (2)
  - age ≥ 70 (1), heart/respiratory failure (1), acute MI or ischaemic stroke
    (1), acute infection/rheumatological (1), obesity BMI ≥ 30 (1), ongoing
    hormonal treatment (1)
- **Engine files:** `types.ts`, `utils.ts`, `padua-rules.ts`,
  `padua-grader.ts`, `flagged-issues.ts`.
- **Tests:** `padua-grader.test.ts`, `padua-rules.test.ts` — cover each factor's
  contribution, the age 69/70 and BMI 29/30 boundaries, the score 3/4 band
  boundary, and the bleeding-risk gating of the recommendation.

## Flagged issues

Computed independently of the total (see spec §5): high VTE risk
(`paduaScore ≥ 4`, high), bleeding-risk contraindication (`activeBleeding` or
`highBleedingRisk` = yes, high), active cancer (medium), previous VTE (medium),
incomplete assessment (`ageYears` or `bodyMassIndex` missing, low). The
bleeding-risk fields gate `prophylaxisRecommendation` but never change
`paduaScore`.

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

- Barbar S. *et al.* A risk assessment model for the identification of
  hospitalized medical patients at risk for venous thromboembolism: the Padua
  Prediction Score. *J Thromb Haemost* 2010; 8(11):2450–2457.
- Kahn S.R. *et al.* Prevention of VTE in Nonsurgical Patients (ACCP, 9th ed.).
  *Chest* 2012; 141(2 Suppl):e195S–e226S.
- NICE NG89. *Venous thromboembolism in over 16s* (2018, updated 2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form padua-venous-thromboembolism-risk-assessment
```
