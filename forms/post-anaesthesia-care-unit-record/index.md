# Post-Anaesthesia Care Unit (PACU) Record

A structured recovery-room record for patients emerging from anaesthesia or
sedation. It captures serial post-operative observations — airway, breathing,
circulation, consciousness, oxygen saturation, pain, and post-operative nausea
and vomiting (PONV) — and computes a **discharge-readiness score** that tells
the recovery team when the patient is safe to leave the post-anaesthesia care
unit (PACU, also called the recovery room).

The primary instrument is the **Modified Aldrete Score**: five parameters
(activity, respiration, circulation, consciousness, oxygen saturation), each
scored 0–2, summing to a total of **0–10**. A total of **≥ 9 with the oxygen
saturation criterion met** is the conventional threshold for discharge from
PACU. For day-surgery / ambulatory patients the record optionally adds the
**Post-Anaesthesia Discharge Scoring System (PADSS)** — five criteria (vital
signs, ambulation, nausea and vomiting, pain, surgical bleeding), each 0–2,
total 0–10, with **≥ 9** indicating fitness for discharge home ("street
fitness"). The record also raises red-flag issues (Aldrete < 9 not ready,
hypoxia, unstable vital signs, uncontrolled pain, uncontrolled PONV, surgical
bleeding).

A high or passing score is not by itself an instruction to discharge; it is a
prompt confirming that documented discharge criteria are met, subject to the
supervising anaesthetist's judgement.

## Scope and intended users

- **Setting:** the post-anaesthesia care unit / recovery room of a hospital or
  day-surgery unit, immediately following general anaesthesia, regional
  anaesthesia, or procedural sedation.
- **Users:** recovery nurses (primary), anaesthetists and anaesthesia
  associates, and operating-department practitioners.
- **Patients:** adults recovering from anaesthesia or sedation. Ambulatory
  day-surgery patients additionally use the PADSS street-fitness assessment.
- **Not for:** paediatric-specific recovery scoring, intensive-care handover,
  or as a substitute for the supervising clinician's discharge decision. A
  passing score does not override clinical judgement.

## Scoring system

**Primary instrument:** Modified Aldrete Score — five parameters, each scored
0, 1, or 2. Total score 0–10.

| Parameter | 2 | 1 | 0 |
| --- | --- | --- | --- |
| **Activity** (voluntary movement on command) | Moves all four limbs | Moves two limbs | Unable to move limbs |
| **Respiration** | Breathes deeply and coughs freely | Dyspnoea, shallow or limited breathing | Apnoeic / requires ventilation |
| **Circulation** (blood pressure vs pre-anaesthetic baseline) | BP ± 20 mmHg of baseline | BP ± 20–50 mmHg of baseline | BP ± > 50 mmHg of baseline |
| **Consciousness** | Fully awake | Arousable on calling | Not responding |
| **Oxygen saturation** | SpO₂ > 92% on room air | Needs supplemental oxygen to keep SpO₂ > 90% | SpO₂ < 90% even with supplemental oxygen |

**Interpretation.**

| Total score | Readiness band | Recommended action |
| --- | --- | --- |
| 0–8 | Not ready | Continue recovery observation and active management; do not discharge from PACU. Address the parameter(s) scoring below 2. |
| 9–10 | Discharge-ready | Discharge criteria met **provided the oxygen saturation parameter scores 2** (SpO₂ > 92% on room air, or the unit's documented equivalent). Confirm against local discharge policy and anaesthetist sign-off. |

The threshold for discharge from PACU is **Aldrete ≥ 9 with the SpO₂ criterion
satisfied**. A total of 9 achieved while oxygen saturation scores below 2 is
treated as not ready, because a respiratory or oxygenation deficit is the
highest-risk parameter.

**Secondary instrument (day surgery):** Post-Anaesthesia Discharge Scoring
System (PADSS) — five criteria, each 0–2, total 0–10; **≥ 9** indicates
fitness for discharge home:

| Criterion | 2 | 1 | 0 |
| --- | --- | --- | --- |
| **Vital signs** (vs baseline) | ± 20% of baseline | ± 20–40% | ± > 40% |
| **Ambulation** | Steady gait, no dizziness | With assistance | Unable / dizziness |
| **Nausea and vomiting** | Minimal | Moderate, treated | Severe, persistent |
| **Pain** | Minimal, acceptable | Moderate | Severe |
| **Surgical bleeding** | Minimal | Moderate | Severe |

PADSS is optional and applies only to ambulatory patients; it does not replace
the Aldrete score for PACU discharge.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Recovery context | recording nurse name and role, supervising anaesthetist, date and time of PACU admission, anaesthetic technique, procedure |
| 2 | Patient identification | patient identifier, age band, sex, ASA physical status, pre-anaesthetic baseline blood pressure |
| 3 | Aldrete — activity | voluntary limb movement on command → activity score |
| 4 | Aldrete — respiration | breathing effort / cough / ventilation → respiration score |
| 5 | Aldrete — circulation | blood pressure deviation from baseline → circulation score |
| 6 | Aldrete — consciousness | level of arousal → consciousness score |
| 7 | Aldrete — oxygen saturation | SpO₂ and supplemental-oxygen need → oxygen-saturation score |
| 8 | Airway, pain and PONV | airway status, pain score, PONV severity, analgesia and antiemetics given |
| 9 | PADSS (day surgery, optional) | vital signs, ambulation, nausea and vomiting, pain, surgical bleeding |
| 10 | Summary and score | computed Aldrete total and readiness band, PADSS total (if used), fired parameters, red-flag issues, discharge recommendation, free-text recovery note |

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
  decision-support scoring tool; the output documents that discharge criteria
  are met rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Aldrete J.A., Kroulik D. A postanesthetic recovery score. *Anesthesia &
  Analgesia* 1970; 49(6):924–934.
- Aldrete J.A. The post-anesthesia recovery score revisited. *Journal of
  Clinical Anesthesia* 1995; 7(1):89–91 (the modified score using pulse
  oximetry).
- Chung F. Discharge criteria — a new trend (PADSS). *Canadian Journal of
  Anaesthesia* 1995; 42(11):1056–1058.
- Association of Anaesthetists. *Immediate post-anaesthesia recovery* (2013).
- Royal College of Anaesthetists. *Guidelines for the Provision of Anaesthesia
  Services (GPAS): Post-anaesthesia care* (current edition).

## Verify

```sh
bin/test-form post-anaesthesia-care-unit-record
```
