# Child Safeguarding Referral

A structured referral to children's social care when a professional believes a
child may be at risk of harm. It captures the child and family details, the
concern or allegation, the category of abuse, the presenting evidence, the
immediate risk and safety picture, the consent and information-sharing basis,
who else has been informed, and the action requested. A rules engine then grades
the **completeness and validity** of the referral, classifies its **urgency**
(emergency / urgent under Children Act 1989 s47, or standard under s17), and
raises **safeguarding flags** (for example immediate danger, a disclosure of
abuse, or a missing consent basis).

This is a **documentation-completeness and risk-classification** form, not a
numeric score. Its purpose is to make sure a referral is complete enough to be
acted on, to route it to the right level of urgency, and to surface the issues a
social-care duty team must see first. It is aligned with the statutory framework
in England: the **Children Act 1989** (s17 child in need, s47 significant harm)
and **Working Together to Safeguard Children** (2023).

## Scope and intended users

- **Setting:** any organisation that works with children — health (GP,
  emergency department, health visiting, community and hospital paediatrics),
  education (schools, nurseries, colleges), early years, police, housing, the
  voluntary sector, and social care itself.
- **Users:** any professional or volunteer with a safeguarding responsibility —
  teachers and designated safeguarding leads, doctors and nurses, health
  visitors, social workers, police officers, youth and support workers. No
  clinical qualification is assumed.
- **Subjects:** children and young people (under 18) about whom there is a
  welfare or protection concern; the form also records siblings and other
  children who may be affected.
- **Not for:** decisions that a referral is *not* required, adult safeguarding,
  or as a substitute for an immediate 999 call when a child is in imminent
  danger. Completing the form does not discharge the duty to phone the police or
  social care first when a child is at immediate risk.

## Sections and data captured

Collected in order on a single continuous single-page wizard.

| # | Section | Data captured |
| --- | --- | --- |
| 1 | Referrer details | referrer name, role, organisation, contact phone and email, date and time of referral, relationship to the child |
| 2 | Child details | child name, date of birth / age, sex, address, school or setting, NHS / unique reference, ethnicity, first language, any disability or communication need |
| 3 | Family and household | parents / carers with parental responsibility, other household members, siblings and other children in the household, known professionals already involved (GP, school, social worker) |
| 4 | The concern | concise description of the concern or allegation, when and how it came to light, whether the child has made a disclosure, and the referrer's own observations |
| 5 | Category of abuse | primary category — physical, emotional, sexual, or neglect — plus any additional categories; indicators and presenting evidence for each |
| 6 | Immediate risk and safety | is the child in immediate danger; where is the child now; who is with them; is the alleged person who caused harm in contact; are other children at risk |
| 7 | Consent and information sharing | has consent to refer been sought; was it given, refused, or not sought; the lawful basis for sharing without consent (risk of serious harm, or seeking consent would increase risk); whether the child and family are aware of the referral |
| 8 | Who else is informed | other agencies contacted (police, health, education), any strategy discussion already held, and previous safeguarding history if known |
| 9 | Requested action and summary | the action requested of children's social care; computed completeness status, urgency classification, fired rules, safeguarding flags; referrer declaration and free-text notes |

## Completeness and urgency model

The engine produces three independent outputs from one referral: a
**completeness status**, an **urgency classification**, and a set of
**safeguarding flags**. There is no numeric score.

### Completeness status

A referral is valid only when every **mandatory** field is present. Mandatory
fields are: referrer name and contact, child name and date of birth (or age),
the concern description, the primary category of abuse, the immediate-danger
answer, and the consent / information-sharing basis.

| Status | Meaning | Effect |
| --- | --- | --- |
| `complete` | all mandatory fields present and a consent / information-sharing basis is documented | referral is valid and ready to submit |
| `partial` | all mandatory fields present but recommended fields are missing (e.g. household composition, professionals involved) | submittable, but the duty team will have gaps |
| `incomplete` | one or more mandatory fields missing | referral is not valid; blocks submission and raises a flag |

`completenessPercent` reports the proportion of mandatory-plus-recommended
fields answered (0–100), for progress feedback.

### Urgency classification

Urgency routes the referral and maps to the statutory pathway.

| Urgency | Trigger | Pathway | Expected response |
| --- | --- | --- | --- |
| `emergency` | child in immediate danger / risk to life | s47 + emergency services | phone social care and police (999) now; do not wait for the written referral |
| `urgent` | reasonable cause to suspect the child is suffering, or likely to suffer, significant harm | s47 enquiry | contact children's social care the same working day |
| `standard` | welfare concern with no immediate risk; the child may be a child in need | s17 assessment | standard written referral within agreed local timescales |

### Safeguarding flags

Raised independently of status and urgency; each has a priority.

- **Immediate danger** (high) — immediate-danger answer is *yes*: escalate to
  emergency services / police now.
- **Disclosure of abuse** (high) — the child has disclosed abuse: preserve the
  account, avoid leading questions, prioritise.
- **Sexual abuse category** (high) — sexual abuse selected as a category:
  specialist and possibly police / medical response.
- **Other children at risk** (high) — siblings or other children in the
  household may be at risk: they must be considered in the referral.
- **No consent basis documented** (high) — consent not given and no lawful
  information-sharing basis recorded: the referral cannot be justified as it
  stands.
- **Mandatory field missing** (medium) — one or more required fields blank:
  referral is incomplete.
- **Child unaware / unsafe to inform** (medium) — informing the child or family
  would increase risk: handle contact carefully, note the reason.
- **Previous safeguarding history** (low) — prior involvement recorded: link to
  existing records.

## Assessment steps

The nine sections above are completed in order as one continuous single-page
wizard. The final step shows the computed completeness status, urgency
classification, fired rules, and safeguarding flags before the referrer
declaration.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The grading engine is pure (no side effects, no I/O) and unit-tested.
- British English throughout.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — this is an
  administrative documentation and workflow-routing tool; it records and routes
  a referral rather than diagnosing or treating, so it sits outside the medical
  device classification while remaining aligned with the baseline.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **Children Act 1989** — s17 (child in need) and s47 (significant harm) frame
  the urgency classification and statutory pathways.
- **Working Together to Safeguard Children** (2023) — the multi-agency
  safeguarding framework the referral content and information-sharing basis
  follow.
- **UK MHRA** *Software and AI as a Medical Device* (baseline reference).

## Statutory and guidance references

- HM Government. *Working Together to Safeguard Children* (2023).
- *Children Act 1989*, sections 17 and 47.
- Department for Education. *Keeping Children Safe in Education* (statutory
  guidance for schools and colleges).
- HM Government. *Information Sharing: advice for practitioners providing
  safeguarding services* (2018).

## Verify

```sh
bin/test-form child-safeguarding-referral
```
