# Regulatory and policy context — inter-provider transfer

## UK — Transfer of care

The PRSB has published a *Transfer of Care* standards family that
covers the principal NHS handover artefacts. The closest standard to
this form is:

- Professional Record Standards Body. *Outpatient letter standard.*
  <https://theprsb.org/standards/outpatientletter/>
- PRSB. *Standards.* <https://theprsb.org/standards/>

For inter-team and inter-organization transfers, the *PRSB Core
Information Standard* defines the common dataset.

- PRSB. *Core information standard.*
  <https://theprsb.org/standards/coreinformationstandard/>

## NICE — transition guidance

- NICE NG27. *Transition between inpatient hospital settings and
  community or care home settings for adults with social care
  needs.* <https://www.nice.org.uk/guidance/ng27>
- NICE NG94. *Emergency and acute medical care in over 16s.*
  <https://www.nice.org.uk/guidance/ng94>

## NHS England — Patient Safety Incident Response Framework

The PSIRF replaces the older Serious Incident Framework and sets the
expectation that handover-failure incidents are subject to a
*Patient Safety Incident Investigation* (PSII) when severity
warrants.

- NHS England. *Patient Safety Incident Response Framework.*
  <https://www.england.nhs.uk/patient-safety/patient-safety-incident-response-framework/>

## US — Joint Commission

- The Joint Commission. *National Patient Safety Goals.*
  <https://www.jointcommission.org/standards/national-patient-safety-goals/>
- Joint Commission. *Sentinel Event Alert 58: Inadequate hand-off
  communication.* September 2017.
  <https://www.jointcommission.org/-/media/tjc/documents/resources/patient-safety-topics/sentinel-event/sea_58_hand_off_comms_9_6_17_final_(1).pdf>

## WHO — patient safety

- WHO. *Communication during patient hand-overs.* Patient Safety
  Solutions Volume 1, Solution 3, May 2007.
  <https://www.who.int/publications/i/item/communication-during-patient-hand-overs>
- WHO. *Global Patient Safety Action Plan 2021–2030.*
  <https://www.who.int/teams/integrated-health-services/patient-safety/policy/global-patient-safety-action-plan>

## FHIR exchange

- HL7 FHIR. *Communication* — handover message resource.
  <http://hl7.org/fhir/communication.html>
- HL7 FHIR. *CommunicationRequest.*
  <http://hl7.org/fhir/communicationrequest.html>
- HL7 FHIR. *Task* — used for *Request Transfer / Accept Transfer*
  workflow. <http://hl7.org/fhir/task.html>
- HL7 FHIR. *Composition* — used when the handover is sent as a
  document (e.g. PDF attached).
  <http://hl7.org/fhir/composition.html>

The form's output is rendered both as a clinician-facing PDF (for
the human handover conversation) and as a FHIR Bundle (for system-
to-system exchange).

## Equality and accessibility

- *Equality Act 2010.*
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- NHS England. *Accessible Information Standard.*
  <https://www.england.nhs.uk/about/equality/equality-hub/patient-equalities-programme/equality-frameworks-and-information-standards/accessibleinfo/>

The patient's communication needs flagged at intake must be carried
through the transfer message so that the receiving clinician knows
what format / interpreter is required.
