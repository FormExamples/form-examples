# CURB-65 Pneumonia Severity Score — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
backend) must satisfy. Treat it as the source of truth for behaviour — update the
spec before changing code.

Slug: `curb-65-pneumonia-severity-score`

## 1. Purpose

A clinician-facing severity assessment for adults with community-acquired
pneumonia (CAP). It records the five CURB-65 criteria, computes a 0–5 score
(one point per criterion), assigns a mortality-risk band, and recommends a
site-of-care disposition. Where serum urea is unavailable, the four-criterion
CRB-65 primary-care variant (0–4) is computed instead.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, two consolidated front-ends (HTML + Lily
and SvelteKit + Lily, each with wizard + dashboard), and the Rust Loco JSON API
crate. Out of scope: hosted deployment, authentication, multi-tenancy, and the
antimicrobial-prescribing decision (which is downstream of the severity score).

## 3. Data model

One assessment row plus a grading result and its fired flags.

- **assessment** — encounter and clinician identification, patient identifier,
  date of birth, sex, and the raw criterion inputs:
  - `confusion_present` (boolean, nullable) — new-onset confusion
  - `amt_score` (int, nullable, 0–10) — supporting evidence for confusion
  - `urea_mmol_l` (numeric, nullable) — serum urea; `urea_measured` (boolean)
  - `respiratory_rate` (int, nullable) — breaths per minute
  - `systolic_bp` (int, nullable), `diastolic_bp` (int, nullable) — mmHg
  - `age_years` (int, nullable) — derived from date of birth, confirmed
  - advisory adjuncts (not scored): `oxygen_saturation`, `temperature_c`,
    `significant_comorbidity`, `multilobar_changes`
  - `clinician_override_band` (enum, nullable), `override_reason` (text)
- **grading_result** — computed `curb65_score` (0–5), `crb65_score` (0–4,
  nullable when urea measured), `risk_band` (low / intermediate / high),
  `recommended_disposition` (enum), and the boolean per-criterion breakdown.
- **grading_flag** — zero or more advisory flags (see §5), each with a
  `code`, `priority` (high / medium / low), and human-readable `message`.

All tables carry UUIDv4 primary keys and `created_at` / `updated_at` /
`deleted_at` timestamps. Unanswered text/enum default to `''`; unanswered
numeric/date/time default to `null`.

## 4. Algorithm

Pure function, no I/O:

```
curb65Score = C + U + R + B + A65
  C   = confusionPresent === true                          ? 1 : 0
  U   = ureaMeasured && ureaMmolL  > 7                      ? 1 : 0
  R   = respiratoryRate            >= 30                    ? 1 : 0
  B   = (systolicBp < 90) || (diastolicBp <= 60)            ? 1 : 0
  A65 = ageYears                   >= 65                    ? 1 : 0
```

- **Missing input:** a criterion whose inputs are `null` scores 0 but raises a
  low-priority `incomplete-criterion` flag so the total is not silently
  under-counted.
- **CRB-65 fallback:** when `ureaMeasured === false`, compute `crb65Score`
  from C + R + B + A65 (0–4) and band it on the CRB-65 scale; `curb65Score` is
  left partial and the report presents CRB-65 as the primary result.
- **Banding (CURB-65):** 0–1 → low; 2 → intermediate; 3–5 → high.
- **Banding (CRB-65):** 0 → low; 1–2 → intermediate; 3–4 → high.
- **Disposition:** low → consider home/outpatient; intermediate → consider
  short-stay/supervised; high → hospitalize (scores 4–5 add an ICU/HDU review
  flag).
- **Override:** a clinician may set a final disposition band with a documented
  reason; both computed and final are stored and rendered.

## 5. Flagged issues

Fired independently of the numeric band; priority high / medium / low.

- **`high-severity-admit`** (high) — score ≥ 3: manage as severe CAP, hospitalize.
- **`consider-icu`** (high) — score 4–5: assess for intensive-care / HDU admission.
- **`hypotension`** (high) — systolic < 90 or diastolic ≤ 60 mmHg (shock risk;
  fires regardless of total).
- **`new-confusion`** (high) — new-onset confusion present (possible sepsis /
  hypoxia; consider urgent review).
- **`hypoxia`** (medium) — advisory SpO₂ < 92% recorded (oxygenation concern
  independent of CURB-65).
- **`incomplete-criterion`** (low) — one or more criterion inputs missing.

## 6. Inputs and outputs

**Input.** A typed assessment object mirroring the SQL schema. Unanswered
text/enum → `''`; unanswered numeric/date/time → `null`.

**Output.** A grading object: `curb65Score`, optional `crb65Score`, `riskBand`,
`recommendedDisposition`, per-criterion breakdown, `firedFlags[]`, and a
clinical report. Rendered as HTML, exportable to PDF, and convertible to FHIR R5
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

- `bin/test-form curb-65-pneumonia-severity-score` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- Boundary cases are covered: urea exactly 7 (negative), RR exactly 30
  (positive), systolic exactly 90 (negative), diastolic exactly 60 (positive),
  age exactly 65 (positive).
- The HTML front-ends conform to the Lily HTML headless contract; the SvelteKit
  front-ends conform to the Lily Svelte headless contract and pass `pnpm check`
  and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR), UK Medical
Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA *Software and AI as a
Medical Device*. Form-specific classification (Class IIa where output drives the
site-of-care decision) is recorded in [`index.md`](../index.md).

## 10. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form curb-65-pneumonia-severity-score
```
