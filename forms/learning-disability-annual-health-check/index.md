# Learning Disability Annual Health Check

A UK primary-care **annual health check** for people aged **14 or over** on a
GP practice's learning-disability (LD) register. It is a comprehensive,
whole-person review that captures reasonable adjustments and communication
needs, physical health, health-screening and immunisation uptake, a medication
review including **STOMP** (Stopping Over-Medication with Psychotropics),
mental health and behaviour, syndrome-specific checks, and carer and social
circumstances — and produces a **Health Action Plan** the person can keep.

Unlike a scored risk calculator, this is a **documentation / completeness**
form. The engine does not diagnose or grade severity; it grades whether the
check was **carried out completely** against the required components, confirms
that a Health Action Plan was produced, and raises **flags** where the record
shows an unaddressed or missing element (for example a psychotropic medicine
without a clear indication or review, missed screening, or a physical-health
issue left without an action).

The design follows the NHS England annual health check programme, the RCGP /
Cardiff University *Health Check* template for people with a learning
disability, and the STOMP / STAMP national programmes. It is distinct from the
sibling **learning-disability assessment** form, which grades adaptive
functioning and a severity category; this form checks the **completeness of an
annual health check**.

## Scope and intended users

- **Setting:** UK general practice and primary care; community learning-
  disability teams working with the practice.
- **Users:** GPs, practice nurses, healthcare assistants completing observations,
  and community LD-team clinicians. The person, their family carer, or paid
  supporter contributes throughout.
- **Subjects:** people aged **14 or over** on the practice learning-disability
  register (the register that qualifies for the enhanced-service annual health
  check).
- **Not for:** severity grading or diagnosis of learning disability (use the
  learning-disability *assessment* form), acute clinical decisions, or as a
  substitute for the clinician's judgement. Completeness is an administrative
  quality signal, not a clinical outcome.

## Components captured

The check is organised into required components. Each is either **completed**
(recorded with a finding and, where relevant, an action) or **not completed**.

| Group | Components |
| --- | --- |
| Reasonable adjustments & communication | communication needs (easy-read, Makaton, AAC), reasonable adjustments recorded, hospital/health passport, consent and mental-capacity note |
| Physical health | weight and BMI, blood pressure, epilepsy review, constipation, dysphagia (swallowing), continence, mobility and falls, dental/oral health, vision, hearing, foot health, skin |
| Health screening & immunisations | eligible cancer screening (bowel, breast, cervical) uptake, other screening, seasonal and routine immunisations |
| Medication review (incl. STOMP) | full medication reconciliation, psychotropic medicines and their indication/review, STOMP discussion, side-effect review |
| Mental health & behaviour | mood and mental health, behaviour that challenges and triggers, life events |
| Syndrome-specific | syndrome-specific health checks relevant to the person's condition (for example Down syndrome thyroid/vision/hearing) |
| Carer & social | carer needs and carer's own health, social circumstances, employment/day activity |
| Output | **Health Action Plan** produced and shared with the person |

## Completeness model & Health Action Plan

The engine returns a **completeness status**, a **completeness percentage**, a
**Health Action Plan** confirmation, the list of required components that were
completed or missing (**fired rules**), and clinical **flags**.

**Status classes.**

| Status | Rule |
| --- | --- |
| **Complete** | Every required component is completed **and** a Health Action Plan was produced and shared. |
| **Incomplete** | One or more required components is not completed, **or** no Health Action Plan was produced. |

`completenessPercent` is the share of required components that were completed,
rounded to a whole number (0–100). The Health Action Plan is treated as a
required output: `healthActionPlanComplete` must be `true` for an overall
**Complete** status.

**Flags** (raised independently of the status, each with a priority):

- **STOMP — psychotropic without clear indication or review** (high): a
  psychotropic medicine is recorded but there is no documented indication, or no
  review / STOMP discussion. Prompts a medication review under STOMP.
- **No Health Action Plan** (high): the check recorded findings but no Health
  Action Plan was produced or shared.
- **Unaddressed physical-health issue** (high): a physical-health component
  records a problem (for example raised BP, dysphagia, epilepsy not reviewed)
  with no corresponding action.
- **Dysphagia / choking risk** (high): swallowing difficulty recorded — prompts
  a swallowing (SALT) referral and eating/drinking guidance.
- **Constipation risk** (medium): constipation recorded, relevant where
  psychotropic or anticholinergic medicines are in use.
- **Missing screening uptake** (medium): an eligible cancer screen or
  immunisation is not recorded as up to date or declined with a reason.
- **Reasonable adjustments not recorded** (medium): no reasonable adjustments or
  communication needs captured, contrary to the Accessible Information Standard.
- **Incomplete check** (low): one or more required components not completed; the
  status understates the person's care unless followed up.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
findings and, where a problem is found, an **action** that feeds the Health
Action Plan.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Check context | clinician name and role, date of check, practice, whether an easy-read invitation and pre-check were done |
| 2 | Person identification | person identifier, age band (≥ 14), sex, LD-register status, main carer / supporter |
| 3 | Reasonable adjustments & communication | communication needs, reasonable adjustments, health passport, consent and mental-capacity note |
| 4 | Physical health | weight/BMI, blood pressure, epilepsy, constipation, dysphagia, continence, mobility/falls, dental, vision, hearing, feet, skin — each with a finding and optional action |
| 5 | Health screening & immunisations | eligible cancer screens, other screening, immunisations — up to date / declined / not eligible |
| 6 | Medication review incl. STOMP | medication reconciliation, psychotropic medicines with indication and last review, STOMP discussion, side effects |
| 7 | Mental health & behaviour | mood, behaviour that challenges and triggers, recent life events |
| 8 | Syndrome-specific checks | condition-specific checks relevant to the person |
| 9 | Carer & social | carer needs and carer's health, social circumstances, day activity / employment |
| 10 | Health Action Plan | plan produced yes/no, actions collated from earlier steps, shared with the person, computed completeness status, fired rules, flags, free-text note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a documentation
  and completeness aid; it records and checks a clinical process rather than
  determining diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*
- Aligned with the **NHS Accessible Information Standard** and the **STOMP /
  STAMP** national programmes.

## Clinical references

- NHS England. *Annual health checks for people with a learning disability.*
- RCGP / Cardiff University. *Step-by-step guide and health check template for
  the annual health check of people with a learning disability.*
- NHS England. *Stopping Over-Medication of People with a Learning Disability,
  Autism or both (STOMP)* and *Supporting Treatment and Appropriate Medication
  in Paediatrics (STAMP).*
- Public Health England. *Making reasonable adjustments* guidance.

## Verify

```sh
bin/test-form learning-disability-annual-health-check
```
