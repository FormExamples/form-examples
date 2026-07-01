# Estimated Glomerular Filtration Rate (eGFR) Calculator

A formula calculator that estimates the **glomerular filtration rate (GFR)** —
the volume of blood the kidneys filter each minute — from a single serum
**creatinine** measurement together with the patient's **age** and **sex**. It
returns an **eGFR in mL/min/1.73 m²** and classifies the result into a **chronic
kidney disease (CKD) G-stage** (G1–G5). The calculator does not diagnose kidney
disease; it standardises a laboratory result into a staged estimate that prompts
monitoring, medication-dose review, or referral.

The primary equation is the **CKD-EPI 2021 creatinine equation** — the
**race-free** refit of the Chronic Kidney Disease Epidemiology Collaboration
(CKD-EPI) formula recommended across the United Kingdom by NICE (NG203) and
adopted by the Royal College of Pathologists and UK laboratories. Two
alternative equations are noted for context: **CKD-EPI 2021 cystatin C** (used
when a more precise estimate is needed, e.g. to confirm CKD at the G2/G3a
boundary or where creatinine is unreliable), and the older **MDRD Study
equation** (four-variable), now superseded but still encountered in historical
records.

## Scope and intended users

- **Setting:** primary care, secondary care, clinical biochemistry / pathology
  laboratories, pharmacy, and any service that acts on a renal-function result —
  chronic disease management, pre-prescribing checks, contrast-imaging
  screening, and anaesthetic assessment.
- **Users:** all clinicians (general practitioners, hospital doctors, nurses,
  pharmacists) and laboratory staff who calculate or interpret an eGFR.
- **Patients:** adults (≥ 18 years) with a steady-state serum creatinine.
- **Not for:** children and young people (use a paediatric equation such as the
  CKiD / Schwartz bedside formula), patients with rapidly changing renal
  function or acute kidney injury (eGFR assumes steady state), pregnancy,
  extremes of body habitus, or as a substitute for a formal CKD diagnosis, which
  also requires albuminuria (ACR) and chronicity over ≥ 3 months.

## Calculation and classification

**Primary instrument:** CKD-EPI 2021 creatinine equation (race-free).

The equation takes standardised (IDMS-traceable) serum creatinine, age, and sex
and returns eGFR in mL/min/1.73 m². It uses a sex-specific creatinine scaling
factor (κ) and exponent (α), a piecewise term that behaves differently below and
above κ, an age-decay term, and a female multiplier:

```
eGFR = 142
     × min(Scr/κ, 1)^α
     × max(Scr/κ, 1)^(-1.200)
     × 0.9938^Age
     × (1.012 if female)
```

- `Scr` — serum creatinine in **mg/dL**. Inputs captured in **µmol/L** are
  converted first: `Scr(mg/dL) = Scr(µmol/L) / 88.42`.
- `κ` — 0.7 for female, 0.9 for male.
- `α` — −0.241 for female, −0.302 for male.
- `Age` — age in years.
- The result is a positive number, conventionally reported to the nearest whole
  number and reported as **> 90** above 90 in UK laboratory practice.

**Alternative equations (context only, not the primary output):**

- **CKD-EPI 2021 cystatin C** — replaces creatinine with cystatin C (a marker
  less affected by muscle mass and diet), or **creatinine–cystatin C** combined
  for the most precise estimate. Preferred to confirm CKD near a decision
  threshold.
- **MDRD (4-variable)** — the historical `175 × Scr^−1.154 × Age^−0.203 ×
  (0.742 if female)` equation; superseded by CKD-EPI, retained only for
  interpreting older results.

**CKD G-stage classification** (KDIGO 2012, GFR categories):

| G-stage | eGFR (mL/min/1.73 m²) | Description |
| --- | --- | --- |
| **G1** | ≥ 90 | Normal or high |
| **G2** | 60–89 | Mildly decreased |
| **G3a** | 45–59 | Mildly to moderately decreased |
| **G3b** | 30–44 | Moderately to severely decreased |
| **G4** | 15–29 | Severely decreased |
| **G5** | < 15 | Kidney failure |

A G-stage alone is not CKD: stages G1 and G2 require additional evidence of
kidney damage (e.g. albuminuria) to be labelled as chronic kidney disease, and
staging requires the reduction to persist for at least three months.

## Assessment steps

Completed in order on a single continuous single-page wizard. The calculation is
a pure formula — the wizard collects the three required inputs plus context.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | requesting clinician name and role, date and time, care setting, equation selected (CKD-EPI 2021 creatinine primary) |
| 2 | Patient identification | patient identifier, age (years), sex |
| 3 | Serum creatinine | measured serum creatinine (µmol/L), specimen date, whether renal function is at steady state |
| 4 | Summary and result | computed eGFR (mL/min/1.73 m²), CKD G-stage, flagged issues, drug-dosing note, escalation recommendation, free-text clinical note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a calculator
  that transforms a laboratory value into a staged estimate to inform clinical
  decisions; the output supports, rather than determines, management.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Inker L.A. *et al.* New Creatinine- and Cystatin C-Based Equations to Estimate
  GFR without Race. *N Engl J Med* 2021; 385(19):1737–1749.
- Levey A.S. *et al.* A New Equation to Estimate Glomerular Filtration Rate
  (CKD-EPI). *Ann Intern Med* 2009; 150(9):604–612.
- KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of
  Chronic Kidney Disease. *Kidney Int Suppl* 2013; 3(1).
- NICE NG203. *Chronic kidney disease: assessment and management* (2021,
  updated 2023).
- Royal College of Pathologists / NHS England. *Recommendation to adopt the
  CKD-EPI 2021 (race-free) creatinine equation.*

## Verify

```sh
bin/test-form estimated-glomerular-filtration-rate-calculator
```
