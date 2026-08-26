# Safety case notes

## Intended use

A structured record of a patient's immunization status against the UK
Routine Immunization Schedule (UKHSA Green Book). It computes compliance,
generates catch-up recommendations, and records administration details.

## Intended user

GP, practice nurse, immunization nurse, health visitor, school nurse,
pharmacist, or travel medicine clinician acting within scope.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11).
- **Rationale:** Output drives clinical immunization decisions (catch-up
  schedules, contraindication screening). Misuse has foreseeable harm
  (missed vaccinations, adverse vaccine reactions in contraindicated
  patients).

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Live vaccine given to immunosuppressed patient | Hard gate at Step 7: pregnancy, immunosuppression, prior anaphylaxis |
| Pertussis dose given outside 16-32 week pregnancy window | Pregnancy due-date field with computed eligibility window |
| Yellow fever vaccine outside age window (9 m to 60 y) | Auto-flag for senior clinician sign-off |
| Egg allergy + LAIV / influenza | Egg-allergy screen embedded; alternatives auto-listed |
| Stale schedule (form not updated since last JCVI change) | Schedule JSON includes `lastUpdated` field with stale-data flag |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- UK Green Book (Immunization against infectious disease).

## Clinical evidence base

- UKHSA *Immunization against infectious disease* (Green Book).
- JCVI statements.
- WHO Vaccine Position Papers.
- WHO IHR (2005) Annex 6.

## Patient-safety alerts

- Anaphylaxis after vaccination: emergency Resus Council UK pathway
  (cross-reference to allergy-assessment form).
- Vaccine adverse events: report via MHRA Yellow Card Scheme
  <https://yellowcard.mhra.gov.uk/>.

## Data protection

- Vaccination history is special-category personal data under UK GDPR
  Art.9.
- Lawful basis: Art.9(2)(h) (and Art.9(2)(i) for public health where
  applicable).
- Records can be uploaded to the NHS National Immunization Management
  System (NIMS) where the practice is enrolled.
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [compliance-rules.md](compliance-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
