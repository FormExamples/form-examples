# UK NHS England Medical Exemption Certificate (FP92A)

A digital implementation of the **FP92A** application form completed by a UK
doctor (or other health professional with access to the patient's medical
records) to apply for a **Medical Exemption (MedEx) Certificate** for NHS
prescription charges in England.

A valid MedEx certificate entitles the holder to **free NHS prescriptions** for
five years (renewable). Eligibility is restricted to the closed list of
qualifying medical conditions defined by the NHS Business Services Authority
(NHSBSA). The decision is binary — eligible or not eligible — and is determined
entirely by clinical attestation against one or more of the listed conditions.

## Source

- **Form:** FP92A — Application for a medical exemption certificate
- **Issuing authority:** NHS Business Services Authority (NHSBSA),
  Medical Exemption Certificates, Bridge House, 152 Pilgrim Street,
  Newcastle upon Tyne, NE1 6SN
- **Knowledge base:** <https://faq.nhsbsa.nhs.uk/knowledgebase/article/KA-03719/en-us>
- **Ordering portal (practitioners):** [Primary Care Support England (PCSE)](https://pcse.england.nhs.uk/)
- **Ordering portal (ICBs / SICBLs):** Xerox UK Limited
- **Online prescription help check:** <https://check-for-help-paying-nhs-costs.nhsbsa.nhs.uk/start>

## Who completes it

Only a **registered medical practitioner** or **health professional with
access to the patient's medical records** may complete the FP92A. The patient
section is patient-supplied; the clinical section is the practitioner's signed
attestation. NHSBSA only accepts the **original paper form** posted to Bridge
House — they do not accept photocopies, scans, email attachments, downloaded
copies, or printed copies. This monorepo implements a digital staging form to
prepare and review the data ahead of printing and posting.

## Eligible conditions

The NHSBSA recognizes exactly ten qualifying conditions:

1. **A permanent fistula** (for example caecostomy, colostomy, laryngostomy, or
   ileostomy) requiring continuous surgical dressing or an appliance.
2. **A form of hypoadrenalism** — for example Addison's disease — for which
   specific substitution therapy is essential.
3. **Diabetes insipidus** and **other forms of hypopituitarism**.
4. **Diabetes mellitus**, except where treatment is by diet alone.
5. **Hypoparathyroidism**.
6. **Myasthenia gravis**.
7. **Myxoedema** (hypothyroidism requiring thyroid hormone replacement).
8. **Epilepsy** requiring continuous anticonvulsive therapy.
9. **A continuing physical disability** that means the person cannot go out
   without the help of another person (excludes temporary disability such as a
   broken leg).
10. **Cancer** — undergoing treatment for cancer, the effects of cancer, or
    the effects of current or previous cancer treatment.

## Validity and renewal

- Standard validity: **5 years** from the date of issue.
- Cancer-related certificates: 5 years from the date the certificate is issued
  (renewable for ongoing treatment).
- Continuing physical disability: 5 years (renewable if disability persists).
- A renewal application is made on a fresh FP92A.

## Scoring / grading

The grading engine is intentionally simple — it is an **eligibility
determination**, not a clinical risk score:

| Outcome | Driver |
| --- | --- |
| `eligible` | At least one declared and clinician-confirmed qualifying condition. |
| `ineligible` | No qualifying condition declared, or only excluded conditions (e.g. diet-only diabetes). |
| `requires-clarification` | Cancer diagnosis pending histology, or "continuing physical disability" without home-care attestation. |

Safety flags fire independently of the outcome:

- **Diet-only diabetes** declared — *ineligible* (educational flag).
- **Temporary disability** declared (e.g. broken leg) — *ineligible*.
- **Pregnancy** declared — direct the applicant to **FW8** (maternity exemption)
  instead.
- **Aged 60 or over** — eligible for free prescriptions on age grounds; no
  FP92A required.
- **Aged under 16, or 16–18 in full-time education** — eligible on age grounds.
- **Missing practitioner signature** — application incomplete.
- **Missing NHS number** — application incomplete (NHSBSA needs it to match
  the patient record).
- **Conflicting renewal** — an active certificate already exists; renewal
  should be timed within the renewal window.

## 10-step single-page wizard

The form is implemented as a single-page step-by-step wizard. Each step is a
section of the FP92A.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Practitioner identification | Practitioner name, role, GMC/NMC/HCPC registration body and number, practice / surgery name, address, telephone, practice code, date of completion |
| 2 | Patient identification | Title, surname, forenames, date of birth, sex, full UK postal address, postcode, NHS number, telephone, email (optional) |
| 3 | Existing exemption check | Existing valid certificate (yes/no), certificate number if any, expiry date, renewal indicator |
| 4 | Age-based exclusion check | Date of birth derives age; flag if eligible on age grounds (under 16, 16–18 in full-time education, 60+) |
| 5 | Pregnancy / maternity check | Pregnant or has been pregnant in the last 12 months → FW8 redirect |
| 6 | Qualifying condition selection | Select one or more from the 10 conditions (each with sub-detail) |
| 7 | Qualifying condition detail | Diagnosis date, ICD-10 / SNOMED code, treatment details (e.g. insulin regimen, anticonvulsant, thyroxine dose, anatomic site of fistula, cancer site & current treatment phase) |
| 8 | Disability / appliance attestation | For condition 1 (fistula) — appliance type; for condition 9 (disability) — whether patient can leave home unaided, carer details |
| 9 | Practitioner declaration | Signature, date, GMC/NMC/HCPC number, declaration of having access to the patient's medical records |
| 10 | Summary, eligibility result & sign-off | Computed outcome (eligible / ineligible / requires-clarification), fired rules, additional flags, recommended next action (post to NHSBSA / advise FW8 / advise age exemption / clarify), PDF preview |

## Output

- **PDF preview** matching the FP92A paper layout (for the practitioner to
  print, sign in ink, and post to NHSBSA Bridge House).
- **FHIR R5 Bundle** with `Patient`, `Practitioner`, `Coverage` (the medical
  exemption certificate), and `Condition` resources for the qualifying
  condition(s).
- **XML representation** for archival and import into legacy practice systems.
- **Protocol Buffers** schema for downstream services.
- **TypeSpec** model for API-first integration.

## Compliance

- [NHSBSA Prescription Charges and Exemptions](https://www.nhsbsa.nhs.uk/help-nhs-prescription-costs)
- [The National Health Service (Charges for Drugs and Appliances) Regulations 2015](https://www.legislation.gov.uk/uksi/2015/570/contents)
- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — **Class I** (administrative
  determination of entitlement, not a clinical decision).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 — Design and development of information for users.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Directory structure

```
united-kingdom-nhs-england-medical-exemption-certificate/
  index.md                                        # this file
  AGENTS.md                                       # agent instructions
  plan.md                                         # implementation roadmap
  tasks.md                                        # task tracking
  doc/                                            # documentation and references
  sql/                                 # Postgres Liquibase migrations
  xml/                            # XML + DTD per SQL table
  fhir/r5/                                        # FHIR R5 JSON resources
  protobuf/                                       # Protocol Buffers .proto schemas
  typespec/                                       # TypeSpec models
  front-end-with-html/                       # static single-page wizard
  front-end-with-svelte/                     # SvelteKit single-page wizard
  front-end-with-html/                  # static HTML review dashboard
  front-end-with-svelte/                # SVAR DataGrid dashboard
  back-end-with-loco/          # Rust axum + Loco JSON API
  back-end-with-loco-setup     # scaffold generator (shell script)
```

## Verify

```sh
bin/test-form united-kingdom-nhs-england-medical-exemption-certificate
```
