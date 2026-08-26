# Clinical prioritization — P1 to P6

The P1–P6 clinical priority codes used by this form originate from
the Royal College of Surgeons of England *Clinical Guide to Surgical
Prioritization during the Coronavirus Pandemic* and are now embedded
in the NHS England *Elective Recovery* framework.

- Royal College of Surgeons of England. *Clinical Guide to Surgical
  Prioritization during the Coronavirus Pandemic.* April 2020 (NHS
  England-adopted).
  <https://www.rcseng.ac.uk/coronavirus/clinical-prioritization-of-elective-surgery/>
- Federation of Surgical Specialty Associations. *Clinical Guide for
  the Management of Surgical Priorities during the Coronavirus
  Pandemic.* Maintained version:
  <https://fssa.org.uk/covid-19_documents.aspx>
- NHS England. *Clinical validation of waiting lists — operational
  guidance.*
  <https://www.england.nhs.uk/elective-care-transformation/>

## Priority bands

| Priority | Maximum wait | Indication |
| --- | --- | --- |
| P1a | 24 hours | Emergency — immediate, life-threatening |
| P1b | 72 hours | Urgent — within 72 hours of decision to operate |
| P2 | 4 weeks | Surgery to be performed within 1 month; substantial harm if delayed |
| P3 | 12 weeks | Surgery within 3 months; risk of harm if delayed > 3 months |
| P4 | 18 weeks (RTT) | Surgery > 3 months; covered by the standard 18-week pathway |
| P5 | 6 months (>) | Deferred surgery — patient choice or capacity |
| P6 | N/A | Removed from list (treated, declined, deceased, moved) |

P5 and P6 codes were introduced post-pandemic to support deferred and
removed-from-list tracking; the original RCS guidance ran only to P4.

## Cancer two-week wait

A separate national standard applies to suspected-cancer referrals:
the *Faster Diagnosis Standard* requires that 75% of patients
referred urgently for suspected cancer receive a diagnosis or
exclusion within 28 days.

- NHS England. *Faster Diagnosis Standard.*
  <https://www.england.nhs.uk/cancer/faster-diagnosis/>

The form's *Cancer two-week wait* additional flag fires when:

- `referralReasonText` matches a suspected-cancer pattern, **and**
- `nextAppointmentDate − referralDate > 14 days`.

The 14-day threshold is the legacy *Two Week Wait* standard, which
the Faster Diagnosis Standard supplements (not replaces) for the
initial referral-to-first-appointment leg.

## Multi-pathway interaction

Patients can appear on multiple pathways simultaneously (for example,
a P2 cancer pathway and a P4 routine pathway for an unrelated
condition). This form captures **one** pathway per card; clinical
governance for multi-pathway patients sits in the local PAS.
