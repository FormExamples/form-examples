# Cervical Screening record

A structured record of a cervical screening (smear) encounter under the **UK NHS
Cervical Screening Programme (NHS CSP)**. It documents the sample-taking
consultation and the laboratory result, then classifies the **result** and the
**management outcome** so that the correct next action — routine recall, early
repeat, colposcopy referral, or cease — is recorded and communicated.

The programme uses **high-risk human papillomavirus (hrHPV) primary screening**:
every adequate sample is first tested for high-risk HPV, and **reflex cytology**
(microscopy for dyskaryosis) is performed **only** on HPV-positive samples. This
form mirrors that pathway. It is a **documentation and result-classification**
form, not a numeric-score calculator: the engine determines the result class,
the management action, and a set of safety flags; it does not compute a risk
score.

## Scope and intended users

- **Setting:** general practice, community sexual and reproductive health
  services, and the NHS Cervical Screening Programme administrative and
  laboratory services.
- **Users:** sample-takers (practice nurses, GPs, and trained smear-takers),
  general practitioners reviewing and actioning results, and cervical screening
  service / laboratory staff who classify samples and manage recall.
- **Patients:** eligible individuals with a cervix, routinely aged **25 to 64**.
  Recall interval is **3-yearly for ages 25–49** and **5-yearly for ages 50–64**.
- **Not for:** diagnosis of cervical cancer (that is a colposcopy and histology
  pathway), symptomatic assessment (symptoms are referred on their own pathway
  regardless of screen result), or HPV vaccination records. A negative screen
  does not exclude cancer in a symptomatic person.

## Data captured & result-classification model

The record captures the encounter and result across five domains, then applies
the HPV-primary classification pathway.

**1. Eligibility.** Age (must fall in the 25–64 routine range), the applicable
recall interval (3-yearly 25–49 / 5-yearly 50–64), the date the screen was due,
and whether the person is overdue. Age outside the range or a person who has
formally ceased screening drives a **cease / not-eligible** outcome.

**2. Consent.** Informed consent to take the sample and to process the result is
recorded and must be present before a sample is reported.

**3. Sample adequacy.** Whether the liquid-based cytology sample is **adequate**
or **inadequate/unsatisfactory** (insufficient cells, obscuring blood or
inflammation, incorrectly labelled). An inadequate sample cannot be tested and
must be repeated.

**4. Primary hrHPV test.** For an adequate sample, the high-risk HPV result:
**negative** (not detected) or **positive** (detected).

**5. Reflex cytology.** Performed **only when hrHPV is positive**. Graded as
**negative (normal)**, **borderline changes**, **low-grade dyskaryosis**, or
**high-grade dyskaryosis** (moderate/severe, or ?glandular / ?invasive).

**Result classification and management outcome.**

| Result class | Condition | Management outcome |
| --- | --- | --- |
| **Inadequate** | Sample inadequate/unsatisfactory | Repeat sample in ~3 months (3 consecutive inadequate → colposcopy) |
| **HPV negative** | hrHPV not detected | Routine recall at the age-appropriate interval |
| **HPV positive, cytology normal** | hrHPV detected, reflex cytology negative | Early repeat HPV test at 12 months |
| **HPV positive, cytology abnormal (low grade)** | hrHPV detected, borderline or low-grade dyskaryosis | Colposcopy referral (routine) |
| **HPV positive, cytology abnormal (high grade)** | hrHPV detected, high-grade dyskaryosis / ?glandular / ?invasive | **Urgent** colposcopy referral |
| **Cease / not eligible** | Age outside 25–64, or formally ceased | Cease screening; no recall |

Independent of the result class, the engine raises **flags**: HPV-positive with
high-grade cytology (urgent colposcopy), inadequate sample (repeat), patient
overdue, symptomatic (refer on the symptomatic pathway regardless of the screen),
age outside the eligible range, and missing consent.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Encounter context | sample-taker name and role, care setting, date and time of sample |
| 2 | Patient identification | patient identifier, NHS number, age, date of birth |
| 3 | Eligibility | recall interval, screen-due date, overdue flag, previously ceased |
| 4 | Consent | informed consent to sample and to process the result |
| 5 | Symptoms | any symptoms (abnormal bleeding, discharge, pain) that need a separate referral |
| 6 | Sample adequacy | adequate / inadequate, reason if inadequate |
| 7 | Primary hrHPV result | negative / positive |
| 8 | Reflex cytology | grade (only when hrHPV positive) |
| 9 | Summary and outcome | computed result class, management action, fired rules, flags, free-text note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — the software
  documents and classifies a screening result and prompts the next action; it
  does not diagnose.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS Cervical Screening Programme. *Cervical screening: programme overview* and
  *HPV primary screening* pathway (Public Health England / UK Health Security
  Agency / NHS England).
- NHS CSP. *Colposcopy and Programme Management* (NHSCSP Publication 20).
- British Association for Cytopathology / RCPath. *Terminology for reporting
  cervical cytology* (dyskaryosis grading).
- NICE. *Cervical cancer* and *Suspected cancer: recognition and referral*
  (NG12).

## Verify

```sh
bin/test-form cervical-screening
```
