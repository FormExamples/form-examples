# Neuropsychiatry Waiting List Card — reference documentation

Clinical, policy, and operational reference material used to ground the
Neuropsychiatry Waiting List Card.

## NHS England Referral to Treatment (RTT)

The card uses the RTT clock-start date as the canonical "joined the list"
timestamp. The clock starts on the date the referral is received by the
provider and continues until first definitive treatment, the patient is
discharged back to the referrer, or the patient declines treatment. The
nationally-mandated maximum wait under the NHS Constitution is **18 weeks**
from clock-start to first definitive treatment for non-urgent referrals.

A patient still on the list at **52 weeks** is a *long waiter* and is
subject to mandatory harm-review and patient-contact processes.

## NHS England Clinical Prioritization

NHS England's clinical prioritization framework (introduced during the
COVID-19 elective recovery programme and retained for ongoing use) sets
maximum permitted waits by priority:

| Priority | Description | Maximum wait |
| --- | --- | --- |
| P1a | Emergency surgery | 24 hours |
| P1b | Urgent surgery | 72 hours |
| P2 | Cancer / time-critical | 4 weeks |
| P3 | Substantial harm risk if delayed > 3 months | 12 weeks |
| P4 | Routine (covered by the 18-week RTT standard) | 18 weeks |
| P5 | Deferred — patient choice or capacity | 6 months |
| P6 | Removed from list | — |

The card stores the priority assigned at referral and uses it to compute
the *days to target* and *days to breach* values shown on the
practitioner dashboard and the patient card.

## NHS England suspected-cancer two-week wait

Patients referred with suspected cancer have a separate maximum wait of
**14 days** to first specialist appointment. The card surfaces a
`two-week-wait-cancer` flag when `suspected_cancer = 'yes'` and the next
appointment is more than 14 days away.

## Waiting Time Status bands

The composite engine emits one of four bands:

| Band | Trigger |
| --- | --- |
| `within-target` | Days waited ≤ priority target and ≤ 18 weeks. |
| `approaching-breach` | Within 4 weeks of priority target *or* the 18-week RTT standard. |
| `breached` | Past priority target *or* > 18 weeks since clock-start. |
| `long-wait` | > 52 weeks since clock-start (overrides all other bands). |

## References

- NHS England. *Referral to Treatment (RTT) consultant-led waiting times —
  Rules Suite*. <https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/>
- NHS England. *Clinical validation of waiting lists* operational guidance.
- NHS England. *Clinical prioritization* framework (P1–P6).
- NHS England. *Elective recovery plan*.
- NHS Constitution for England.
- Royal College of Surgeons of England. *Clinical guide to surgical
  prioritization during the coronavirus pandemic* (P1–P4 origin).
