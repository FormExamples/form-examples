# International Certificate of Vaccination or Prophylaxis (ICVP)

An implementation of the WHO model **International Certificate of Vaccination
or Prophylaxis** ("yellow card"), the official document used under the
**International Health Regulations 2005, Annex 6** to record vaccinations or
prophylactic treatments that are required for international travel.

The certificate is issued by an authorised vaccination centre on behalf of a
**vaccinee** (traveller). It is validated by the **handwritten signature** of a
supervising clinician and the **uniform stamp** of the administering centre.
Yellow fever vaccination is currently the only vaccination that may be
required for entry under the IHR; polio vaccination has been documented on an
ICVP-style certificate in past WHO temporary recommendations. The data model
accepts any disease so that the same form can be reused for future PHEIC
recommendations.

## Scope and intended users

- **Setting:** WHO-designated yellow fever vaccination centre, travel-medicine
  clinic, port-health unit, military pre-deployment clinic.
- **Operator:** authorised supervising clinician (physician, nurse, pharmacist,
  or other healthcare professional authorised by the national health authority).
- **Vaccinee:** any traveller of any age requiring documentary proof of
  vaccination for international travel.
- **Verifier:** border-control officer, airline check-in agent, port-health
  officer.

## Legal and regulatory basis

- **International Health Regulations (2005), Annex 6** — the binding
  international legal instrument that defines the form, language, validity, and
  required fields.
- **WHO Model Certificate** — the official two-page yellow-card layout
  reproduced in the IHR.
- **CDC ICVP guidance** — operational guidance for issuing yellow fever ICVPs
  in the United States (<https://wwwnc.cdc.gov/travel/page/icvp>).
- **2016 IHR amendment** — yellow fever vaccination is valid for the lifetime
  of the vaccinee; the printed expiry date on the certificate must not be
  enforced.
- A medical contraindication is recorded as a **medical waiver** signed by the
  supervising clinician; destination countries may decline to accept it.

## Form fields

The ICVP is a two-section certificate. Section A identifies the vaccinee;
Section B is a repeating block recording each vaccination or prophylaxis
administered.

### Section A — vaccinee identity

| Field | Type | Required | Notes |
| --- | --- | :---: | --- |
| Surname | text | yes | exactly as it appears on the travel document |
| Given names | text | yes | exactly as it appears on the travel document |
| Date of birth | date | yes | day in figures, month in letters, year in figures |
| Sex | enum (male / female / other / unspecified) | yes | as recorded on the travel document |
| Nationality | ISO 3166-1 alpha-3 | yes | three-letter country code |
| National identification document | text | no | passport number or national ID number |
| Signature of vaccinee | image / consent flag | yes | handwritten on paper; consent flag for digital |

### Section B — vaccination or prophylaxis (one entry per disease)

| Field | Type | Required | Notes |
| --- | --- | :---: | --- |
| Disease | enum (yellow fever / polio / smallpox / cholera / meningococcal / COVID-19 / other) | yes | currently only yellow fever is internationally required |
| Vaccine or prophylaxis | text | yes | trade or generic name |
| Date of vaccination | date | yes | day in figures, month in letters, year in figures |
| Supervising clinician signature | image | yes | handwritten; **stamps are not acceptable** |
| Supervising clinician professional status | text | yes | e.g. "MD", "RN", "Pharmacist" |
| Manufacturer of vaccine | text | yes | as printed on the vial label |
| Batch number of vaccine | text | yes | as printed on the vial label |
| Certificate valid from | date | yes | 10 days after vaccination for yellow fever |
| Certificate valid until | date | yes | "life of the person vaccinated" for yellow fever (2016 IHR amendment) |
| Official stamp of administering centre | image | yes | uniform stamp registered with the national health authority |
| Medical waiver | boolean + reason | no | clinician-signed contraindication |

## Single-page wizard

The data-entry UI is a single-page wizard (per the monorepo rule). It contains
**8 steps** completed in order; Step 5–8 form one repeating block per
vaccination entry.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Centre & clinician | centre name, WHO designation reference, address, ISO 3166-1 alpha-3 country, telephone, uniform-stamp image; supervising clinician name, professional status, registration body and number |
| 2 | Vaccinee identity | surname, given names, date of birth, sex, nationality, travel-document number |
| 3 | Vaccinee signature & consent | typed or drawn signature, consent to data sharing |
| 4 | Travel context (optional) | destination countries, planned date of arrival, purpose of travel |
| 5 | Vaccination entry — disease & vaccine | disease, vaccine trade name, manufacturer, batch number, route, dose, anatomical site |
| 6 | Vaccination entry — administration | date of vaccination, time of vaccination, clinician signature, professional status |
| 7 | Vaccination entry — validity & stamp | validity start date, validity end date, lifetime-validity override (yellow fever 2016), centre stamp confirmation |
| 8 | Summary, medical waiver, sign-off | computed validity, fired warnings, optional medical waiver with reason, final review, electronic signature, generate PDF |

Steps 5–7 repeat for each disease the vaccinee has been vaccinated against on
this certificate. Most certificates carry a single yellow-fever entry.

## Validation rules

Computed by a deterministic validation engine; outputs a `ValidationReport`
that drives the warning panel on Step 8.

| Code | Severity | Rule |
| --- | --- | --- |
| `VAL001` | error | date of vaccination must not be in the future |
| `VAL002` | error | validity start must be ≥ vaccination date |
| `VAL003` | error | yellow fever validity start must be vaccination date + 10 days |
| `VAL004` | warning | yellow fever validity end is overridden to "lifetime" per 2016 IHR amendment when not set |
| `VAL005` | error | manufacturer and batch number must both be present |
| `VAL006` | error | supervising clinician signature must be handwritten — stamps are not acceptable |
| `VAL007` | error | official centre stamp must be present |
| `VAL008` | warning | vaccinee date of birth implies age < 9 months for yellow fever — clinician confirmation required |
| `VAL009` | warning | vaccinee date of birth implies age > 60 years for yellow fever — clinician confirmation required |
| `VAL010` | warning | vaccinee declared pregnancy or breastfeeding — yellow fever contraindication |
| `VAL011` | warning | vaccinee declared immunosuppression — yellow fever contraindication |
| `VAL012` | error | certificate language must be English or French (IHR Annex 6) plus the issuing country's official language |

## Output

- **HTML preview** of the printed two-page certificate.
- **PDF** rendered via `pdfmake`, sized to A6 booklet pages matching the WHO
  model layout.
- **FHIR R5 Bundle** containing an `Immunization`, a `Patient`, a `Practitioner`,
  and a `DocumentReference` resource.
- **XML** representation with DTD.
- **Protocol Buffers** schemas for binary transport.

## Directory structure

```
international-certificate-of-vaccination-or-prophylaxis/
  index.md                                           # this file
  AGENTS.md                                          # agent instructions
  plan.md                                            # implementation roadmap
  tasks.md                                           # task tracking
  doc/                                               # WHO/CDC reference material
  sql/                                    # Liquibase Postgres migrations
  xml-representations/                               # XML + DTD per SQL table
  fhir-r5/                                           # FHIR HL7 R5 JSON resources
  protobuf/                                          # Protocol Buffers schemas
  typespec/                                          # TypeSpec API definitions
  front-end-form-with-html/                          # static single-page HTML wizard
  front-end-form-with-svelte/                        # SvelteKit single-page wizard
  front-end-dashboard-with-html/                     # review dashboard (HTML table)
  front-end-dashboard-with-svelte/                   # review dashboard (SVAR Grid)
  back-end-with-loco/             # Rust backend + server-rendered UI
  back-end-with-loco-setup       # scaffold generator (shell)
```

## References

- World Health Organization. *International Health Regulations (2005), Third
  Edition*. Annex 6: Vaccination, prophylaxis and related certificates. Geneva,
  2016.
- World Health Organization. *Model International Certificate of Vaccination
  or Prophylaxis*. Updated 2007.
- US Centers for Disease Control and Prevention. *International Certificate of
  Vaccination or Prophylaxis (ICVP)*.
  <https://wwwnc.cdc.gov/travel/page/icvp>.
- World Health Organization. *Vaccines and vaccination against yellow fever:
  WHO Position Paper, June 2013* — recommendations for the SAGE working group.
- World Health Organization. *Yellow fever vaccination booster not needed*
  (May 2014) — basis for the 2016 IHR amendment.
- HL7 International. *FHIR R5 Immunization Resource*.
  <https://hl7.org/fhir/R5/immunization.html>.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I (records
  documentation only; no diagnostic output).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 — design and development of user information.
- UK MHRA *Software and AI as a Medical Device*.
- General Data Protection Regulation (GDPR) — vaccinee identity is personal
  health data; certificate may be exported on lawful basis of public-task or
  vital-interest.

## Verify

```sh
bin/test-form international-certificate-of-vaccination-or-prophylaxis
```
