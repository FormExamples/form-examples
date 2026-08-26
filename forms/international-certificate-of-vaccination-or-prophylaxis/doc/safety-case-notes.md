# Safety case notes

## Intended use

A structured-data capture and printing application for the WHO model
International Certificate of Vaccination or Prophylaxis (ICVP) as defined
by IHR (2005) Annex 6. It captures the vaccinee identity, vaccination
entries, and centre/clinician details, validates the entries against the
IHR rules, and produces a printable two-page certificate and FHIR R5
Immunization bundle.

## Intended user

- WHO-designated yellow fever vaccination centre clinician (physician,
  nurse, pharmacist) authorized by the national health authority.
- Travel medicine clinic.
- Port-health unit.
- Military pre-deployment clinic.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software (records-only).
- **Rationale:** The certificate is a documentation artefact; the clinical
  decision to vaccinate happens outside the form. The form's validation
  engine enforces IHR Annex 6 procedural requirements (dates, signature,
  stamp) but does not give clinical advice.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Typed clinician signature accepted in place of handwritten | VAL006 hard-error blocks save |
| Missing centre uniform stamp | VAL007 hard-error blocks save |
| Yellow fever validity start ≠ vaccination + 10 days | VAL003 hard-error |
| Yellow fever booster recorded with expiry < lifetime | VAL004 warning + operator override flag |
| YF vaccine given to <9 m or >60 y without clinician confirmation | VAL008 / VAL009 warnings |
| Pregnancy / immunosuppression + YF | VAL010 / VAL011 warnings |
| Certificate issued only in one language | VAL012 hard-error requires English + French + national language |

## Regulatory framework

- IHR (2005) Annex 6.
- WHO Model Certificate.
- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- ISO/IEC/IEEE 26514:2022 — Design and development of information for users.
- UK GDPR / Data Protection Act 2018.

## Patient-safety alerts

- YEL-AVD / YEL-AND adverse events are reported via UK MHRA Yellow Card and
  US VAERS. The form prints the reporting reference on the certificate
  PDF for traveller awareness.
- Medical waiver text on the printed certificate is reproduced verbatim
  from the WHO model.

## Data protection

- Vaccinee identity is special-category personal data under UK GDPR Art.9.
- Lawful basis: Art.9(2)(h) provision of medical care AND Art.9(2)(g)
  substantial public interest (border control under IHR).
- Encryption at rest (AES-256) and in transit (TLS 1.3).
- Records may be shared with national IHR focal points per IHR Article 6.

## Acceptance and verification

- Border control acceptance is a State Party decision. The form does not
  guarantee acceptance, only Annex 6 conformance.
- Some destinations require a paper certificate even if a digital twin is
  issued; the form always supports paper-first printing.

## See also

- [ihr-annex-6.md](ihr-annex-6.md)
- [yellow-fever-vaccination.md](yellow-fever-vaccination.md)
- [references.md](references.md)
