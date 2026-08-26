# Epilepsy Annual Review

A UK primary-care structured annual review for adults with epilepsy, aligned with
**NICE NG217** (*Epilepsies in children, young people and adults*, 2022). It is a
**documentation-completeness and control-classification** instrument rather than a
numeric score: the clinician records what has happened since the last review —
seizure type and frequency, seizure-free status, anti-seizure medication (ASM)
and adherence and side effects, triggers, injuries and status epilepticus events,
safety (driving, bathing, occupation), Sudden Unexpected Death in Epilepsy
(SUDEP) risk discussion, valproate and pregnancy-prevention arrangements for
women of childbearing potential, mental health, and the agreed care plan — and
the engine classifies **seizure control**, grades **review completeness**, and
raises **safety flags**.

The review does not diagnose epilepsy or select a specific ASM; it documents the
annual check, surfaces gaps in the record, and prompts escalation (specialist
review, urgent valproate / pregnancy-prevention-programme action, SUDEP
counselling, DVLA safety) where the recorded findings warrant it.

## Scope and intended users

- **Setting:** UK general practice and primary-care networks; epilepsy
  specialist-nurse clinics; community neurology and shared-care follow-up.
- **Users:** GPs, practice nurses and epilepsy specialist nurses conducting the
  annual review; neurology teams reviewing shared-care patients.
- **Patients:** adults (≥ 16 years) with an established diagnosis of epilepsy on
  a primary-care epilepsy register.
- **Not for:** first-seizure or new-diagnosis work-up, acute seizure or status
  epilepticus management, paediatric-only pathways, or definitive ASM selection.
  A "seizure-free" classification does not by itself authorize driving or
  medication withdrawal — those remain clinical and DVLA decisions.

## Sections captured

Recorded on a single continuous single-page wizard. Each section documents the
position **since the last review**.

1. **Review context** — reviewer name and role, date of review, care setting,
   review type (annual / interim), time since last review, source of information.
2. **Patient and epilepsy profile** — patient identifier, age band, sex, epilepsy
   type / syndrome, age at onset, years since diagnosis, learning-disability flag.
3. **Seizure type and frequency** — seizure type(s) present, frequency since last
   review, date of most recent seizure, seizure-free status and duration, trend
   versus previous review (increasing / stable / decreasing / seizure-free).
4. **Anti-seizure medication** — current ASM(s) and doses, adherence, side
   effects, therapeutic drug levels where relevant (for example phenytoin),
   recent changes.
5. **Triggers** — sleep deprivation, alcohol, stress, missed medication,
   photosensitivity, menstrual (catamenial) pattern, illness / fever.
6. **SUDEP risk discussion** — whether SUDEP has been discussed and documented,
   date, and modifiable risk factors (nocturnal / uncontrolled seizures,
   non-adherence).
7. **Injuries and status epilepticus** — seizure-related injuries, status
   epilepticus episodes, and emergency / hospital attendances since last review.
8. **Safety** — DVLA driving eligibility and current driving status, bathing
   versus showering advice, occupational and environmental hazards (heights,
   water, machinery), rescue-medication plan.
9. **Women of childbearing potential** — childbearing potential, valproate
   exposure and pregnancy-prevention programme (PPP) status, folic acid,
   contraception and ASM enzyme-induction interactions, pregnancy intention.
10. **Mental health** — mood, anxiety and depression screening, and any
    suicidality concern.
11. **Care plan** — need for specialist / neurology review, planned medication
    changes, self-management and rescue plan, next review date, care plan shared
    with patient.

## Control-classification and completeness model

The engine is a **pure classifier**, not a points score. It emits three outputs:
a seizure-control class, a review-completeness grade, and a list of flags.

**Seizure-control class.**

| Class | Determined when |
| --- | --- |
| **Seizure-free** | No seizures recorded since the last review (or a documented seizure-free duration), and no status epilepticus. |
| **Controlled** | Seizures present but infrequent and **stable or decreasing** versus the previous review, with no status epilepticus. |
| **Uncontrolled** | Ongoing frequent seizures, an **increasing** trend versus the previous review, or any status epilepticus episode since the last review. |

**Review-completeness grade.** Reflects how many of the required review domains
(sections 3–11) are documented.

| Grade | Determined when |
| --- | --- |
| **Complete** | Every required domain documented, including SUDEP discussion, safety / DVLA, medication adherence, and — where applicable — valproate / pregnancy-prevention. |
| **Partial** | Core seizure and medication domains documented, but one or more required domains (for example SUDEP, mental health, safety) are missing. |
| **Incomplete** | Core seizure or medication documentation itself is missing; the review cannot be relied on. |

**Flags (raised independently of the class and grade).**

- **Uncontrolled or increasing seizures → specialist review** (high).
- **Valproate in a woman of childbearing potential without a documented
  pregnancy-prevention programme → urgent review / PPP** (high).
- **Status epilepticus history since last review** (high).
- **Driving while not DVLA-eligible / DVLA notification required** (high).
- **Mental-health concern or suicidality** (high).
- **SUDEP counselling not documented** (medium).
- **Poor ASM adherence** (medium).
- **Significant ASM side effects** (medium).
- **Folic acid not recorded for a woman of childbearing potential** (medium).
- **Review overdue or incomplete documentation** (low).

## Assessment steps

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Review context | reviewer name and role, review date, care setting, review type, time since last review |
| 2 | Patient and epilepsy profile | patient identifier, age band, sex, epilepsy type / syndrome, age at onset, years since diagnosis, learning disability |
| 3 | Seizure type and frequency | seizure type(s), frequency, date of last seizure, seizure-free duration, trend versus last review |
| 4 | Anti-seizure medication | current ASM(s) and doses, adherence, side effects, drug levels if relevant |
| 5 | Triggers | sleep, alcohol, stress, missed medication, photosensitivity, catamenial, illness |
| 6 | SUDEP risk discussion | discussed and documented, date, modifiable risk factors |
| 7 | Injuries and status epilepticus | seizure-related injuries, status episodes, emergency attendances |
| 8 | Safety | DVLA eligibility and driving status, bathing / showering advice, occupational hazards, rescue plan |
| 9 | Women of childbearing potential | childbearing potential, valproate and PPP status, folic acid, contraception interactions, pregnancy intention |
| 10 | Mental health | mood, anxiety / depression screen, suicidality |
| 11 | Summary and care plan | computed seizure-control class, completeness grade, fired rules, flags, specialist-review recommendation, next review date, free-text note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a
  documentation and clinical-decision-support tool; the output prompts review and
  escalation rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NICE NG217. *Epilepsies in children, young people and adults: diagnosis and
  management* (2022).
- MHRA. *Valproate use by women and girls* — pregnancy-prevention programme and
  annual specialist review (2018, updated 2024).
- DVLA. *Assessing fitness to drive: a guide for medical professionals* —
  epilepsy and seizures.
- SUDEP Action / NICE. *Sudden Unexpected Death in Epilepsy — risk discussion.*

## Verify

```sh
bin/test-form epilepsy-review
```
