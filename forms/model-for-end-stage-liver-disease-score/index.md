# Model for End-Stage Liver Disease (MELD) Score

A laboratory-based severity calculator for chronic liver disease. It takes a
small number of objective blood results — **total bilirubin**, **INR**,
**serum creatinine**, and (for MELD-Na) **serum sodium** — applies a validated
weighted logarithmic formula, and produces an integer score of **6–40** that
maps to an estimated **3-month mortality**. A higher score indicates more
severe liver dysfunction and greater short-term mortality risk. The score is
used to stratify disease severity and to prioritize candidates for liver
transplantation.

MELD was derived to predict survival after a transjugular intrahepatic
portosystemic shunt (Malinchoc *et al.*, *Hepatology* 2000) and adopted by the
United Network for Organ Sharing (UNOS) in 2002 to allocate deceased-donor
livers. MELD-Na (Kim *et al.*, *NEJM* 2008) adds serum sodium and became the
UNOS standard in 2016. MELD 3.0 (Kim *et al.*, *Gastroenterology* 2021) further
adds patient sex and serum albumin. This form calculates MELD and MELD-Na as
the primary instruments and supports MELD 3.0 as an extended variant.

## Scope and intended users

- **Setting:** hepatology and gastroenterology clinics, liver transplant units
  and waiting-list management, intensive care, and acute medical wards managing
  decompensated cirrhosis or acute liver failure.
- **Users:** hepatologists, gastroenterologists, transplant coordinators,
  intensivists, and other clinicians managing chronic liver disease.
- **Patients:** adults with chronic liver disease being assessed for severity or
  transplant prioritization.
- **Not for:** paediatric transplant prioritization (use PELD), acute liver
  failure allocation (handled by separate status-1 criteria), or as a
  standalone substitute for full clinical assessment. The score summarizes
  mortality risk; it does not diagnose the underlying liver disease.

## Calculation and interpretation

**Primary instrument:** MELD-Na — a weighted logarithmic formula of four
laboratory values, rounded to an integer and bounded to **6–40**.

**Inputs.**

| Input | Unit | Notes |
| --- | --- | --- |
| Total bilirubin | mg/dL (or µmol/L ÷ 17.1) | value < 1.0 set to 1.0 |
| INR | ratio (unitless) | value < 1.0 set to 1.0 |
| Serum creatinine | mg/dL (or µmol/L ÷ 88.4) | value < 1.0 set to 1.0; capped at 4.0; dialysis rule below |
| Serum sodium | mEq/L (= mmol/L) | MELD-Na only; bounded to 125–137 |
| Sex, serum albumin | — / g/dL | MELD 3.0 only |

**Dialysis / renal-replacement rule.** If the patient has had **two or more
haemodialysis sessions**, or **≥ 24 hours of continuous veno-venous
haemodialysis (CVVHD)**, in the **7 days** before the creatinine measurement,
serum creatinine is set to **4.0 mg/dL** (≈ 360 µmol/L) regardless of the
measured value, reflecting renal failure severity.

**Bounds.** Any of bilirubin, INR, or creatinine below **1.0** is raised to
1.0 before taking its natural logarithm (so no term is negative; ln 1 = 0).
Creatinine is capped at **4.0 mg/dL**. The final score is rounded to the
nearest integer and clamped to the range **6–40** (values above 40 report 40).

**Formula (concept).** The original MELD is a weighted sum of the natural
logarithms of the three lab values plus a constant:

```
MELD = 3.78·ln(bilirubin) + 11.2·ln(INR) + 9.57·ln(creatinine) + 6.43
```

MELD-Na adds a sodium correction (applied when MELD > 11), with sodium bounded
to 125–137 mEq/L, so that hyponatraemia raises the score. MELD 3.0 adds sex and
albumin terms with interaction adjustments. Exact coefficients and the sodium
correction live in [`spec/index.md`](spec/index.md) §4.

**Interpretation — estimated 3-month mortality.**

| MELD score | Estimated 3-month mortality | Band |
| --- | --- | --- |
| ≤ 9 | ~ 2 % | Low |
| 10–19 | ~ 6 % | Moderate |
| 20–29 | ~ 20 % | High |
| 30–39 | ~ 53 % | Very high |
| ≥ 40 | ~ 71 % | Extreme |

Higher scores generally confer higher priority on the transplant waiting list.
The mortality percentages are population estimates from the derivation cohorts
and support, but do not replace, clinical judgement.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, MELD variant (MELD / MELD-Na / MELD 3.0) |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Bilirubin | total bilirubin value and unit (mg/dL or µmol/L) |
| 4 | INR | international normalized ratio |
| 5 | Creatinine and dialysis | serum creatinine value and unit; number of dialysis sessions in the past 7 days; CVVHD ≥ 24 h yes/no |
| 6 | Sodium | serum sodium (MELD-Na and MELD 3.0) |
| 7 | Albumin | serum albumin (only when variant is MELD 3.0) |
| 8 | Summary and score | computed MELD score, mortality band, applied dialysis rule, flagged issues, transplant-referral prompt, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The calculation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support calculator; the output informs prioritization and escalation
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Malinchoc M. *et al.* A model to predict poor survival in patients undergoing
  transjugular intrahepatic portosystemic shunts. *Hepatology* 2000;
  31(4):864–871.
- Kamath P.S. *et al.* A model to predict survival in patients with end-stage
  liver disease. *Hepatology* 2001; 33(2):464–470.
- Kim W.R. *et al.* Hyponatremia and mortality among patients on the
  liver-transplant waiting list. *NEJM* 2008; 359(10):1018–1026.
- Kim W.R. *et al.* MELD 3.0: the model for end-stage liver disease updated for
  the modern era. *Gastroenterology* 2021; 161(6):1887–1895.

## Verify

```sh
bin/test-form model-for-end-stage-liver-disease-score
```
