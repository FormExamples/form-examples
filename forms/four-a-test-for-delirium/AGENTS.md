# 4AT — Rapid Delirium and Cognitive-Impairment Screen — Agent Instructions

Rapid bedside delirium and cognitive-impairment screen. Collects four item
responses via a single-page wizard, computes a total score (0–12), assigns one
of three interpretation bands (possible delirium ± cognitive impairment / possible
cognitive impairment / unlikely), and emits a screening report with flagged
issues.

See [`index.md`](./index.md) for the full design and the four-item scoring table.

## Directory map

- `./index.md` — project overview and scoring table
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (4AT scoring rules, validation
  evidence, NICE / SIGN alignment)
- `./sql/` — Liquibase-formatted Postgres schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `FourATAssessment` TypeScript type mirroring the SQL schema —
  four enum item responses plus identification and context fields.
- **Output shape:**
  ```ts
  scoreFourAT(data: FourATAssessment): {
    item1Score: 0 | 4;         // alertness
    item2Score: 0 | 1 | 2;     // AMT4
    item3Score: 0 | 1 | 2;     // attention (months backwards)
    item4Score: 0 | 4;         // acute change / fluctuating course
    totalScore: number;        // 0..12
    interpretationBand: 'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium';
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** sum-of-items. Per-item point map:
  - Item 1 (alertness): `normal` → 0, `mildTransient` → 0, `abnormal` → 4.
  - Item 2 (AMT4): `noMistakes` → 0, `oneMistake` → 1,
    `twoOrMoreOrUntestable` → 2.
  - Item 3 (attention): `sevenOrMore` → 0,
    `startsButUnderSevenOrRefuses` → 1, `untestable` → 2.
  - Item 4 (acute change): `no` → 0, `yes` → 4.
  - `totalScore = item1 + item2 + item3 + item4` (0–12).
  - Band: `>= 4` → `possibleDelirium`; `1–3` → `possibleCognitiveImpairment`;
    `0` → `unlikely`.
- **Engine files:** `types.ts`, `utils.ts`, `fourat-rules.ts`,
  `fourat-grader.ts`, `flagged-issues.ts`.
- **Tests:** `fourat-grader.test.ts`, `fourat-rules.test.ts`.

## Flagged issues

Fire independently of the interpretation band (priority high / medium / low):

- **possibleDelirium** (high) — `totalScore >= 4`; full delirium assessment and
  precipitant search.
- **abnormalAlertness** (high) — `alertness === 'abnormal'`; urgent clinical
  review regardless of total.
- **acuteChangePresent** (high) — `acuteChange === 'yes'`; strong delirium
  pointer.
- **possibleCognitiveImpairment** (medium) — `totalScore` in 1–3; further
  cognitive assessment and collateral history.
- **incompleteAcuteChange** (medium) — item 4 information not reliably obtained
  and `totalScore === 0`; delirium is not excluded.

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
- One continuous single-page wizard; no multi-page forms.

## Clinical grounding

- The 4 'A's Test (4AT). <https://www.the4at.com>.
- Bellelli G. *et al.* *Age and Ageing* 2014; 43:496–502.
- Shenkin S.D. *et al.* *BMC Medicine* 2019; 17:138.
- NICE CG103 *Delirium*; SIGN 157 *Risk reduction and management of delirium*.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form four-a-test-for-delirium
```
