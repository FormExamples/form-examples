# Chronic Kidney Disease Annual Review

A UK primary-care structured review that documents the annual (or interval)
monitoring of an adult with chronic kidney disease (CKD) and classifies the
patient on the **KDIGO GFR × albuminuria risk heat-map**. It records the two
staging measurements — **estimated glomerular filtration rate (eGFR)** with its
**G-stage (G1–G5)** and **urine albumin-to-creatinine ratio (ACR)** with its
**albuminuria stage (A1–A3)** — derives the **KDIGO risk zone**
(low / moderate / high / very high), grades how **complete** the review is
against the recommended monitoring bundle, and raises **flags** that map to NICE
NG203 referral and safety criteria.

This is a **documentation-completeness and classification** form rather than a
single-number score. The engine does not diagnose or treat; it derives the
KDIGO category, judges review completeness, and prompts action (nephrology
referral, repeat testing, medication review) in line with NICE NG203 (*Chronic
kidney disease: assessment and management*, 2021) and the KDIGO 2012/2024 CKD
guidance.

## Scope and intended users

- **Setting:** UK general practice — annual CKD review clinic, long-term
  conditions review, diabetes review (where CKD co-exists), nurse-led monitoring
  clinic, and community nephrology.
- **Users:** general practitioners (GPs), practice nurses and advanced nurse
  practitioners, clinical pharmacists undertaking structured medication review,
  and nephrology teams reviewing referrals.
- **Patients:** adults (≥ 18 years) with established CKD (G1–G5 not on renal
  replacement therapy) under primary-care monitoring.
- **Not for:** acute kidney injury, patients on dialysis or with a transplant
  (specialist follow-up), paediatric CKD, or as a substitute for clinical
  judgement. A low KDIGO risk zone does not remove the need for review.

## Sections captured

Completed in order on a single continuous single-page wizard. Each step records
**objective review data** — recorded results and documented actions, not free
narrative.

| # | Section | Key fields |
| --- | --- | --- |
| 1 | Review context | reviewing clinician name and role, date of review, care setting, review type (annual / interval / post-referral) |
| 2 | Patient & diagnosis | patient identifier, age band, sex, diabetes status, primary CKD cause, months since diagnosis |
| 3 | Renal function (eGFR) | current eGFR (mL/min/1.73 m²), sample date, previous eGFR and date → G-stage and rapid-decline check |
| 4 | Albuminuria (ACR) | urine ACR (mg/mmol), sample date, whether ACR measured this review → A-stage |
| 5 | Blood pressure | systolic and diastolic BP, whether target met (target derived from ACR / diabetes) |
| 6 | Medication review | ACEi/ARB prescribed, SGLT2 inhibitor prescribed, statin prescribed, nephrotoxic drug present, nephrotoxic dose-adjusted / held, medication review completed |
| 7 | Metabolic bloods | HbA1c, potassium, bicarbonate, calcium, phosphate, PTH, haemoglobin |
| 8 | Referral & summary | derived G-stage, A-stage, KDIGO risk zone, completeness grade, fired criteria, flagged issues, referral decision, free-text clinical note |

## KDIGO classification & completeness model

### GFR category (G-stage) — from current eGFR (mL/min/1.73 m²)

| G-stage | eGFR range | Description |
| --- | --- | --- |
| G1 | ≥ 90 | Normal or high |
| G2 | 60–89 | Mildly decreased |
| G3a | 45–59 | Mildly to moderately decreased |
| G3b | 30–44 | Moderately to severely decreased |
| G4 | 15–29 | Severely decreased |
| G5 | < 15 | Kidney failure |

### Albuminuria category (A-stage) — from urine ACR (mg/mmol)

| A-stage | ACR range | Description |
| --- | --- | --- |
| A1 | < 3 | Normal to mildly increased |
| A2 | 3–30 | Moderately increased |
| A3 | > 30 | Severely increased |

### KDIGO risk zone (GFR × ACR heat-map)

The two stages combine into a risk zone — the KDIGO "heat-map":

| GFR ↓ / ACR → | A1 (< 3) | A2 (3–30) | A3 (> 30) |
| --- | --- | --- | --- |
| **G1** (≥ 90) | Low | Moderate | High |
| **G2** (60–89) | Low | Moderate | High |
| **G3a** (45–59) | Moderate | High | Very high |
| **G3b** (30–44) | High | Very high | Very high |
| **G4** (15–29) | Very high | Very high | Very high |
| **G5** (< 15) | Very high | Very high | Very high |

- **Low** — routine primary-care monitoring; annual review sufficient.
- **Moderate** — increased monitoring frequency; optimise BP and cardiovascular
  risk.
- **High** — more frequent monitoring; review medication; consider referral if
  progressing.
- **Very high** — consider / arrange nephrology referral; frequent monitoring.

### Review completeness

The engine grades whether the recommended annual-review bundle is documented:

| Grade | Meaning |
| --- | --- |
| Complete | eGFR, ACR, blood pressure, medication review, and the core CKD bloods are all recorded. |
| Partial | Core staging data present (eGFR and BP) but one or more bundle items missing (commonly ACR or bloods). |
| Incomplete | Multiple core items missing; the review cannot be reliably classified or acted on. |

### Flagged issues and referral criteria

Computed independently of the risk zone, each with a priority (high / medium /
low). Categories, aligned to NICE NG203:

- **Nephrology referral — very-high risk** (high) — KDIGO zone `very high`.
- **Nephrology referral — eGFR < 30** (high) — G4 or G5.
- **Nephrology referral — ACR ≥ 70** (high) — severe albuminuria threshold.
- **Rapid eGFR decline** (high) — sustained fall ≥ 25 % with a change in G-stage,
  or ≥ 15 mL/min/1.73 m² per year, between current and previous eGFR.
- **Hyperkalaemia** (high when ≥ 6.0; medium 5.5–5.9 mmol/L) — potassium raised;
  review ACEi/ARB and diet.
- **Anaemia of CKD** (medium) — haemoglobin < 110 g/L; assess iron status,
  consider ESA / referral.
- **Uncontrolled blood pressure** (medium) — BP above the ACR/diabetes-derived
  target.
- **Nephrotoxic drug without dose adjustment** (high) — a nephrotoxic or
  renally-cleared drug present that has not been dose-adjusted or held.
- **Missing ACR** (medium) — albuminuria not measured this review; the KDIGO
  zone cannot be fully determined.
- **Incomplete review** (low) — bundle items missing; re-book to complete.

### Blood-pressure target

The target is derived, per NICE NG203:

- **< 130/80 mmHg** when ACR ≥ 70 mg/mmol or the patient has diabetes with CKD.
- **< 140/90 mmHg** otherwise.

## Assessment steps

The eight sections above form one continuous single-page wizard. The final
summary step renders the derived G-stage, A-stage, KDIGO risk zone, completeness
grade, fired criteria, and flagged issues, and captures the clinician's referral
decision and note.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.
- British English throughout.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support and documentation tool; the output classifies and prompts
  action rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NICE NG203. *Chronic kidney disease: assessment and management* (2021).
- KDIGO 2012. *Clinical Practice Guideline for the Evaluation and Management of
  Chronic Kidney Disease.* *Kidney Int Suppl* 2013; 3(1).
- KDIGO 2024. *Clinical Practice Guideline for the Evaluation and Management of
  CKD.* *Kidney Int* 2024; 105(4S).
- NICE CKS. *Chronic kidney disease* (Clinical Knowledge Summary).
- Royal College of General Practitioners / Kidney Care UK. *CKD in primary
  care.*

## Verify

```sh
bin/test-form chronic-kidney-disease-review
```
