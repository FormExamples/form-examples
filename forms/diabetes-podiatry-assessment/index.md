# Diabetes Podiatry Assessment

A structured diabetic foot risk-screening record aligned with **NICE NG19**
(*Diabetic foot problems: prevention and management*). For each foot it
captures sensory neuropathy status, pedal pulses, structural deformity,
callus, skin breakdown, active ulceration (and its severity), ulceration and
amputation history, and a suspected-Charcot-foot marker, together with
patient-wide risk factors (renal replacement therapy, visual acuity
impairment, self-care ability, footwear). From the two examined feet it
classifies each foot's risk, applies the patient-wide high-risk overrides,
derives an overall risk category, review pathway, and review interval, and
raises flagged issues.

This is a **risk-stratification** form, not a wound-management or treatment
tool. It records the findings a podiatrist or other assessor has made on
examination and applies the programme's deterministic risk-classification
rules to produce the recommended review pathway; it does not diagnose,
debride, dress, or otherwise manage a wound.

## Scope and intended users

- **Setting:** community and hospital podiatry / foot protection services,
  diabetes annual review clinics, and inpatient wards performing an
  admission or pre-discharge foot check as part of the multidisciplinary
  diabetic foot pathway.
- **Users:** podiatrists, diabetes specialist nurses, physicians, orthotists,
  and other members of the foot protection or multidisciplinary foot care
  team (MDFT).
- **Patients:** adults with diagnosed diabetes (type 1 or type 2) undergoing
  a structured diabetic foot risk assessment.
- **Not for:** non-diabetic peripheral neuropathy or peripheral arterial
  disease, paediatric patients, or as a substitute for urgent same-day
  vascular or surgical assessment where critical limb ischaemia, spreading
  infection, or suspected Charcot foot is already apparent — those findings
  should trigger immediate escalation outside this record as well as being
  captured in it.

## Data captured & classification model

The record has a right foot and a left foot, each examined independently, plus
patient-wide risk factors that apply regardless of the current foot exam.

**Per-foot examination (repeated for `rightFoot` and `leftFoot`).**

| Field | Meaning |
| --- | --- |
| Neuropathy status | 10g monofilament (or equivalent) sensory test: sensate / insensate / not-tested |
| Pulses status | dorsalis pedis / posterior tibial pedal pulses: normal / diminished / absent / not-tested |
| Deformity | structural deformity present (claw toes, bunion, prominent metatarsal heads, Charcot deformity) |
| Callus | callus present |
| Skin breakdown | skin fissure / breakdown present, short of an active ulcer |
| Active ulcer | active ulceration present, with severity (superficial / deep / infected / critical-ischaemia) if so |
| Previous ulcer | history of previous ulceration on this foot |
| Previous amputation | history of previous amputation on this foot: none / minor (toe, partial foot) / major (below/above knee) |
| Suspected Charcot | unexplained hot, red, swollen foot, with or without deformity or pain — a limb-threatening emergency requiring urgent referral |

**Patient-wide risk factors.**

| Field | Meaning |
| --- | --- |
| Renal replacement therapy | on dialysis — an automatic high-risk factor |
| Visual acuity impairment | limits the patient's own ability to self-inspect their feet |
| Self-care ability | independent / partial / unable |
| Footwear appropriate | whether current footwear suits the patient's risk level |

**Risk classification (NICE NG19 categories).**

| Risk category | Typical trigger | Review pathway |
| --- | --- | --- |
| `low` | no risk factors on either foot | annual review |
| `moderate` | one risk factor on the worse foot (neuropathy alone, PAD alone, or deformity alone) | 6-monthly review by the foot protection service |
| `high` | previous ulceration or amputation, renal replacement therapy, or more than one risk factor combined on one foot (e.g. neuropathy + PAD, or either combined with callus/deformity) | 1–3-monthly review by the multidisciplinary foot team |
| `active-urgent` | active ulceration, suspected Charcot foot, or signs of critical limb ischaemia | urgent referral to the multidisciplinary foot team (same or next working day) |

The overall category is the worse of the two feet, raised by whichever
override applies (most urgent wins): an active ulcer or suspected Charcot on
either foot forces `active-urgent`; previous ulceration/amputation or renal
replacement therapy forces at least `high`.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessor name and role, assessment date, setting |
| 2 | Patient identification & risk factors | diabetes type, years since diagnosis, renal replacement therapy, visual acuity impairment, self-care ability, footwear |
| 3 | Right foot examination | neuropathy, pulses, deformity, callus, skin breakdown, active ulcer + severity, previous ulcer/amputation, suspected Charcot |
| 4 | Left foot examination | mirrors step 3 for the left foot |
| 5 | Summary and outcome | computed per-foot and overall risk, review pathway, review interval, fired flags, free-text assessor note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support risk-stratification tool; the output prompts a review
  pathway rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for
  users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- National Institute for Health and Care Excellence. *NG19: Diabetic foot
  problems: prevention and management* (2015, updated).
- International Working Group on the Diabetic Foot (IWGDF). *Guidelines on
  the prevention and management of diabetic foot disease.*
- NHS England. *Diabetic foot care pathway and risk stratification.*
- Boulton AJM *et al.* The global burden of diabetic foot disease. *Lancet*
  2005; 366(9498):1719-1724.

## Verify

```sh
bin/test-form diabetes-podiatry-assessment
```
