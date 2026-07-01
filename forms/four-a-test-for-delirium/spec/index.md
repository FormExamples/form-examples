# 4AT — Rapid Delirium and Cognitive-Impairment Screen — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
backend) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `four-a-test-for-delirium`

## 1. Purpose

A rapid bedside screen for delirium and possible cognitive impairment. The form
records four item responses, computes a total score (0–12), assigns one of three
interpretation bands, and emits a screening report with flagged issues. It is a
screening aid, not a diagnostic test; a positive result triggers full clinical
assessment against DSM-5 / ICD-10 delirium criteria.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), and the Rust `back-end-with-loco`
JSON API. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Data model

One assessment record. Fields (camelCase in TypeScript / front-end serde;
snake_case in SQL / Rust):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | primary key, `gen_random_uuid()` |
| `patientIdentifier` | text | `''` when unanswered |
| `patientName` | text | `''` when unanswered |
| `dateOfBirth` | date | `null` when unanswered |
| `assessmentDate` | date | `null` when unanswered |
| `assessmentTime` | time | `null` when unanswered |
| `setting` | enum text | acute / ed / periop / careHome / community / other; `''` when unanswered |
| `assessorName` | text | `''` when unanswered |
| `assessorRole` | text | `''` when unanswered |
| `alertness` | enum text | `normal` \| `mildTransient` \| `abnormal` |
| `amt4` | enum text | `noMistakes` \| `oneMistake` \| `twoOrMoreOrUntestable` |
| `attentionMonths` | enum text | `sevenOrMore` \| `startsButUnderSevenOrRefuses` \| `untestable` |
| `acuteChange` | enum text | `no` \| `yes` |
| `acuteChangeSource` | enum text | patient / collateral / records / none; `''` when unanswered |
| `clinicalNotes` | text | `''` when unanswered |
| `created_at` `updated_at` `deleted_at` | timestamptz | audit columns |

Item scores and the computed total are derived by the engine and stored on a
grading-result row (`item1_score`, `item2_score`, `item3_score`, `item4_score`,
`total_score`, `interpretation_band`).

## 4. Algorithm

Pure function `scoreFourAT(data: FourATAssessment): FourATResult`.

Per-item point map:

- **Item 1 — alertness:** `normal` → 0, `mildTransient` → 0, `abnormal` → 4.
- **Item 2 — AMT4:** `noMistakes` → 0, `oneMistake` → 1,
  `twoOrMoreOrUntestable` → 2.
- **Item 3 — attention:** `sevenOrMore` → 0,
  `startsButUnderSevenOrRefuses` → 1, `untestable` → 2.
- **Item 4 — acute change:** `no` → 0, `yes` → 4.

`totalScore = item1 + item2 + item3 + item4` (range 0–12).

Band assignment:

- `totalScore >= 4` → `possibleDelirium` ("possible delirium ± cognitive
  impairment").
- `totalScore` in 1–3 → `possibleCognitiveImpairment`.
- `totalScore === 0` → `unlikely` ("delirium or severe cognitive impairment
  unlikely; still possible if item 4 information incomplete").

The engine is pure: no I/O, no side effects, deterministic. Unanswered items are
treated as unscored; the report indicates incompleteness rather than assuming 0.

## 5. Flagged issues

Computed independently of the band, each with `priority` (high / medium / low):

- **possibleDelirium** (high) — `totalScore >= 4`; full delirium work-up and
  precipitant search.
- **abnormalAlertness** (high) — `alertness === 'abnormal'`; urgent clinical
  review regardless of total.
- **acuteChangePresent** (high) — `acuteChange === 'yes'`; strong delirium
  pointer.
- **possibleCognitiveImpairment** (medium) — `totalScore` in 1–3; further
  cognitive assessment and collateral history.
- **incompleteAcuteChange** (medium) — `acuteChange === ''` or
  `acuteChangeSource === 'none'` with `totalScore === 0`; score of 0 does not
  exclude delirium.

## 6. Inputs and outputs

**Input.** A `FourATAssessment` object whose shape mirrors the SQL schema in
`sql/`. Unanswered text and enum fields default to `''`; unanswered numeric,
date, and time fields default to `null`.

**Output.** A `FourATResult`:

```ts
scoreFourAT(data: FourATAssessment): {
  item1Score: 0 | 4;
  item2Score: 0 | 1 | 2;
  item3Score: 0 | 1 | 2;
  item4Score: 0 | 4;
  totalScore: number; // 0..12
  interpretationBand: 'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium';
  firedRules: FiredRule[];
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser, exported as PDF, and convertible to FHIR R5
Bundle, XML, JSON, CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) — not implemented |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) — not implemented |
| `back-end-with-loco` | Rust + Loco JSON API — not implemented |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script)
are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md)
§Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form four-a-test-for-delirium` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK
Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and
AI as a Medical Device.

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form four-a-test-for-delirium
```
