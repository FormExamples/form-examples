# Model for End-Stage Liver Disease (MELD) Score — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `model-for-end-stage-liver-disease-score`

## 1. Purpose

A laboratory-based severity calculator for chronic liver disease. It takes total
bilirubin, INR, serum creatinine, and (for MELD-Na) serum sodium, applies a
weighted logarithmic formula with a dialysis creatinine rule and value bounds,
and produces an integer score of **6–40** mapped to an estimated 3-month
mortality band. Higher scores indicate more severe disease and inform liver
transplant prioritisation. It is a decision-support calculator, not a diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine (MELD, MELD-Na, MELD 3.0), two
consolidated front-ends (`front-end-with-html`, `front-end-with-svelte`), the
Rust Loco JSON-API crate, and the generated representations (XML, FHIR R5,
protobuf, OpenAPI). Out of scope: hosted deployment, authentication,
multi-tenancy, paediatric scoring (PELD), and live UNOS allocation logic.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | hepatologist / gastroenterologist / transplant-coordinator / intensivist / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | hepatology-clinic / transplant-unit / intensive-care / ward / other |
| `meldVariant` | enum | meld / meld-na / meld-3 |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | female / male (used by MELD 3.0) |

**Laboratory inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `bilirubin` | numeric | total bilirubin |
| `bilirubinUnit` | enum | `mg/dL` or `umol/L` |
| `inr` | numeric | international normalised ratio |
| `creatinine` | numeric | serum creatinine |
| `creatinineUnit` | enum | `mg/dL` or `umol/L` |
| `dialysisSessionsPastWeek` | numeric | count of haemodialysis sessions in the past 7 days |
| `cvvhd24h` | enum | yes/no — ≥ 24 h CVVHD in the past 7 days |
| `sodium` | numeric | serum sodium, mEq/L (MELD-Na, MELD 3.0) |
| `albumin` | numeric | serum albumin, g/dL (MELD 3.0) |

**Derived (never stored as input).** `bilirubinMgDl`, `creatinineMgDl`,
`creatinineAdjusted`, `dialysisRuleApplied`, `meldScore`, `mortalityBand`,
`estimatedMortalityPercent`, `flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. All logs are natural logarithms.

**Step 1 — unit conversion.** Convert to mg/dL:
`bilirubinMgDl = bilirubinUnit == 'umol/L' ? bilirubin / 17.1 : bilirubin`;
`creatinineMgDl = creatinineUnit == 'umol/L' ? creatinine / 88.4 : creatinine`.

**Step 2 — dialysis rule.** If `dialysisSessionsPastWeek >= 2` or
`cvvhd24h == 'yes'`, set `creatinineAdjusted = 4.0` and
`dialysisRuleApplied = true`; otherwise `creatinineAdjusted = creatinineMgDl`.

**Step 3 — bounds.** Lower-bound each of bilirubin, INR, and creatinine to 1.0;
upper-bound creatinine to 4.0:

```
b = max(bilirubinMgDl, 1.0)
i = max(inr, 1.0)
c = min(max(creatinineAdjusted, 1.0), 4.0)
```

**Step 4 — base MELD.**

```
meld = round(3.78·ln(b) + 11.2·ln(i) + 9.57·ln(c) + 6.43)
```

**Step 5 — sodium correction (MELD-Na, when meldVariant != 'meld').** Clamp
sodium to 125–137, then apply only when the base MELD > 11:

```
na = min(max(sodium, 125), 137)
if meld > 11:
  meldNa = meld + 1.32·(137 − na) − (0.033·meld·(137 − na))
  meld = round(meldNa)
```

**Step 6 — MELD 3.0 (when meldVariant == 'meld-3').** Uses sex and albumin with
creatinine capped at 3.0 and albumin clamped to 1.5–3.5; coefficients per Kim
*et al.* 2021 (female indicator, bilirubin·sodium and creatinine·albumin
interaction terms). Documented in the engine's `meld-rules.ts`.

**Step 7 — clamp.** `meldScore = min(max(meld, 6), 40)`.

**Step 8 — band.** Map to a mortality band: `≤9` low (~2 %), `10–19` moderate
(~6 %), `20–29` high (~20 %), `30–39` very high (~53 %), `≥40` extreme (~71 %).

- Any missing lab input required by the chosen variant leaves `meldScore = null`
  and raises an incomplete-assessment flag rather than computing a partial score.

## 5. Flagged issues (red flags)

Emitted with a priority alongside the score:

- **Transplant referral** (high) — `meldScore >= 15`: severity at or above the
  conventional threshold for transplant benefit; refer to / discuss with a
  transplant centre.
- **Urgent review** (high) — `meldScore >= 30`: very high short-term mortality;
  urgent hepatology / critical-care review.
- **On dialysis / renal failure** (high) — dialysis rule applied: creatinine set
  to 4.0; significant renal impairment.
- **Hyponatraemia** (medium) — `sodium < 130`: low serum sodium raises mortality
  risk independently and increases MELD-Na.
- **Coagulopathy** (medium) — `inr >= 2.5`: marked derangement of clotting.
- **Incomplete assessment** (low) — a lab input required by the chosen variant is
  missing: no score is produced; complete and re-calculate.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A result object emitted by the engine:

```ts
{
  bilirubinMgDl: number | null;
  creatinineMgDl: number | null;
  creatinineAdjusted: number | null;
  dialysisRuleApplied: boolean;
  meldScore: number | null;          // 6..40 when computable
  mortalityBand: 'low' | 'moderate' | 'high' | 'very-high' | 'extreme' | '';
  estimatedMortalityPercent: number | null;
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

- `bin/test-form model-for-end-stage-liver-disease-score` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering the lower bound (values < 1.0 → 1.0), the creatinine cap (4.0), the
  dialysis rule (≥ 2 sessions and CVVHD), unit conversion, the 6–40 clamp, the
  MELD-Na sodium correction (including the `meld > 11` gate and the 125–137
  bounds), and each mortality band boundary.
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

- [`index.md`](../index.md) — form description and calculation details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form model-for-end-stage-liver-disease-score
```
