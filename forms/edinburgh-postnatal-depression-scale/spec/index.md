# Edinburgh Postnatal Depression Scale (EPDS) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `edinburgh-postnatal-depression-scale`

## 1. Purpose

A 10-item self-report screen for perinatal (antenatal and postnatal) depression.
The respondent rates ten statements about the past seven days; each item scores
0–3 and the ten scores sum to a total of 0–30. A total of **≥ 10** suggests
possible depression and **≥ 13** likely depression, either of which prompts
further clinical assessment. Item 10 (thoughts of self-harm) additionally
triggers a **mandatory safety flag whenever it scores > 0**, independent of the
total. The EPDS is a screen, not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, diagnostic
classification, and formal suicide-risk assessment (the form flags risk and
directs to a risk assessment; it does not perform one).

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | administering clinician |
| `clinicianRole` | enum | midwife / health-visitor / gp / perinatal-mh / other |
| `careSetting` | enum | maternity / community / general-practice / perinatal-mh / other |
| `assessedAt` | timestamp | date and time of assessment |
| `perinatalStage` | enum | antenatal / postnatal |
| `perinatalWeek` | numeric | gestational week (antenatal) or postnatal week |
| `respondentIdentifier` | text | local identifier |
| `ageBand` | enum | respondent age band |
| `preferredLanguage` | text | language the EPDS was completed in |
| `assistanceNeeded` | enum | none / interpreter / clinician-read / other |

**Item responses.** Each item is stored as its **already-reverse-corrected**
score, an integer 0–3 where higher = more symptomatic (see §4 for the
option→score mapping).

| Field | Type | Item | Direction |
| --- | --- | --- | --- |
| `item1` | numeric 0–3 | able to laugh | normal |
| `item2` | numeric 0–3 | looked forward with enjoyment | normal |
| `item3` | numeric 0–3 | blamed myself unnecessarily | reverse |
| `item4` | numeric 0–3 | anxious or worried | normal |
| `item5` | numeric 0–3 | scared or panicky | reverse |
| `item6` | numeric 0–3 | things getting on top of me | reverse |
| `item7` | numeric 0–3 | unhappy, difficulty sleeping | reverse |
| `item8` | numeric 0–3 | sad or miserable | reverse |
| `item9` | numeric 0–3 | so unhappy, crying | reverse |
| `item10` | numeric 0–3 | thoughts of self-harm | reverse |

**Derived (never stored as input).** `itemScores[]`, `totalScore`, `band`,
`selfHarmFlag`, `firedItems[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O.

**Option→score mapping.** Each item presents four ordered options `optionIndex`
0..3 (top to bottom as printed). For **normal** items (1, 2, 4) the score equals
the option index; for **reverse** items (3, 5, 6, 7, 8, 9, 10) the score is
`3 - optionIndex`. The stored `item1..item10` values are the resulting 0–3
scores, so the grader below operates directly on them.

```
itemScores = [item1, item2, item3, item4, item5,
              item6, item7, item8, item9, item10]   // each 0..3, null → 0

totalScore = sum(itemScores over non-null items)     // 0..30

band = totalScore >= 13 ? 'likely'
     : totalScore >= 10 ? 'possible'
     :                    'lower'

selfHarmFlag = item10 != null && item10 > 0          // independent of total
```

- A missing item response contributes 0 to the total and raises a
  data-completeness flag; the total can understate risk.
- `selfHarmFlag` is evaluated **regardless of the total** and always drives the
  urgent flagged issue in §5.

## 5. Flagged issues (red flags)

Emitted independently of the band, each with a priority:

- **Self-harm risk** (urgent) — `item10 > 0`: any thoughts of self-harm; perform
  an immediate suicide / self-harm risk assessment and safeguarding action,
  **regardless of the total score**. Overrides all other bands.
- **Likely depression** (high) — `totalScore >= 13`: positive at the specific
  threshold; arrange clinician assessment and refer per local pathway.
- **Possible depression** (medium) — `totalScore >= 10`: positive at the
  sensitive threshold; arrange further assessment and repeat / refer.
- **Elevated anxiety** (low) — items 3, 4 and 5 sum high (anxiety subscale):
  consider perinatal anxiety alongside depression screening.
- **Incomplete assessment** (low) — any of the ten item responses missing: score
  may understate risk; re-administer the missing items.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  itemScores: number[];        // ten entries, each 0..3
  totalScore: number;          // 0..30
  band: 'lower' | 'possible' | 'likely';
  selfHarmFlag: boolean;       // item10 > 0
  firedItems: FiredItem[];
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form edinburgh-postnatal-depression-scale` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, covering
  the reverse-score option mapping for each item, the band boundaries (9/10 and
  12/13), the full 0–30 range, and the item-10 safety flag for every non-zero
  response.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form edinburgh-postnatal-depression-scale
```
