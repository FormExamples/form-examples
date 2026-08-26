# Structured Medication Review (SMR) — Agent Instructions

Comprehensive, patient-centred medication review (NHS England PCN service) for
people with problematic polypharmacy, frailty, long-term conditions, or high-risk
medicines. Collects the patient's problems and priorities, every medicine with
its indication and adherence, deprescribing opportunities, anticholinergic
burden, high-risk-medicine checks, monitoring due, and shared decisions and
agreed actions via a single continuous single-page wizard. It reports a **review
status** (Complete / Incomplete), a **polypharmacy + anticholinergic burden
indicator**, and a set of **flags**. Documentation instrument with partial
scoring — it prompts action; the prescriber decides.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (NHS SMR guidance, STOPP/START,
  ACB scale)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `SmrReview` TypeScript type — the review context and
  identification fields, problems / goals / plan fields, and a repeating
  `medicines: SmrMedicine[]` list.
- **Output shape:**
  ```ts
  gradeSmr(data: SmrReview): {
    medicineCount: number;
    regularMedicineCount: number;
    anticholinergicBurdenScore: number;      // sum of per-medicine ACB points
    polypharmacyBand: 'none' | 'polypharmacy' | 'hyperpolypharmacy';
    anticholinergicBand: 'low' | 'significant';
    burdenBand: 'low' | 'moderate' | 'high';
    reviewStatus: 'complete' | 'incomplete';
    stopFlags: StoppFlag[];
    startFlags: StartFlag[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** documentation with partial scoring. Sum each medicine's
  anticholinergic burden points (0–3) into `anticholinergicBurdenScore`; count
  regular medicines into `regularMedicineCount`. `burdenBand` is the worse of the
  polypharmacy band (`none` < 5, `polypharmacy` 5–9, `hyperpolypharmacy` ≥ 10) and
  the anticholinergic band (`significant` when ACB ≥ 3) — a max-band rule.
  `reviewStatus` is `complete` only when every required section is filled (see
  spec §4). STOPP / START flags are one per fired criterion. See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `smr-rules.ts`, `smr-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `smr-grader.test.ts`, `smr-rules.test.ts` — cover the polypharmacy
  boundaries (4/5, 9/10 regular medicines), the ACB boundary (2/3), the composite
  burden band, review-status completeness, and every flagged issue.

## Flagged issues

Computed independently of the bands (see spec §5): high anticholinergic burden
(`anticholinergicBurdenScore >= 3`, high), STOPP trigger (any `stoppCriterion`,
high), START omission (any `startCriterion`, medium), missing monitoring
(`monitoringRequired == 'yes'` and `monitoringUpToDate == 'no'`, or
`overdueMonitoringCount > 0`, high), adherence concern (`adherence` partial/poor,
medium), high-risk medicine without indication (`isHighRisk == 'yes'` and no
recorded indication, high), incomplete review (`reviewStatus == 'incomplete'`,
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
- The medicine list is a one-to-many child table of the review.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- NHS England. *Structured Medication Reviews and Medicines Optimization:
  guidance* (Network Contract DES).
- O'Mahony D. *et al.* STOPP/START criteria version 3. *Age and Ageing* 2023.
- Boustani M. *et al.* Anticholinergic Cognitive Burden (ACB) scale.
- NICE NG5 *Medicines optimization*; NICE NG197 *Shared decision making*.
- PrescQIPP / NHS *Polypharmacy: Getting our medicines right.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form structured-medication-review
```
