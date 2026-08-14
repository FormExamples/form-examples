# Safety case notes — International Patient Summary

The IPS is a *patient-record exchange* artefact. It is consumed by a
clinician at the point of unplanned care; that clinician makes the
clinical decisions. The IPS itself does not diagnose, prescribe, or
triage.

## Risk pathway — incomplete or stale data

A summary marked **Partial** or **Incomplete** must be visibly
flagged to the receiving clinician. The IPS IG carries an authoring
timestamp on `Composition.date` and a confidentiality classification
on `Composition.confidentiality`; both must be surfaced in the
patient-facing and clinician-facing renderings.

- HL7 FHIR. *Composition resource.*
  <http://hl7.org/fhir/composition.html>
- WHO. *Patient Safety Solutions, Volume 1, Solution 6: Communication
  during patient hand-overs.* May 2007.
  <https://www.who.int/publications/i/item/communication-during-patient-hand-overs>

## Identification at the point of care

Patient mis-identification is the most common cross-border error.
Implementers SHOULD follow the WHO patient-identification solution:

- WHO. *Patient Safety Solutions, Volume 1, Solution 2: Patient
  Identification.* May 2007.
  <https://www.who.int/publications/i/item/patient-identification>
- Two-factor identification at the point of consumption — name +
  date-of-birth at minimum, ideally with a third element (identifier
  or address).

## Medication safety

The Medication Summary is the highest-risk section in an IPS.
Conformance to ATC/WHO DDD coding and EDQM Standard Terms minimizes
ambiguity but does not eliminate it. The form enforces, but the
receiving system MUST also verify, the following:

- Active vs ceased — `MedicationStatement.status` MUST be set.
- Dose form — must be EDQM coded; free text alone is insufficient.
- Allergy cross-check — the receiving system should run an automated
  allergy/contraindication check against the Allergies section.
- WHO. *Medication Without Harm.*
  <https://www.who.int/initiatives/medication-without-harm>

## Privacy and confidentiality

- **EU eIDAS / GDPR Article 9** — cross-border health data exchange
  requires Article 9(2)(h) lawful basis (provision of health or social
  care) and Article 49 transfer safeguards where data leaves the EEA.
  <https://gdpr-info.eu/art-9-gdpr/>
- **UK GDPR / Data Protection Act 2018** — equivalent regime in the
  UK. <https://www.legislation.gov.uk/ukpga/2018/12/contents>
- **eHealth Network — Guideline on the cross-border exchange of
  Patient Summary.** Published by the European Commission eHealth
  Network. <https://health.ec.europa.eu/ehealth-digital-health-and-care/electronic-cross-border-health-services_en>

## Incident reporting

A clinical harm event resulting from a defective or misleading IPS
is reportable under the consuming jurisdiction's incident system:

- UK: NHS England *Learn from patient safety events (LFPSE)*.
  <https://www.england.nhs.uk/patient-safety/learn-from-patient-safety-events-service/>
- US: ECRI and ISMP. *Patient Safety Organization (PSO).*
  <https://www.ecri.org/pso>
- EU: national pharmacovigilance / device authorities; the MyHealth@EU
  national contact point.
