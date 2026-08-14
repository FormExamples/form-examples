# Safety case notes — provider transfer request

## Risk pathway — incomplete transfer

A transfer flagged *Incomplete* (mandatory SBAR or logistics fields
missing) must not proceed. The receiving clinician cannot reliably
take over care without complete handover.

- Joint Commission. *Sentinel Event Alert 58 — Inadequate hand-off
  communication.* 2017.
  <https://www.jointcommission.org/-/media/tjc/documents/resources/patient-safety-topics/sentinel-event/sea_58_hand_off_comms_9_6_17_final_(1).pdf>
- WHO. *Patient Safety Solutions — Communication during patient
  hand-overs.*
  <https://www.who.int/publications/i/item/communication-during-patient-hand-overs>

## Risk pathway — *Partial* transfer

A *Partial* transfer may proceed with a documented flag. Operational
expectation is that the receiving clinician is informed *before*
acceptance which non-mandatory fields are outstanding (e.g.
medication reconciliation pending, recent imaging report awaited).

## Acuity-mismatch risk

The receiving provider must be capability-matched to the patient's
clinical needs. The *Receiving Provider Details* step captures
provider type and capability; the form does **not** verify capability
against patient acuity — that is a human clinical decision by the
requesting clinician and is the principal safety mitigation.

## Medication reconciliation at handover

- NICE NG5. *Medicines optimisation.* §1.5 (medicines reconciliation
  at transfer of care).
  <https://www.nice.org.uk/guidance/ng5>
- Royal Pharmaceutical Society. *Keeping patients safe when they
  transfer between care providers.*
  <https://www.rpharms.com/resources/reports/getting-the-medicines-right>

The *Background* step (step 5) should include current medications;
the receiving provider performs reconciliation on arrival.

## Allergy disclosure

NICE CG183 expects allergy status to be transmitted on every
handover. The *Background* step is the correct place; receiving EHRs
must display the allergy on first patient open.

- NICE CG183. *Drug allergy: diagnosis and management.*
  <https://www.nice.org.uk/guidance/cg183>

## Read-back / acknowledgement

The *Sign-off & Acknowledgement* step is the formal closed-loop
confirmation. The receiving clinician's acknowledgement is the
operational marker that responsibility has transferred.

## Incident reporting

A handover that fails (e.g. accepting clinician refuses, patient is
mis-routed, key information lost) is reportable to LFPSE:

- NHS England. *Learn from patient safety events service.*
  <https://www.england.nhs.uk/patient-safety/learn-from-patient-safety-events-service/>

## Data protection

- Lawful basis (UK GDPR): Article 6(1)(e) public task; Article
  9(2)(h) provision of health care.
- Transfer message includes special-category data; encryption-in-
  transit is mandatory per the NHS *Data Security and Protection
  Toolkit*. <https://www.dsptoolkit.nhs.uk/>
- Audit trail of requesting clinician, receiving clinician, and
  timestamps is the minimum.

## Out of scope

- Bed-state and capacity matching — performed by the receiving
  organization's bed manager.
- Ambulance / patient-transport service tasking — separate workflow.
- Discharge documentation — separate form
  (`forms/hospital-discharge/`).
