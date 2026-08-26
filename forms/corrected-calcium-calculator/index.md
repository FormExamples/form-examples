# Corrected Calcium Calculator

An albumin-adjusted (corrected) calcium calculator for adults. It takes a
measured **total calcium** result and the patient's **serum albumin**, applies
the standard albumin-correction formula, and reports a **corrected calcium**
value in millimoles per litre (mmol/L). The corrected value is then classified
against the adult reference range as **hypocalcaemia**, **normal**, or
**hypercalcaemia**, and severe results are flagged for urgent action.

Roughly half of circulating calcium is bound to albumin, so a total-calcium
result measured in a hypo- or hyper-albuminaemic patient can misrepresent the
physiologically active (ionized) calcium. The correction estimates what the
total calcium would be if albumin were normal (40 g/L), improving interpretation
when albumin is abnormal. It is an estimate, not a substitute for a measured
ionized calcium.

## Scope and intended users

- **Setting:** any clinical or laboratory setting where a total-calcium and an
  albumin result are available — general practice, hospital wards, emergency
  departments, outpatient clinics, and clinical biochemistry laboratories.
- **Users:** all clinicians (doctors, nurses, pharmacists, physician associates)
  and laboratory staff (biomedical scientists, clinical scientists) who need to
  interpret a calcium result in the context of albumin.
- **Patients:** adults. The correction and reference range assume adult
  physiology and UK SI units.
- **Not for:** paediatric interpretation, patients where a measured ionized
  calcium is available (use the ionized value directly), or as a stand-alone
  diagnosis of a calcium disorder. The corrected value supports, and does not
  replace, clinical judgement.

## Calculation and interpretation

**Correction formula (UK SI units).**

```
correctedCalcium (mmol/L) = totalCalcium (mmol/L) + 0.02 × (40 − albumin (g/L))
```

- `totalCalcium` — measured total serum calcium in mmol/L.
- `albumin` — measured serum albumin in g/L.
- `40` — the reference (normal) albumin in g/L that the result is corrected to.
- `0.02` — the adjustment factor in mmol/L per g/L of albumin below (or above)
  the reference. When albumin is below 40 g/L the correction raises the reported
  calcium; when albumin is above 40 g/L it lowers it.

**Worked example.** Total calcium 2.30 mmol/L with albumin 28 g/L:
`2.30 + 0.02 × (40 − 28) = 2.30 + 0.24 = 2.54 mmol/L` corrected.

**Reference range.** The adult corrected-calcium reference range is
approximately **2.20–2.60 mmol/L** (local laboratory ranges vary slightly; the
calculator uses 2.20–2.60 as the default).

**Classification.**

| Corrected calcium (mmol/L) | Classification | Recommended action |
| --- | --- | --- |
| < 2.20 | Hypocalcaemia | Investigate cause (vitamin D, magnesium, renal, parathyroid); correlate with symptoms. |
| 2.20 – 2.60 | Normal | Within adult reference range; interpret in clinical context. |
| > 2.60 | Hypercalcaemia | Investigate cause (parathyroid, malignancy, drugs); correlate with symptoms. |

**Severity flags.**

| Condition | Threshold | Flag |
| --- | --- | --- |
| Severe hypercalcaemia | corrected calcium ≥ 3.0 mmol/L | Urgent — risk of hypercalcaemic crisis; seek immediate senior / endocrine review. |
| Symptomatic hypercalcaemia | corrected calcium > 2.60 mmol/L with reported symptoms | Escalate; correlate polyuria, confusion, arrhythmia. |
| Severe hypocalcaemia | corrected calcium < 1.90 mmol/L | Urgent — risk of tetany, seizures, arrhythmia; seek immediate review. |

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time, care setting, sample / collection reference |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Total calcium | measured total calcium (mmol/L) |
| 4 | Albumin | measured serum albumin (g/L) |
| 5 | Symptoms | whether the patient has calcium-related symptoms (supports the symptomatic flag) |
| 6 | Result and interpretation | computed corrected calcium, classification band, fired flags, free-text clinical note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a calculation
  and interpretation aid; the output informs clinical assessment rather than
  determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Payne R.B. *et al.* Interpretation of serum calcium in patients with abnormal
  serum proteins. *British Medical Journal* 1973; 4:643–646.
- Association for Clinical Biochemistry and Laboratory Medicine (ACB) — guidance
  on adjusted (corrected) calcium.
- UK Kidney Association / Royal College of Physicians — laboratory reference
  ranges.
- NICE Clinical Knowledge Summaries — *Hypercalcaemia* and *Hypocalcaemia*.

## Verify

```sh
bin/test-form corrected-calcium-calculator
```
