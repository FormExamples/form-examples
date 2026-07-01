# Medical Certificate of Cause of Death (MCCD)

A statutory documentation instrument used in the United Kingdom to record the
cause of death of a person for the purpose of death registration. The certifying
doctor (attending practitioner) records the deceased's details, the date and
place of death, and the **cause-of-death structure** — Part I (the disease or
condition directly leading to death, together with the antecedent and underlying
conditions that gave rise to it) and Part II (other significant conditions
contributing to the death but not related to the disease or condition causing
it). Each condition carries an approximate interval between onset and death.

The form is not a numeric score. Its engine is a **completeness and
validity-classification** engine: it checks that the certificate is internally
complete, that the Part I causal sequence is logically ordered, that no
unacceptable "mode of death" (for example "cardiac arrest", "old age" or
"organ failure" given alone as the sole cause) stands as the only cause, and
that any circumstances requiring referral to the coroner or scrutiny by a
medical examiner are surfaced. It classifies the certificate as **Valid**,
**Incomplete**, or **Refer to coroner**, and raises a set of flagged issues.

Death certification in England and Wales operates within the statutory
framework of the Births and Deaths Registration Act 1953, the Coroners and
Justice Act 2009, and — since the reforms commenced in 2024 — the requirement
that every death not investigated by a coroner be scrutinised by an NHS medical
examiner before registration. This form supports that framework; it does not
replace the coroner's or medical examiner's statutory judgement.

## Scope and intended users

- **Setting:** hospital wards, hospices, care homes, general practice, and any
  setting where an attending medical practitioner completes an MCCD prior to
  registration of a death.
- **Users:** certifying doctors (the attending practitioner responsible for the
  deceased's care during the last illness) and NHS **medical examiners** (and
  their officers) who scrutinise certificates before registration.
- **Deaths:** deaths in England and Wales requiring an MCCD for registration.
- **Not for:** stillbirths (a separate Medical Certificate of Stillbirth
  applies), deaths under active coroner investigation (where no MCCD is issued),
  paediatric death review, or as a substitute for the coroner's or medical
  examiner's statutory determination. A classification of **Valid** by this
  engine does not discharge the certifying doctor's legal duty to consider
  coroner referral.

## Sections and validity model

The instrument is organised into the sections of the statutory certificate,
completed on a single continuous single-page wizard.

**Deceased and death details.** Name, sex, date of birth, date and place of
death, last seen alive by the certifying doctor, and whether the death was
seen after death by the certifier or another practitioner.

**Part I — the direct causal sequence.** A top-down sequence of the disease or
condition leading directly to death:

| Line | Meaning |
| --- | --- |
| I(a) | Disease or condition directly leading to death (required) |
| I(b) | Other disease or condition, if any, leading to I(a) |
| I(c) | Other disease or condition, if any, leading to I(b) |

The sequence reads downward from the immediate cause I(a) to the **underlying
cause** on the lowest completed line — the condition that initiated the train
of events. Each line carries an approximate onset-to-death interval.

**Part II — contributory conditions.** Other significant conditions that
contributed to the death but did not form part of the direct Part I sequence.

**Referral and scrutiny.** Whether the death has been referred to the coroner
and why; whether the case has been discussed with or scrutinised by a medical
examiner; certifying-doctor identity, grade, and attendance on the deceased.

**Validity classes.** The engine assigns exactly one:

| Class | Meaning |
| --- | --- |
| Valid | Certificate complete, Part I present and logically ordered, no unacceptable sole cause, no unmet coroner-referral criterion. Ready for medical-examiner scrutiny and registration. |
| Incomplete | Certificate can be completed by the same doctor but is missing required content (for example no I(a), a missing interval, missing certifier details) or contains an unacceptable sole cause. Not yet ready. |
| Refer to coroner | One or more coroner-referral criteria are met (unnatural, violent, or suspicious death; death of unknown cause; industrial disease or exposure; death in custody or state detention; no attending practitioner able to certify). The MCCD should not be issued until the coroner has considered the case. |

**Coroner and medical-examiner referral rules.** Referral to the coroner is
indicated when any of the following is asserted: violent, unnatural, or
suspicious death; death of unknown cause; death within the context of an
industrial disease or occupational exposure; death possibly due to a medical
procedure, treatment, or neglect; death in custody or other state detention; or
no attending practitioner in a position to certify. Independently, **every** MCCD
not referred to the coroner requires medical-examiner scrutiny before
registration; the engine always raises the medical-examiner scrutiny flag for a
non-referred certificate.

**Flagged issues.** Raised independently of the class, each with a priority:

- **Coroner referral required** (high) — a referral criterion is asserted.
- **Unacceptable sole cause** (high) — a recognised "mode of death" (cardiac
  arrest, respiratory arrest, asystole, old age alone, organ failure without a
  stated underlying cause, and similar) is the only cause given.
- **Missing Part I(a)** (high) — no direct cause of death is recorded.
- **Illogical sequence** (medium) — Part I lines are not in a plausible
  downward causal order (for example I(b) or I(c) completed while I(a) is
  empty, or intervals increasing down the sequence).
- **Medical-examiner scrutiny required** (medium) — always raised for a
  non-referred certificate; scrutiny must precede registration.
- **Missing interval** (low) — a completed cause line has no onset-to-death
  interval.
- **Incomplete certifier details** (low) — certifying-doctor identity, grade,
  or attendance information is missing.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Certification context | certifying-doctor name, grade, GMC reference; place and date of certification; attendance on the deceased during last illness |
| 2 | Deceased identification | name, sex, date of birth, age, patient identifier |
| 3 | Death details | date, time, and place of death; last seen alive; seen after death and by whom |
| 4 | Part I causal sequence | I(a), I(b), I(c) conditions with onset-to-death intervals |
| 5 | Part II contributory conditions | other significant conditions with intervals |
| 6 | Coroner and examiner referral | referral to coroner and reason; medical-examiner discussion / scrutiny status |
| 7 | Summary and validity | computed validity class, referral status, flagged issues, and a free-text certifier note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The validation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a documentation
  and completeness-checking instrument; the output supports certification and
  registration workflow rather than determining diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

The form is written to the UK death-certification and coroner framework: the
Births and Deaths Registration Act 1953, the Coroners and Justice Act 2009 and
the Coroners (Investigations) Regulations 2013, the statutory medical-examiner
system, and the Office for National Statistics guidance on completing an MCCD
and on cause-of-death coding under WHO ICD. It is a documentation aid only and
does not discharge any statutory duty of the certifying doctor, coroner, or
medical examiner.

## Clinical and statutory references

- Office for National Statistics. *Guidance for doctors completing Medical
  Certificates of Cause of Death in England and Wales.*
- Births and Deaths Registration Act 1953.
- Coroners and Justice Act 2009; Coroners (Investigations) Regulations 2013.
- The Medical Examiners (England) Regulations and NHS England medical-examiner
  system guidance.
- World Health Organization. *ICD — International Statistical Classification of
  Diseases*, rules for selection of the underlying cause of death.

## Verify

```sh
bin/test-form medical-certificate-of-cause-of-death
```
