# Domain standards — International Patient Summary

## ISO 27269 — International Patient Summary

The International Patient Summary (IPS) is normatively specified by
**ISO 27269:2021 Health Informatics — International Patient Summary**.
The standard defines the minimal, specialty-agnostic data set required
to support unplanned cross-border care.

- ISO 27269:2021. <https://www.iso.org/standard/79491.html>
- ISO/TC 215 — Health Informatics technical committee home.
  <https://www.iso.org/committee/54960.html>

A complementary European Norm exists as **EN 17269:2019 The Patient
Summary for unplanned, cross-border care** published by CEN.
<https://www.cencenelec.eu/areas-of-work/cen-cenelec-topics/digital-society/ehealth/>

## HL7 FHIR — International Patient Summary IG

The implementation guide used for FHIR conformance in this form is
**HL7 FHIR International Patient Summary IG**. The IG is published in
both R4 and R5 variants; this form targets R5.

- HL7 IG portal: <http://hl7.org/fhir/uv/ips/>
- The IG's `Composition` profile is `Composition-uv-ips`.
- The IG's `Bundle` profile is `Bundle-uv-ips`.
- The narrative document type is **LOINC 60591-5** — *Patient summary
  Document*. <https://loinc.org/60591-5/>

### IPS mandatory sections

Per the IG `Composition-uv-ips` profile, the *required* sections are:

- Allergies and Intolerances — LOINC 48765-2
- Medication Summary — LOINC 10160-0
- Problem List — LOINC 11450-4

The *recommended* sections include:

- Immunizations — LOINC 11369-6
- History of Procedures — LOINC 47519-4
- Medical Devices — LOINC 46264-8
- Results — LOINC 30954-2
- Past History of Illness — LOINC 11348-0
- Pregnancy History — LOINC 10162-6
- Social History — LOINC 29762-2
- Functional Status — LOINC 47420-5
- Plan of Care — LOINC 18776-5
- Advance Directives — LOINC 42348-3

The IG itself is the source of truth; the LOINC codes above are the
canonical bindings declared on the profile.

## Terminology bindings

The IPS IG is precise about value sets — these are the principal
terminologies bound:

- **SNOMED CT** *International Edition* — problems, allergies,
  procedures, devices. <https://www.snomed.org/>
- **ICD-10** — alternative problem coding where SNOMED CT is
  unavailable. <https://icd.who.int/browse10/2019/en>
- **LOINC** — laboratory observations and section codes.
  <https://loinc.org/>
- **ATC / WHO DDD** — medications (Anatomical Therapeutic Chemical
  classification). <https://www.whocc.no/atc_ddd_index/>
- **EDQM Standard Terms** — pharmaceutical dose form, route of
  administration. <https://standardterms.edqm.eu/>
- **UCUM** — units of measure. <https://ucum.org/>

## Related IHE profile

- **IHE PCC** — Patient Care Coordination Technical Framework. The
  *Cross-Enterprise Sharing of Patient Summaries (XPHR)* and
  *International Patient Summary (IPS)* content profiles.
  <https://www.ihe.net/resources/technical_frameworks/#pcc>

## EU / UK programmes

- **MyHealth@EU** (formerly *eHDSI*) — the European Commission's
  cross-border patient summary exchange infrastructure that
  operationalizes the IPS in EU member states.
  <https://health.ec.europa.eu/ehealth-digital-health-and-care/electronic-cross-border-health-services_en>
- **NHS England UK Core FHIR IG** — the UK national FHIR profile set.
  The UK does not currently publish a UK-specific IPS profile; the
  international `Composition-uv-ips` is used directly.
  <https://digital.nhs.uk/services/fhir-uk-core>
