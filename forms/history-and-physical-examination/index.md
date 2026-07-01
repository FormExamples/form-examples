# History and Physical Examination (H&P)

The comprehensive clerking and admission document that records a patient's
**history** and **physical examination** at a single clinical encounter:
presenting complaint and history of the presenting complaint, past medical and
surgical history, drug history and allergies, family history, social history, a
systems review, a full physical examination by body system, vital signs,
investigations, an impression and problem list, and a management plan.

Unlike a scored risk instrument, the H&P is a **documentation / completeness
form**: it does not compute a numeric score. Instead a completeness engine grades
how thoroughly the clerking has been documented — **Complete**, **Partial**, or
**Incomplete** — against a set of required components, reports a completeness
percentage, and raises **flags** for safety-critical omissions (allergies not
documented, no impression or plan recorded, red-flag findings without a
corresponding plan, abnormal vital signs, and an incomplete systems
examination). The output is a structured clerking document suitable for the
admission record.

## Scope and intended users

- **Setting:** acute medical and surgical admissions, the emergency department,
  the acute medical unit, and any ward clerking or new-patient work-up where a
  full history and examination is documented.
- **Users:** doctors (foundation, core, and specialty trainees; consultants),
  advanced clinical practitioners (ACPs), physician associates, and other
  clinicians who clerk patients on admission.
- **Patients:** adults being admitted or clerked. The form is a general-purpose
  clerking template rather than a specialty-specific assessment.
- **Not for:** computing a diagnostic or risk score, replacing a specialty
  assessment, or serving as a substitute for clinical judgement. A "Complete"
  grade means the document is well-formed, not that the clinical reasoning is
  correct.

## Sections and completeness model

The H&P is organised into the conventional clerking sections. Each section is
either a **required component** (must be documented for a Complete grade) or an
optional / conditional component.

**Required components** (must be present and non-empty for **Complete**):

1. Presenting complaint.
2. History of the presenting complaint.
3. Past medical and surgical history (or explicit "nil").
4. Drug history **and** allergy status (allergies must be explicitly documented,
   including "no known drug allergies").
5. Social history.
6. Systems review (all systems addressed or explicitly marked "not relevant").
7. Physical examination — vital signs recorded.
8. Physical examination — the core systems examined (cardiovascular,
   respiratory, abdominal, neurological) or explicitly deferred with a reason.
9. Impression / problem list.
10. Management plan.

**Status classes** (overall grade from the completeness engine):

| Status | Rule |
| --- | --- |
| **Complete** | Every required component is documented and no blocking flag (allergies undocumented, or no impression and no plan) is raised. |
| **Partial** | The core clinical narrative is present (presenting complaint, history, examination, and either an impression or a plan) but one or more non-blocking required components are missing. |
| **Incomplete** | The core clinical narrative is missing, or a blocking flag is raised (allergies undocumented, or no impression **and** no plan). |

`completenessPercent` is the proportion of the ten required components that are
satisfactorily documented, rounded to a whole percent.

**Flags** (raised independently of the status, each with a priority):

| Flag | Priority | Condition |
| --- | --- | --- |
| Allergies not documented | high | allergy status left blank (neither an allergy nor "no known drug allergies") |
| No impression or plan | high | both the impression / problem list and the management plan are empty |
| Red-flag finding without a plan | high | a red-flag examination or history finding is recorded but no corresponding management-plan entry exists |
| Abnormal vital signs | medium | any recorded vital sign falls outside its normal range |
| Incomplete systems examination | medium | one or more core examination systems is neither examined nor explicitly deferred |
| Incomplete history | low | one or more required history sections is missing |

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
part of the clerking document.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Encounter and clinician | clinician name and role, GMC/NMC/registration number, date and time of clerking, care setting, admission source |
| 2 | Patient identification | patient identifier, age band, sex, mode of arrival |
| 3 | Presenting complaint | presenting complaint, duration |
| 4 | History of presenting complaint | narrative history, onset, character, associated features, prior episodes |
| 5 | Past medical and surgical history | conditions, operations, or explicit "nil" |
| 6 | Drug history and allergies | current medications, adherence, allergy status and reactions (or "no known drug allergies") |
| 7 | Family history | relevant familial conditions, or explicit "nil" |
| 8 | Social history | smoking, alcohol, occupation, living situation, functional baseline |
| 9 | Systems review | cardiovascular, respiratory, gastrointestinal, genitourinary, neurological, musculoskeletal, dermatological — each addressed or "not relevant" |
| 10 | Vital signs | temperature, heart rate, respiratory rate, blood pressure, oxygen saturation, consciousness level |
| 11 | Physical examination by system | general inspection, cardiovascular, respiratory, abdominal, neurological, and other systems — findings or explicit deferral |
| 12 | Investigations | bedside, laboratory, and imaging results available at clerking |
| 13 | Impression and problem list | working impression, differential diagnoses, numbered problem list, red-flag findings |
| 14 | Management plan | investigations requested, treatment, referrals, escalation and monitoring plan, disposition |
| 15 | Summary and completeness | computed status, completeness percentage, satisfied and missing components, raised flags, free-text clinical note, electronic signature |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The completeness engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a clerking
  documentation and completeness-checking tool; the output prompts the clinician
  to complete missing components rather than determining diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Douglas G., Nicol F., Robertson C. (eds). *Macleod's Clinical Examination.*
  Elsevier.
- Talley N.J., O'Connor S. *Clinical Examination: A Systematic Guide to Physical
  Diagnosis.* Elsevier.
- Geeky Medics. *History Taking* and *Clinical Examination* OSCE guides.
  <https://geekymedics.com/>.
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017) —
  vital-sign reference ranges.

## Verify

```sh
bin/test-form history-and-physical-examination
```
