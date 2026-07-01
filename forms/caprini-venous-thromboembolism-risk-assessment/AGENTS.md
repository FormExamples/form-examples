# Caprini Venous Thromboembolism Risk Assessment — Agent Instructions

VTE risk-stratification tool for surgical and medical inpatients. Collects a
checklist of weighted risk factors (1, 2, 3, or 5 points each) via a single
continuous single-page wizard, sums a total Caprini score, maps it to a risk
band (very low 0–1, low 2, moderate 3–4, high ≥ 5), and recommends a prophylaxis
strategy (early ambulation / mechanical / pharmacological). A high score prompts
pharmacological prophylaxis after a bleeding-risk check.

See [`index.md`](./index.md) for the full design and the risk-factor scoring
tables, and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Caprini 2005, ACCP, NICE NG89)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `CapriniAssessment` TypeScript type — the age band, the
  yes/no risk-factor inputs (1-, 2-, 3-, and 5-point groups), the bleeding-risk
  input, plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCaprini(data: CapriniAssessment): {
    factorPoints: FactorPoints[];   // each fired factor with its weight
    capriniScore: number;           // 0..40+
    riskBand: 'very-low' | 'low' | 'moderate' | 'high';
    recommendedProphylaxis:
      'early-ambulation' | 'mechanical'
      | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the age-band weight plus the fixed weight of
  every fired factor; the total maps to the risk band (0–1 → very-low, 2 → low,
  3–4 → moderate, ≥ 5 → high) and prophylaxis recommendation. See spec §4. A
  high bleeding risk downgrades any pharmacological recommendation to mechanical
  and raises a contraindication flag. A missing input contributes 0 points and
  raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `caprini-rules.ts`,
  `caprini-grader.ts`, `flagged-issues.ts`.
- **Tests:** `caprini-grader.test.ts`, `caprini-rules.test.ts` — cover each band
  boundary (score 1/2, 2/3, 4/5), the age-band weights, the bleeding-risk
  downgrade, and a representative fired-factor mix.

## Flagged issues

Computed independently of the total (see spec §5): high VTE risk
(`capriniScore >= 5`, high), bleeding-risk contraindication
(`highBleedingRisk == 'yes'` with moderate/high band, high), prior VTE
(`historyOfVte == 'yes'`, medium), known thrombophilia (any 3-point
thrombophilia factor, medium), incomplete assessment (any input unanswered,
low).

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

- Caprini J.A. Thrombosis risk assessment as a guide to quality patient care.
  *Disease-a-Month* 2005; 51(2–3):70–78.
- Gould M.K. *et al.* Prevention of VTE in Nonorthopedic Surgical Patients.
  ACCP Guidelines. *Chest* 2012; 141(2 Suppl):e227S–e277S.
- NICE NG89. *Venous thromboembolism in over 16s.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form caprini-venous-thromboembolism-risk-assessment
```
