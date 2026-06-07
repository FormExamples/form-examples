# Safety Case Notes

This document records the safety-classification rationale for the digital
WHO Surgical Safety Checklist and the safety-related design choices in
the form.

## Intended purpose

The form is a **process-adherence record** for the WHO Surgical Safety
Checklist (First Edition, 2008). It does not:

- Diagnose any condition.
- Recommend any treatment.
- Calculate any clinical risk score or drive any clinical decision.

It captures structured "yes / no / not-applicable / free text" entries
made by the operating team and produces:

- A timestamped audit record of the three phases (Sign In, Time Out, Sign
  Out).
- A team-member roster.
- A set of binary safety flags (e.g. `identity_not_confirmed`) derived
  mechanically from the entries.

## MDR / IVDR classification (MDCG 2019-11 Rev.1)

Applying MDCG 2019-11 Rev.1 to the form:

- Rule 11 of MDR Annex VIII (software intended to provide information
  used to take decisions with diagnostic or therapeutic purposes) does
  **not** apply: the form does not provide diagnostic or therapeutic
  information, only adherence prompts that mirror the WHO checklist.
- Therefore the device, if classed as a medical device at all, is **Class
  I** — process-adherence recording rather than clinical decision support.

The form's safety flags (e.g. `count_discrepancy`) are direct
restatements of the team's own entries, not derived clinical conclusions;
they do not change the classification.

MDCG 2019-11 Rev.1:
<https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>

## UK Medical Devices Regulations 2002

The UK Medical Devices Regulations 2002 (SI 2002/618) implement the same
classification at the UK level. The form is registered (where required)
as Class I.

<https://www.legislation.gov.uk/uksi/2002/618/contents>

## MHRA Software and AI as a Medical Device

The MHRA work programme on Software and AI as a Medical Device sets out
expectations for software classification, post-market surveillance, and
clinical evaluation. The form is in scope insofar as it is a software
medical device; the safety claims do not invoke AI / machine-learning
techniques and so are unaffected by the AI-specific extensions.

<https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>

## Safety design choices

| Choice | Rationale |
| --- | --- |
| Three-phase wizard cannot be skipped | Mirrors the WHO checklist's strict phase ordering. |
| Each item must be explicitly answered (no implicit defaults) | Avoids false-positive completion. |
| Sign-off requires a named coordinator (FK to `clinician`) | Establishes individual accountability. |
| Safety flags are visible on the dashboard banner | Surfaces issues to the wider team. |
| Abandonment requires a reason | Supports root-cause analysis. |
| Team roster captures introduced/not-introduced | Aligns with NatSSIPs 2 team-brief evidence. |

## Verbal-confirmation principle

The WHO *Implementation Manual* (2008) is explicit that each item should
be verbally confirmed by the team, not silently ticked. The digital form
does not record audio; it relies on the coordinator's verbal practice and
the team's joint presence. The form's design choices (coordinator
identification, sign-off timestamp, role-keyed participants) align with
this principle but cannot enforce it: that remains a process
responsibility owned by the surgical service.

## Foreseeable misuse

Foreseeable misuse includes:

- Pre-populating items at the start of the case to "save time" — mitigated
  by no implicit defaults and the visible audit trail.
- Single-user completion (one person clicking through on behalf of the
  team) — mitigated by requiring a coordinator identifier and surfacing
  the absence of team-member rows in the Time Out introductions.
- Backdated sign-off after the case has finished — mitigated by recording
  the system timestamp and the user identifier alongside the entered
  timestamp.

## Risk control

The form mitigates risks through:

- Mandatory phase ordering.
- Mandatory coordinator identification.
- Real-time flag computation.
- Read-only audit trail (no entry overwriting; amendments are recorded
  as new entries).
- Local backup so that loss of network connectivity does not lose entered
  items.

These mitigations are recorded against the residual risks per ISO 14971
(risk management for medical devices).

## Post-market surveillance

The form supports post-market surveillance by:

- Producing exports (JSON, CSV, FHIR R5) for retrospective audit by the
  patient-safety team.
- Surfacing safety flag aggregates on the dashboard's stats panel.
- Recording user identity and timestamp on every entry so trends in
  near-miss events can be analysed.

This supports the trust's compliance with NHS England patient-safety
incident reporting:

<https://www.england.nhs.uk/patient-safety/>

## Standards alignment

- ISO/IEC/IEEE 26514:2022 — design of the user information for the
  team-facing wizard.
- ISO 14971 — risk management for medical devices (applied informally to
  the Class I device).
- ISO/IEC 62366-1 — usability engineering (applied informally).
