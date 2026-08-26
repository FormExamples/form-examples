# Pre-operative Assessment by Clinician — Agent Instructions

Clinician-driven pre-operative assessment. Collects **objective findings** via a
16-step single-page wizard, computes an ASA Physical Status grade (I–VI) plus
Mallampati, RCRI, STOP-BANG, Clinical Frailty Scale, Fried Frailty Phenotype,
and Risk Analysis Index, produces a composite perioperative risk (Low /
Moderate / High / Critical) and a set of safety flags — including GLP-1
receptor agonist perioperative management and frailty-intersection risks (see
[`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md))
— and emits a signed anaesthesia plan.

See [`index.md`](./index.md) for the full design and the 16-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (ASA rules, OSCE guide,
  CPOC alignment, safety-case notes, NICE NG45 mapping)
- `./seeds/` — source documents (CPOC PDF)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./front-end-with-html/` — static single-page clinician wizard (`index.html`)
  + review dashboard (`dashboard.html`); Lily Design System, no build
- `./front-end-with-svelte/` — SvelteKit single-page wizard + SVAR DataGrid
  review dashboard; routes nested under `src/routes/<form-kebab-case>/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API back-end; crate source
  under `src/<form_snake_case>/`

## Scoring engine

- **Input shape:** `ClinicianAssessment` TypeScript type containing 11
  body-system sub-types plus surgical, anaesthesia-plan, and clinician-
  identification fields.
- **Output shape:**
  ```ts
  calculateASA(data: ClinicianAssessment): {
    asaGrade: 1 | 2 | 3 | 4 | 5 | 6;
    mallampatiClass: 1 | 2 | 3 | 4 | null;
    rcriScore: number;    // 0..6
    stopBangScore: number; // 0..8
    frailtyScale: number | null; // 1..9
    friedPhenotypeScore: number | null; // 0..5
    friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
    compositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade; ASA I
  is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `asa-rules.ts`, `mallampati-rules.ts`,
  `rcri-rules.ts`, `stopbang-rules.ts`, `frailty-rules.ts` (also exports
  `computeFriedPhenotypeScore()`), `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `asa-rules.test.ts`.

## Clinician-only rules

These rules have no patient-self-report analogue and depend on clinician
observation:

- **Airway flag** — Mallampati ≥ III → difficult-airway flag (high priority).
- **Severe cardiac flag** — echo EF < 40 % → severe-cardiac flag (high).
- **Coagulopathy flag** — INR > 1.5 off anticoagulants → bleeding-risk flag (high).
- **Severe respiratory flag** — SpO₂ < 92 % on room air at rest (high).
- **Severe frailty flag** — Clinical Frailty Scale ≥ 7 (high).
- **Recent COVID-19 flag** — < 7 weeks since acute infection with unresolved
  symptoms (high).
- **Fasting violation** — clinician confirmation that the patient is not
  adequately fasted for general anaesthesia (high).
- **GLP-1 aspiration risk** — on a GLP-1 receptor agonist with active GI
  symptoms, or not held/fasting-extended per guideline (high).
- **Cognitive assessment indicated** — CFS ≥ 5 without a Mini-Cog performed
  (medium).
- **Sarcopenia risk** — frail (Fried "frail" or CFS ≥ 5) and on a GLP-1
  receptor agonist (medium).
- **Dehydration/AKI risk** — frail, on a GLP-1 receptor agonist, and
  reporting active GI symptoms (high).
- **Rebound glycaemic risk** — a held/fasting-extended GLP-1 receptor
  agonist in a patient on insulin (medium).

  See [`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md)
  for the full clinical rationale and sources.

## Clinician override

The ASA engine produces a computed grade. The clinician may override on
step 16 with a documented reason. Both the **computed** grade and the
**final** grade are stored and rendered in the PDF report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.
- The data-entry UI lives in the consolidated `front-end-with-html/` and
  `front-end-with-svelte/` directories per the monorepo convention even though
  the operator is a clinician.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- Dynamic step route `/assessment/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–16.

## Clinician-dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (ASA grade, composite risk, urgency).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Clinical grounding

- Centre for Perioperative Care (CPOC) *Preoperative Assessment and
  Optimization for Adult Surgery* (June 2021) — `seeds/`.
- Geeky Medics *Anaesthetic Pre-operative Assessment OSCE Guide*.
- ASA Physical Status Classification.
- NICE NG45 *Routine preoperative tests for elective surgery*.
- AAGBI / RCoA pre-operative assessment guidance.
- British Geriatrics Society frailty-screening guidance; Fried Frailty
  Phenotype (2001); Risk Analysis Index.
- ASA consensus-based guidance on preoperative GLP-1 receptor agonist
  management; UK MHRA drug safety update on GLP-1 aspiration risk. See
  [`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form pre-operative-assessment-by-clinician
```
