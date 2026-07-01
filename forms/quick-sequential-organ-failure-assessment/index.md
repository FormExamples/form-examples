# Quick Sequential Organ Failure Assessment (qSOFA)

A bedside sepsis-risk screen for adults with suspected or confirmed infection.
It records three objective clinical criteria — **respiratory rate**, **mentation**,
and **systolic blood pressure** — scores each as 0 or 1, sums a total of **0–3**,
and flags the patient as **higher risk of a poor outcome** when the score is
**≥ 2**. A high score is not a diagnosis of sepsis; it is a prompt to escalate:
perform a full Sequential Organ Failure Assessment (SOFA), start a sepsis
workup, and obtain senior review.

qSOFA is the "quick" variant of the SOFA score introduced by the Third
International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3,
Singer *et al.*, *JAMA* 2016; derivation Seymour *et al.*, *JAMA* 2016). It was
designed to identify, without laboratory tests, patients with suspected
infection who are likely to have a prolonged intensive-care stay or to die in
hospital, particularly outside the intensive-care unit.

## Scope and intended users

- **Setting:** emergency department, general and acute medical wards, pre-hospital
  and ambulance services, rapid-response / outreach teams — any setting where
  infection is suspected and rapid, equipment-light triage is needed.
- **Users:** doctors, nurses, paramedics, healthcare assistants, and other
  frontline clinicians performing bedside assessment.
- **Patients:** adults (≥ 16 years) with suspected or confirmed infection.
- **Not for:** definitive sepsis diagnosis, paediatric patients (use a
  paediatric early-warning / sepsis tool), or as a substitute for clinical
  judgement or a national early-warning score (NEWS2). A qSOFA below 2 does not
  exclude sepsis.

## Scoring system

**Primary instrument:** qSOFA — three criteria, each scoring 1 point when
present and 0 when absent. Total score 0–3.

| # | Criterion | Scores 1 point when | Points |
| --- | --- | --- | --- |
| 1 | Respiratory rate | ≥ 22 breaths per minute | 0 or 1 |
| 2 | Altered mentation | Glasgow Coma Scale < 15 (any new alteration in mental status) | 0 or 1 |
| 3 | Systolic blood pressure | ≤ 100 mmHg | 0 or 1 |

**Interpretation.**

| Total score | Risk band | Recommended action |
| --- | --- | --- |
| 0–1 | Lower risk | Continue standard monitoring and clinical assessment; a low score does not rule out sepsis, so re-score if the patient deteriorates. |
| 2–3 | Higher risk | Positive screen. Consider possible sepsis or organ dysfunction: obtain senior/critical-care review, calculate a full SOFA score, and initiate a sepsis workup and management bundle (cultures, lactate, fluids, antibiotics per local policy). |

The threshold for a positive screen is **qSOFA ≥ 2**, associated in the
derivation cohorts with a markedly increased risk of in-hospital mortality and
prolonged intensive-care stay among patients with suspected infection outside
the ICU.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective bedside finding**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, suspected or confirmed source of infection |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Respiratory rate | measured respiratory rate (breaths/min) → criterion 1 |
| 4 | Mentation | Glasgow Coma Scale total (or "alert / not alert to baseline"), whether mentation is altered from baseline → criterion 2 |
| 5 | Systolic blood pressure | measured systolic blood pressure (mmHg) → criterion 3 |
| 6 | Summary and score | computed qSOFA total, risk band, fired criteria, red-flag issues, escalation recommendation, free-text clinical note |

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
  decision-support screening tool; the output prompts escalation rather than
  determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Singer M. *et al.* The Third International Consensus Definitions for Sepsis and
  Septic Shock (Sepsis-3). *JAMA* 2016; 315(8):801–810.
- Seymour C.W. *et al.* Assessment of Clinical Criteria for Sepsis. *JAMA* 2016;
  315(8):762–774.
- NICE NG51. *Sepsis: recognition, diagnosis and early management* (2016,
  updated 2024).
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).

## Verify

```sh
bin/test-form quick-sequential-organ-failure-assessment
```
