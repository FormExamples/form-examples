# PAR-Q+ and AUDIT-C — instrument reference and rule IDs

This form wraps two real, validated instruments. This page documents both
faithfully and maps every question and threshold to the rule and flag IDs
used by the engine (`grader.ts` / `composite-grader.js`) and the SQL schema.

## PAR-Q+ (Physical Activity Readiness Questionnaire for Everyone)

Source: PAR-Q+ Collaboration, 2011 revision. Warburton DER, Jamnik VK, Bredin
SSD, Gledhill N. *The Physical Activity Readiness Questionnaire for Everyone
(PAR-Q+) and Electronic Physical Activity Readiness Medical Examination
(ePARmed-X+).* Health & Fitness Journal of Canada 2011;4(2):3–17.

| # | Column | Question | Rule ID |
| --- | --- | --- | --- |
| 1 | `parq_diagnosed_heart_condition` | Has a doctor ever diagnosed you with a heart condition? | `R-PARQ-1` |
| 2 | `parq_chest_pain_at_rest` | Do you feel pain in your chest at rest? | `R-PARQ-2` |
| 3 | `parq_chest_pain_during_activity` | Do you feel pain in your chest during, or caused by, physical activity in the last month? | `R-PARQ-3` |
| 4 | `parq_dizziness_or_loss_of_consciousness` | Do you lose balance because of dizziness, or have you lost consciousness, in the last 12 months? | `R-PARQ-4` |
| 5 | `parq_other_chronic_medical_condition` | Have you been diagnosed with another chronic medical condition? | `R-PARQ-5` |
| 6 | `parq_prescribed_medication_for_chronic_condition` | Are you currently taking prescribed medication for a chronic medical condition? | `R-PARQ-6` |
| 7 | `parq_bone_or_joint_problem` | Do you have a bone, joint, or soft-tissue problem that could be made worse by becoming more physically active? | `R-PARQ-7` |

**Clearance logic** (`R-PARQ-CLEARANCE`): all seven items `no` →
`parqPlusClearance = 'cleared'`. Any item `yes` →
`parqPlusClearance = 'further-assessment-required'`, which raises the
`parq-positive-medical-clearance-needed` flag (medium priority).

### Deliberate scope simplification

The real PAR-Q+ instrument branches from a "yes" answer into condition-specific
supplementary questionnaires (cardiovascular, respiratory, musculoskeletal,
metabolic, mental health, and more — one page per condition), each ending in a
follow-up decision by a qualified exercise professional. This form does not
reproduce those supplementary questionnaires; see `spec/index.md` §2 for the
rationale. The single `further-assessment-required` state and its flag are
the extent of the follow-up this form performs; the report text directs the
person to a qualified exercise professional or their GP for the full
supplementary assessment before starting.

## AUDIT-C (Alcohol Use Disorders Identification Test — Consumption)

Source: Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. *The AUDIT
alcohol consumption questions (AUDIT-C): an effective brief screening test for
problem drinking.* Archives of Internal Medicine 1998;158(16):1789–95.

Identical structure and scoring to
[`forms/alcohol-use-disorders-identification-test-consumption/`](../../alcohol-use-disorders-identification-test-consumption)
and the alcohol domain in
[`forms/perioperative-optimization/`](../../perioperative-optimization).

| # | Column | Item | Range | Rule ID |
| --- | --- | --- | --- | --- |
| 1 | `audit_c_frequency` | How often do you have a drink containing alcohol? | 0–4 | `R-AUDITC-1` |
| 2 | `audit_c_typical_quantity` | How many standard drinks do you have on a typical drinking day? | 0–4 | `R-AUDITC-2` |
| 3 | `audit_c_binge_frequency` | How often do you have six or more drinks on one occasion? | 0–4 | `R-AUDITC-3` |

**Score** (`R-AUDITC-SCORE`): `auditCScore` = sum of the three items, 0–12.
`null` when all three are unanswered.

**Band** (`R-AUDITC-BAND`):

| Band | Rule |
| --- | --- |
| `low` | below the at-risk threshold |
| `increasing-risk` | score ≥ 5 (assessor-recorded sex `male`) or ≥ 4 (`female`) |
| `higher-risk` | score ≥ 8, either sex — raises the `alcohol-higher-risk` flag (high priority) |

## Composite risk band rules

| Rule ID | Fires when | Band |
| --- | --- | --- |
| `R-COMPOSITE-URGENT` | `symptom_unexplained_chest_pain = yes` or `symptom_dizzy_spells_or_fainting = yes` | `refer-urgently` |
| `R-COMPOSITE-HIGH-SYMPTOM` | any other step 7 symptom `yes` | `high` |
| `R-COMPOSITE-HIGH-AUDITC` | `auditCBand = 'higher-risk'` | `high` |
| `R-COMPOSITE-HIGH-FAMILY` | `family_history_premature_cardiac_event = yes` and any chronic condition `yes` | `high` |
| `R-COMPOSITE-MODERATE-PARQ` | `parqPlusClearance = 'further-assessment-required'` | `moderate` |
| `R-COMPOSITE-MODERATE-AUDITC` | `auditCBand = 'increasing-risk'` | `moderate` |
| `R-COMPOSITE-MODERATE-CONDITION` | exactly one chronic condition `yes`, no red-flag symptom | `moderate` |
| `R-COMPOSITE-LOW` | default | `low` |

Max-grade: the highest-ranked rule that fires wins (`refer-urgently` >
`high` > `moderate` > `low`).

## Safety flag categories

See `spec/index.md` §8 for the full flag table and `AGENTS.md` for the
independence-from-override rule (flags are never suppressed by the assessor's
final risk band).
