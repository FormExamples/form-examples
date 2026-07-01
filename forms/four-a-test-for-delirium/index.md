# 4AT — Rapid Delirium and Cognitive-Impairment Screen

The **4AT** is a validated, rapid bedside screening instrument for delirium and
possible cognitive impairment. It is designed to be completed in under two
minutes by any registered health or social care professional, with no special
training and no equipment. It combines a brief test of **alertness**, a
four-item abbreviated mental test (**AMT4**), a test of **attention** (reciting
the months of the year backwards), and an assessment of **acute change or
fluctuating course**.

This form records the four item scores, computes the **total score (0–12)**,
assigns the patient to one of three interpretation bands, and generates a
screening report with flagged issues that prompt further assessment (for
example a diagnostic delirium work-up when delirium is possible, or an urgent
review when alertness is clearly abnormal).

The 4AT is recommended by UK and international guidance (NICE, SIGN 157, the
Scottish Delirium Association) as a first-line delirium screen in acute and
peri-operative settings. It is a **screening aid**, not a diagnostic test: a
positive result should trigger a full clinical assessment against DSM-5 or
ICD-10 delirium criteria.

## Scope and intended users

- **Setting:** acute medical admissions, emergency departments, peri-operative
  and post-operative wards, care of the elderly, stroke units, intensive care
  step-down, community and care-home settings.
- **Users:** doctors, nurses, healthcare assistants, allied health
  professionals, and other registered practitioners — no specialist cognitive
  training required.
- **Patients:** adults, most commonly aged ≥ 65, in whom delirium or cognitive
  impairment is suspected or should be routinely screened (for example on
  emergency admission or after surgery).

## Scoring system

The 4AT is made up of four items. Items 1 and 4 contribute **0 or 4** points;
items 2 and 3 contribute **0, 1, or 2** points. The four item scores are summed
to give a total from **0 to 12**.

| # | Item | Response options | Points |
| --- | --- | --- | --- |
| 1 | **Alertness** — observe the patient; if asleep, attempt to wake with speech or gentle touch | Normal (fully alert, but not agitated, throughout assessment) | 0 |
| | | Mild sleepiness for < 10 seconds after waking, then normal | 0 |
| | | Clearly abnormal (markedly drowsy, or agitated / hyperactive) | 4 |
| 2 | **AMT4** — age, date of birth, place (name of the hospital or building), current year | No mistakes | 0 |
| | | 1 mistake | 1 |
| | | ≥ 2 mistakes, or untestable | 2 |
| 3 | **Attention** — "please tell me the months of the year in backwards order, starting at December" | Achieves ≥ 7 months correctly | 0 |
| | | Starts but scores < 7 months, or refuses to start | 1 |
| | | Untestable (cannot start because unwell, drowsy, or inattentive) | 2 |
| 4 | **Acute change or fluctuating course** — evidence of significant change or fluctuation in alertness, cognition, or other mental function arising over the last 2 weeks and still evident in the last 24 hours | No | 0 |
| | | Yes | 4 |

### Interpretation bands

| Total score | Interpretation |
| --- | --- |
| **≥ 4** | Possible delirium ± cognitive impairment |
| **1–3** | Possible cognitive impairment |
| **0** | Delirium or severe cognitive impairment unlikely (but delirium is still possible if item 4 information is incomplete) |

A score of **4 or more** should prompt a full clinical assessment for delirium.
A score of **1–3** suggests possible cognitive impairment warranting further
cognitive testing and collateral history. A score of **0** does not exclude
delirium if the acute-change information (item 4) could not be reliably
obtained.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Patient and assessment identification | patient identifier, name, date of birth, assessment date and time, setting, assessor name and role |
| 2 | Item 1 — Alertness | observed alertness category (normal / mild transient sleepiness / clearly abnormal) |
| 3 | Item 2 — AMT4 | correctness of age, date of birth, place, and current year; mistake-count band |
| 4 | Item 3 — Attention (months backwards) | months-backwards performance band |
| 5 | Item 4 — Acute change or fluctuating course | presence of acute change or fluctuation; source of information (patient, collateral, records) |
| 6 | Summary and sign-off | computed total, interpretation band, fired rules, flagged issues, free-text clinical notes, assessor signature |

## Flagged issues

Computed independently of the total score, with priority high / medium / low.

- **Possible delirium** (high) — total score ≥ 4; recommend full delirium
  assessment and search for precipitants.
- **Abnormal alertness** (high) — item 1 clearly abnormal; markedly drowsy or
  agitated patients need urgent clinical review regardless of total.
- **Acute change present** (high) — item 4 positive; strong pointer to delirium.
- **Possible cognitive impairment** (medium) — total score 1–3; recommend
  further cognitive assessment and collateral history.
- **Incomplete acute-change information** (medium) — item 4 could not be
  reliably established; a score of 0 does not exclude delirium.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML** representation for archival or legacy-system import.
- Import and export via JSON, XML, CSV, and TSV.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- One continuous single-page wizard; no multi-page forms.

## Clinical references

- MacLullich A.M.J. *et al.* The 4 'A's Test (4AT) for delirium detection.
  <https://www.the4at.com>.
- Bellelli G. *et al.* Validation of the 4AT, a new instrument for rapid
  delirium screening. *Age and Ageing* 2014; 43:496–502.
- Shenkin S.D. *et al.* Delirium detection in older acute medical inpatients:
  a multicentre prospective comparative diagnostic test accuracy study of the
  4AT and the Confusion Assessment Method. *BMC Medicine* 2019; 17:138.
- NICE CG103. *Delirium: prevention, diagnosis and management* (updated 2023).
- SIGN 157. *Risk reduction and management of delirium* (2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; classified where the output drives clinical action.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form four-a-test-for-delirium
```
