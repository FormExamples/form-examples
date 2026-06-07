# IPS Bundle validation

The FHIR R5 output of this form is an IPS-conformant `Bundle`
serialised by the `/ips` server endpoint. Validation is performed
both client-side (rule-based completeness validator) and against the
official IPS IG using the FHIR validator.

## Validation tooling

- **HL7 FHIR Validator (Java)** — the reference validator. Validates
  `Bundle-uv-ips` resources against the IG canonical URL.
  <https://confluence.hl7.org/spaces/FHIR/pages/35718580/Using+the+FHIR+Validator>
- **Inferno IPS Test Kit** — ONC Inferno conformance test suite for
  IPS. <https://inferno.healthit.gov/test-kits/international-patient-summary/>
- **NPM ig-publisher** — used to refresh the IG locally.
  <https://confluence.hl7.org/spaces/FHIR/pages/35718629/IG+Publisher+Documentation>

## Completeness validator categories

The three-band completeness label produced by this form maps to the
IPS IG cardinality profile:

- **Complete** — all *required* IPS sections (Allergies, Medications,
  Problems) are populated **and** all recommended sections that this
  IG marks as `must support` are populated.
- **Partial** — all *required* sections populated; one or more
  recommended sections empty.
- **Incomplete** — at least one *required* section empty or absent.

This is an implementation-level interpretation; the IG itself does
not define such a label.

## Conformance reminders

- The `Composition.subject` SHALL reference an IPS Patient profile
  conformant resource.
- The `Bundle.type` SHALL be `document`.
- The `Bundle.identifier` SHALL be globally unique (UUID URN
  recommended).
- The `Composition.date` SHALL be authoring time; immutable for the
  lifetime of the document.
- Narrative blocks SHALL be present for the Composition and for each
  Section resource — see the FHIR base specification on narrative
  generation. <http://hl7.org/fhir/narrative.html>

## Cross-border identifier handling

For cross-border use, patient identifiers are typically national
schemes (e.g. NHS number for the UK, ENI for Italy, CPR for Denmark).
The IPS IG does not mandate a specific identifier system; the
`Patient.identifier.system` URI should resolve to a published
identifier registry — see *HL7 FHIR Naming System Registry*.
<http://hl7.org/fhir/identifier-registry.html>

The UK NHS number system URI is
`https://fhir.nhs.uk/Id/nhs-number` per the UK Core FHIR IG.
<https://simplifier.net/HL7FHIRUKCoreR4/UKCore-Patient>
