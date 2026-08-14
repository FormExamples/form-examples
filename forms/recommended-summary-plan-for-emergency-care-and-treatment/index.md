# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT)

A UK personalized **emergency care and treatment plan** created through shared
decision-making between a person and one or more clinicians. ReSPECT records a
summary of what matters to the person, agreed clinical recommendations for their
care in a future emergency in which they may be unable to make or express
choices, an explicit **cardiopulmonary resuscitation (CPR) recommendation**, and
agreed **ceilings of treatment**. It is a portable record that travels with the
person across care settings.

Unlike a scored assessment, ReSPECT is a **documentation and governance**
instrument. The engine does not compute a clinical score; it evaluates whether a
plan is **complete and valid** against the mandatory content and process rules,
reports a completeness percentage, and raises safety and governance flags
(for example, a missing CPR recommendation, a capacity assessment that is
required but absent, an unsigned plan, a do-not-attempt-CPR recommendation with
no documented discussion, or a review date that has passed).

ReSPECT is developed and maintained by the Resuscitation Council UK. It replaces
stand-alone DNACPR forms in many UK health economies by placing any CPR
recommendation within the wider context of the person's goals and overall
emergency care.

## Scope and intended users

- **Setting:** any care setting — the person's own home, care homes, community
  services, ambulance and pre-hospital services, hospital wards, emergency
  departments, and hospices. The completed plan is designed to be recognized and
  honoured wherever the person receives care.
- **Users:** all clinicians involved in a person's care — general practitioners,
  hospital doctors, specialty and palliative-care teams, senior nurses,
  paramedics, and other registered health and social care professionals
  authorized locally to complete or endorse a ReSPECT plan.
- **Subjects:** any person of any age for whom emergency care and treatment
  recommendations should be agreed in advance, including those approaching the
  end of life, those with long-term conditions, and those at risk of sudden
  deterioration. For a child or young person, those with parental responsibility
  are involved in the conversation.
- **Not for:** replacing real-time clinical judgement in an emergency, giving
  legally binding instructions (a ReSPECT plan records **recommendations**, not
  legally binding refusals — those belong in an Advance Decision to Refuse
  Treatment), or acting as consent to a specific procedure.

## Sections and data captured

The plan is completed as a single continuous single-page wizard. Sections mirror
the ReSPECT form (national version 3.0).

| # | Section | Data captured |
| --- | --- | --- |
| 1 | Personal details | person's name, date of birth, unique identifier (NHS/CHI number), address, key contact details |
| 2 | Summary of relevant health | brief clinical summary, relevant diagnoses, and any existing documents (advance decision to refuse treatment, lasting power of attorney, organ-donation wishes) |
| 3 | Personal preferences and what matters | what the person values, their priorities and fears, and their preferences for care (for example, a preference for comfort-focused care versus life-sustaining treatment) |
| 4 | Clinical recommendations | agreed clinical recommendations, expressed on a balance between prioritizing sustaining life and prioritizing comfort, with specific realistic interventions that are and are not recommended |
| 5 | CPR recommendation | explicit recommendation: CPR should be **attempted** or CPR should **not be attempted** (DNACPR), with the clinical rationale |
| 6 | Ceilings of treatment | agreed limits, for example whether transfer to hospital or admission to critical care would be appropriate |
| 7 | Capacity and involvement | whether the person has capacity for this decision; who was involved — the person, a legal proxy (welfare attorney or court-appointed deputy), or consultees where the person lacks capacity; assessment of capacity where relevant |
| 8 | Clinician sign-off | name, role, and registration of the clinician completing the plan; signature and date; senior clinician endorsement; emergency contacts; planned review date |

## Completeness and validity model

ReSPECT produces a **status**, a **completeness percentage**, the list of
**fired rules**, and a set of **flags**. There is no numeric clinical score.

### Status classes

| Status | Meaning |
| --- | --- |
| **Complete** | Every mandatory content and process rule is satisfied. The plan is internally consistent and ready to be recognized and acted upon. |
| **Incomplete** | One or more mandatory rules are unsatisfied (for example, no CPR recommendation, no clinician signature, or a required capacity assessment is missing). The plan should not be relied upon until completed. |

`completenessPercent` is the proportion of mandatory fields that are present,
reported 0–100 regardless of status, so an incomplete plan still shows how close
it is to completion.

### Mandatory rules (all required for **Complete**)

1. Personal details identify the person (name, date of birth, and an
   identifier).
2. A summary of relevant health is recorded.
3. Personal preferences / what matters to the person are recorded.
4. Clinical recommendations are recorded, including the life-sustaining ↔
   comfort balance.
5. A **CPR recommendation** is documented (attempt **or** do-not-attempt).
6. Ceilings of treatment are recorded.
7. Capacity is recorded; **if the person lacks capacity**, the involvement of a
   legal proxy or consultees is documented.
8. The plan is **signed** by the completing clinician, with role and date.

### Safety and governance flags

Emitted independently of status, each with a priority:

- **CPR recommendation not documented** (high) — section 5 has no attempt /
  do-not-attempt selection; the single most safety-critical omission.
- **Capacity assessment missing** (high) — the person is recorded as lacking
  capacity but no capacity assessment or proxy/consultee involvement is
  documented (Mental Capacity Act 2005).
- **No clinician signature** (high) — the plan is unsigned, so it is not valid.
- **DNACPR without documented discussion** (high) — a do-not-attempt-CPR
  recommendation is recorded but there is no record of discussion with the
  person or, where they lack capacity, their legal proxy or those close to them.
- **Review date passed** (medium) — the planned review date is in the past; the
  plan may no longer reflect the person's wishes or condition.
- **Summary of health missing** (low) — no clinical summary recorded to give
  context to the recommendations.

## Assessment steps

Completed in order on a single continuous single-page wizard; the eight sections
above map one-to-one to eight wizard steps, with a ninth summary step that
renders the computed status, completeness percentage, fired rules, flags, and a
free-text note.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Personal details | name, date of birth, identifier, address, key contacts |
| 2 | Summary of relevant health | clinical summary, diagnoses, existing legal documents |
| 3 | Preferences and what matters | values, priorities, fears, care preferences |
| 4 | Clinical recommendations | life-sustaining ↔ comfort balance, recommended and not-recommended interventions |
| 5 | CPR recommendation | attempt / do-not-attempt, clinical rationale |
| 6 | Ceilings of treatment | hospital transfer, critical-care admission, other limits |
| 7 | Capacity and involvement | has-capacity flag, capacity assessment, legal proxy / consultees, who was involved |
| 8 | Clinician sign-off | clinician name, role, registration, signature, date, senior endorsement, emergency contacts, review date |
| 9 | Summary | computed status, completeness percentage, fired rules, flags, free-text note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a
  documentation and completeness tool; the output records and validates
  clinician-agreed recommendations rather than computing a diagnosis or driving
  treatment automatically.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **Mental Capacity Act 2005** — the capacity and involvement section, and the
  associated flags, reflect the Act's requirements: capacity is decision- and
  time-specific, best-interests decision-making applies where a person lacks
  capacity, and the role of welfare attorneys, court-appointed deputies, and
  consultees is respected. (In Scotland the analogous framework is the Adults
  with Incapacity (Scotland) Act 2000.)
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Resuscitation Council UK. *ReSPECT (Recommended Summary Plan for Emergency
  Care and Treatment)* — form and guidance, version 3.0.
  <https://www.resus.org.uk/respect>.
- General Medical Council. *Treatment and care towards the end of life: good
  practice in decision making* (2010, updated).
- Mental Capacity Act 2005 (England and Wales); Adults with Incapacity
  (Scotland) Act 2000.
- British Medical Association, Resuscitation Council UK, Royal College of
  Nursing. *Decisions relating to cardiopulmonary resuscitation* (3rd edition).

## Verify

```sh
bin/test-form recommended-summary-plan-for-emergency-care-and-treatment
```
