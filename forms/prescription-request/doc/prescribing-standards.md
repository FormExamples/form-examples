# Prescription writing standards

## United Kingdom

### Royal Pharmaceutical Society (RPS) / British National Formulary (BNF)

The canonical UK prescription-writing standard is set out in the
*British National Formulary*, chapter *Guidance on prescribing →
prescription writing*.

- BNF. *Guidance on prescribing.*
  <https://bnf.nice.org.uk/guidance/prescription-writing/>
- BNF for Children.
  <https://bnfc.nice.org.uk/guidance/prescription-writing/>
- Royal Pharmaceutical Society. *Professional Standards for the
  Reporting, Learning, Sharing, Taking Action and Review of
  Incidents.* <https://www.rpharms.com/standards>

Required elements of a UK prescription per the BNF:

- Patient name, address, age (if under 12 or over 60), NHS number.
- Date of prescription.
- Drug name (generic where possible; brand only where clinically
  necessary).
- Pharmaceutical form (tablet, capsule, oral solution, etc.).
- Strength.
- Dose and frequency.
- Quantity to be supplied or treatment duration.
- Route of administration.
- Prescriber name, signature, address, and registration number.

### General Pharmaceutical Council (GPhC)

- GPhC. *Standards for pharmacy professionals.*
  <https://www.pharmacyregulation.org/standards>
- GPhC. *In practice: Guidance on prescribing.*
  <https://www.pharmacyregulation.org/guidance>

### NHS Electronic Prescription Service (EPS)

- NHS Digital. *Electronic Prescription Service.*
  <https://digital.nhs.uk/services/electronic-prescription-service>

EPS routes prescriptions electronically from prescriber to dispenser
via the NHS Spine. The form's *Request Type* field captures whether
the request is for EPS or paper FP10.

### Controlled drugs

- *Misuse of Drugs Regulations 2001.*
  <https://www.legislation.gov.uk/uksi/2001/3998/contents>
- NHS England / NICE. *Controlled drugs: safe use and management
  (NG46).* <https://www.nice.org.uk/guidance/ng46>

Schedule 2 and 3 controlled drugs require specific handwritten /
e-prescription elements; the BNF *Controlled drugs and drug
dependence* section is the operational reference.

## United States

### DEA prescription standards

- US Drug Enforcement Administration. *Prescription requirements.*
  <https://www.deadiversion.usdoj.gov/21cfr/cfr/1306/1306_03.htm>
- HHS *e-Prescribing* programme.
  <https://www.healthit.gov/topic/health-it-and-health-information-exchange-basics/eprescribing-eprescribing-prescription>

## Coding

- **dm+d** (Dictionary of medicines and devices) — the UK NHS
  prescription standard terminology.
  <https://services.nhsbsa.nhs.uk/dmd-browser/>
- **SNOMED CT UK Drug Extension** — derived from dm+d.
- **RxNorm** (US NLM) — the US national medication terminology.
  <https://www.nlm.nih.gov/research/umls/rxnorm/>
- **ATC / WHO DDD** — international medication classification.
  <https://www.whocc.no/atc_ddd_index/>

## FHIR

- HL7 FHIR. *MedicationRequest.*
  <http://hl7.org/fhir/medicationrequest.html>
- HL7 FHIR. *Medication.*
  <http://hl7.org/fhir/medication.html>
- HL7 FHIR. *MedicationDispense.*
  <http://hl7.org/fhir/medicationdispense.html>

UK profile: *UK Core MedicationRequest* in the *UK Core FHIR
Implementation Guide*.
<https://digital.nhs.uk/services/fhir-uk-core>
