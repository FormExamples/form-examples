# Rockall Score for Upper Gastrointestinal Bleeding

A risk-stratification instrument that estimates the risk of **rebleeding** and
**mortality** in adults presenting with acute upper gastrointestinal (GI)
bleeding. It has two forms that share the same clinical variables:

- **Pre-endoscopy (clinical) Rockall** — three parameters available before
  endoscopy: **age**, **shock** (heart rate and systolic blood pressure), and
  **comorbidity**. Total **0–7**.
- **Full (post-endoscopy) Rockall** — the three clinical parameters plus two
  endoscopic parameters: **endoscopic diagnosis** and **stigmata of recent
  haemorrhage**. Total **0–11**.

A higher score indicates a higher risk of rebleeding and death. A **low full
score (≤ 2)** identifies patients at low risk who may be considered for early
discharge and outpatient follow-up; a **high score** flags patients who need
admission, close monitoring, and often endoscopic or surgical intervention. The
score is a risk estimate and an escalation prompt, not a diagnosis or a
treatment decision.

The instrument was derived and validated by Rockall *et al.* (*Gut* 1996) from a
UK national audit of acute upper GI haemorrhage. NICE CG141 recommends the
**Glasgow-Blatchford score (GBS)** for the first (pre-endoscopy) assessment and
the **full Rockall score** after endoscopy for risk of rebleeding and death.

## Scope and intended users

- **Setting:** emergency department, acute medical and gastroenterology wards,
  and endoscopy units — anywhere adults with acute upper GI bleeding are
  assessed and risk-stratified.
- **Users:** emergency physicians, acute and general medical clinicians,
  gastroenterologists, and endoscopists.
- **Patients:** adults (≥ 16 years) with acute upper GI bleeding
  (haematemesis, coffee-ground vomiting, and/or melaena).
- **Not for:** lower GI bleeding, paediatric patients, definitive diagnosis, or
  as a substitute for clinical judgement. A low score does not exclude
  significant bleeding; reassess if the patient deteriorates.

## Scoring system

Both variants sum the same three clinical parameters; the full score adds two
endoscopic parameters. Each parameter contributes an exact number of points.

### Clinical parameters (both variants)

| Parameter | 0 points | 1 point | 2 points | 3 points |
| --- | --- | --- | --- | --- |
| **Age** | < 60 years | 60–79 years | ≥ 80 years | — |
| **Shock** | No shock (systolic BP ≥ 100 mmHg and heart rate < 100 bpm) | Tachycardia (heart rate ≥ 100 bpm, systolic BP ≥ 100 mmHg) | Hypotension (systolic BP < 100 mmHg) | — |
| **Comorbidity** | No major comorbidity | — | Cardiac failure, ischaemic heart disease, or any major comorbidity | Renal failure, liver failure, or disseminated malignancy |

**Pre-endoscopy (clinical) Rockall score = age + shock + comorbidity → 0–7.**

### Endoscopic parameters (full score only)

| Parameter | 0 points | 1 point | 2 points |
| --- | --- | --- | --- |
| **Diagnosis** | Mallory-Weiss tear, no lesion identified, and no stigmata of recent haemorrhage | All other diagnoses | Malignancy of upper GI tract |
| **Stigmata of recent haemorrhage** | None, or dark spot only | — | Blood in upper GI tract, adherent clot, or visible or spurting vessel |

**Full (post-endoscopy) Rockall score = clinical score + diagnosis + stigmata → 0–11.**

### Interpretation

Risk is banded from the full score when endoscopy has been performed, otherwise
from the clinical score. Mortality rises steeply with the full score (from near
0 % at a score of 0 to roughly 40 % at scores of ≥ 8).

| Full score | Risk band | Recommended action |
| --- | --- | --- |
| 0–2 | Low risk | Low risk of rebleeding and death; consider early discharge with outpatient follow-up per local policy. |
| 3–4 | Intermediate risk | Admit for observation; monitor for rebleeding; senior / gastroenterology review. |
| ≥ 5 | High risk | High risk of rebleeding and death; admit, monitor closely, and arrange endoscopic therapy, transfusion, and surgical or interventional-radiology input as indicated. |

A **pre-endoscopy (clinical) score of 0** identifies a low-risk group before
endoscopy, but NICE recommends the Glasgow-Blatchford score for that first
decision. Regardless of the total, shock and high-risk endoscopic stigmata are
independent prompts to escalate.

## Assessment steps

Completed in order on a single continuous single-page wizard. Clinical
parameters are recorded first; the endoscopic parameters are recorded only when
endoscopy has been performed.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, presenting complaint |
| 2 | Patient identification | patient identifier, age (years), sex |
| 3 | Shock — vital signs | heart rate (bpm), systolic blood pressure (mmHg) → shock parameter |
| 4 | Comorbidity | major comorbidity category → comorbidity parameter |
| 5 | Endoscopy | whether endoscopy has been performed; if so, endoscopic diagnosis and stigmata of recent haemorrhage |
| 6 | Summary and score | computed clinical (0–7) and, when available, full (0–11) score, risk band, per-parameter points, flagged issues, escalation recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support risk-stratification tool; the output informs and prompts
  escalation rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Rockall T.A. *et al.* Risk assessment after acute upper gastrointestinal
  haemorrhage. *Gut* 1996; 38(3):316–321.
- NICE CG141. *Acute upper gastrointestinal bleeding in over 16s: management*
  (2012, updated 2016).
- Blatchford O. *et al.* A risk score to predict need for treatment for upper
  gastrointestinal haemorrhage. *Lancet* 2000; 356(9238):1318–1321.

## Verify

```sh
bin/test-form rockall-score-for-upper-gastrointestinal-bleeding
```
