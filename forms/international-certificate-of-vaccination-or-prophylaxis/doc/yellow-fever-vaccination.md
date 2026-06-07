# Yellow fever vaccination

Yellow fever vaccination is the only routinely required IHR-mandated
vaccination as of June 2025.

## Vaccine

Live attenuated YF-17D vaccine. Single dose; lifetime immunity per the WHO
2014 update.

Two licensed products:
- Sanofi Pasteur **YF-VAX** (USA / Latin America).
- **Stamaril** (Sanofi Pasteur, EU/UK).

## Indication

- Travellers ≥9 months entering or transiting through a country with a
  risk of yellow fever transmission.
- Laboratory workers handling YF virus.
- Residents of yellow fever–endemic areas per WHO endemicity maps.

WHO endemicity reference:
<https://www.who.int/publications/i/item/9789241516884> (Vector borne
disease section in *International travel and health*).

## Contraindications (Annex 6 waiver eligibility)

Absolute:

- Age < 6 months (WHO position paper 2013) — never give YF vaccine.
- Severe egg allergy / anaphylaxis to a previous YF dose.
- Severe primary or acquired immunodeficiency (CD4 < 200 cells/µL in HIV,
  active malignancy on chemotherapy, solid-organ transplant within 2 years,
  haematopoietic stem cell transplant within 24 months).
- Thymus disorders (thymectomy, thymoma, DiGeorge syndrome).

Relative (require senior clinician risk-benefit assessment):

- Age 6-9 months — only if unavoidable travel to high-risk area.
- Age ≥ 60 years — increased risk of YEL-AVD (yellow fever vaccine
  associated viscerotropic disease) and YEL-AND (neurologic disease) per
  Lindsey NP et al. *Vaccine* 2008;26:6077-82. PMID: 18809449
- Pregnancy and breastfeeding — vaccine is not recommended; offer waiver.
- HIV with CD4 200-499 cells/µL — case-by-case.

## Adverse events

- Mild: low-grade fever, headache, myalgia in 10-30% of recipients.
- YEL-AVD: ~0.3-0.4 per 100 000 doses; higher in first-time vaccinees and
  >60 years (Vasconcelos PFC et al. *Lancet* 2001;358:91-7. PMID: 11463413).
- YEL-AND: ~0.4-0.8 per 100 000 doses.

## Validity computation (form engine)

- `validFrom = vaccinationDate + 10 days` (IHR Annex 6).
- `validUntil = 'lifetime'` per 2016 IHR amendment unless the operator
  explicitly enters an end date.
- Pre-2016 certificates retain their printed 10-year expiry but State
  Parties must accept them as lifetime-valid (WHO operational guidance).

## Stamaril / YF-VAX shortages

When stamaril is in shortage, alternative arrangements include CDC's
expanded use of Stamaril in the USA via designated providers under FDA EAP.
The form records vaccine brand to support pharmacovigilance.

## Validation rules in the form

| Code | Severity | Rule |
| --- | --- | --- |
| VAL003 | error | YF validFrom must be vaccinationDate + 10 days |
| VAL004 | warning | YF validUntil overridden to "lifetime" per 2016 IHR if not set |
| VAL008 | warning | Age < 9 months — clinician confirmation required |
| VAL009 | warning | Age > 60 years — clinician confirmation required |
| VAL010 | warning | Declared pregnancy or breastfeeding — YF contraindication |
| VAL011 | warning | Declared immunosuppression — YF contraindication |

## See also

- [ihr-annex-6.md](ihr-annex-6.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
