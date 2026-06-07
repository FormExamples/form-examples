# Completion Protocol

This document specifies how the digital checklist drives the three phases,
how completion is determined, and how safety flags are computed.

## Phase 1 — Sign In (before induction of anaesthesia)

| # | Item | Required answer | Required participant |
| --- | --- | --- | --- |
| 1 | Patient has confirmed identity, site, procedure, consent | `yes` | patient + nurse + anaesthetist |
| 2 | Site marked | `yes` or `not-applicable` (for bilateral / midline procedures) | surgeon (in advance) |
| 3 | Anaesthesia machine and medication check complete | `yes` | anaesthetist |
| 4 | Pulse oximeter on patient and functioning | `yes` | anaesthetist + nurse |
| 5 | Known allergy | `no` or `yes` + detail | anaesthetist |
| 6 | Difficult airway / aspiration risk | `no` or `yes-equipment-available` | anaesthetist |
| 7 | Risk of >500 ml blood loss (7 ml/kg in children) | `no` or `yes-two-ivs-and-fluids-planned` | anaesthetist + nurse |

Sign In is complete when every item is answered, the coordinator
(typically the circulating nurse) is recorded, and a sign-off timestamp
is captured.

## Phase 2 — Time Out (before skin incision)

| # | Item | Required answer / form | Required participant |
| --- | --- | --- | --- |
| 1 | Team introductions confirmed | `yes` | coordinator |
| 2 | Patient name, procedure, incision site verbally confirmed | `yes` | nurse + surgeon + anaesthetist |
| 3 | Antibiotic prophylaxis given within the last 60 minutes | `yes` or `not-applicable` | anaesthetist |
| 4 | Surgeon: critical or non-routine steps | free text | surgeon |
| 5 | Surgeon: expected case duration | minutes | surgeon |
| 6 | Surgeon: expected blood loss | millilitres | surgeon |
| 7 | Anaesthetist: patient-specific concerns | free text | anaesthetist |
| 8 | Nursing: sterility confirmed (including indicator results) | `yes` | nurse |
| 9 | Nursing: any equipment issues or concerns | free text | nurse |
| 10 | Essential imaging displayed | `yes` or `not-applicable` | surgeon |

Time Out is complete when items 1–10 are answered, the coordinator is
recorded, and a sign-off timestamp is captured.

## Phase 3 — Sign Out (before patient leaves the OR)

| # | Item | Required answer / form |
| --- | --- | --- |
| 1 | Nurse verbally confirms name of the procedure recorded | `yes` |
| 2 | Nurse verbally confirms instrument, sponge, and needle counts | `yes` |
| 3 | Nurse verbally confirms specimen labelling (read aloud, including patient name) | `yes` or `not-applicable` |
| 4 | Any equipment problems to be addressed | free text |
| 5 | To surgeon, anaesthetist, and nurse: key concerns for recovery and management of this patient | free text |

Sign Out is complete when items 1–5 are answered, the coordinator is
recorded, and a sign-off timestamp is captured.

## Case-level completion

| Case status | Driver |
| --- | --- |
| `not-started` | No phase items answered. |
| `sign-in-complete` | Sign In items answered + sign-off timestamp. |
| `time-out-complete` | Sign In + Time Out items answered + sign-off timestamps. |
| `sign-out-complete` | All three phases items answered + sign-off timestamps. |
| `completed` | Synonym for `sign-out-complete`; emitted after a final attestation. |
| `abandoned` | Case cancelled before sign-out. Requires a free-text reason. |

## Safety flag computation

Flags are computed continuously from the captured answers. Each flag
carries a priority (high / medium / low) and surfaces on the dashboard
banner.

| Flag | Trigger | Priority |
| --- | --- | --- |
| `identity_not_confirmed` | Sign In item 1 unanswered or "no" | high |
| `site_not_marked` | Sign In item 2 = "no" (and not bilateral/midline) | high |
| `anaesthesia_check_incomplete` | Sign In item 3 = "no" | high |
| `pulse_oximeter_not_functioning` | Sign In item 4 = "no" | high |
| `known_allergy_flagged` | Sign In item 5 = "yes" | medium |
| `difficult_airway_risk` | Sign In item 6 = "yes" | medium |
| `high_blood_loss_risk` | Sign In item 7 = "yes" | medium |
| `antibiotic_prophylaxis_missed` | Time Out item 3 = "no" | high |
| `sterility_not_confirmed` | Time Out item 8 = "no" | high |
| `imaging_missing` | Time Out item 10 = "no" (and not n/a) | medium |
| `count_discrepancy` | Sign Out item 2 = "no" | high |
| `specimen_labelling_missed` | Sign Out item 3 = "no" | high |
| `equipment_problem` | Sign Out item 4 has content | medium |

## Coordinator role

Each phase is signed off by a coordinator (the circulating nurse, or a
named alternative). The coordinator role is captured as a foreign key to
the `clinician` table; the coordinator is responsible for the verbal
confirmation of each item with the named participants.

## Team roster

The Time Out introductions step ("introduce themselves by name and role")
is captured in the `team_member` collection linked to the checklist:
name, role, and whether the person was introduced. This is the audit
evidence for NHS England NatSSIPs 2 "team brief" requirements.

## Abandoned case handling

A case can be marked `abandoned` at any phase. The form captures:

- Phase at which abandonment occurred.
- Coordinator who recorded the abandonment.
- Free-text reason.
- Whether a Datix / incident report has been filed (yes / no).

Abandonment does not negate the completed phases; the completed phases
are retained in the audit record.

## References

- WHO *Implementation Manual* (2008) — see the Safe Surgery programme
  page:
  <https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery>
- WHO *Starter Kit* (Version 1.0) —
  <https://cdn.who.int/media/docs/default-source/patient-safety/safe-surgery/starter_kit-sssl.pdf>
- NHS England NatSSIPs 2 —
  <https://www.cas.mhra.gov.uk/ViewandAcknowledgment/ViewAlert.aspx?AlertID=103218>
