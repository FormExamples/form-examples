# Safety case notes

## Intended use

A structured immunisation status tracking form for healthcare workers and
patients in occupational, travel, or special-circumstance settings. It
applies UKHSA Green Book and DHSC HCW clearance rules and stratifies the
patient into a risk level.

## Intended user

Occupational health nurse / physician, infection control practitioner,
travel medicine clinician, public health professional, or GP / practice
nurse.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11).
- **Rationale:** Output may restrict an individual's clinical duties
  (e.g. EPP restriction pending HepB clearance) and may drive post-exposure
  prophylaxis decisions; misuse has foreseeable harm.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| HCW cleared for EPP without HepB anti-HBs result | Step 9 mandates anti-HBs ≥10 mIU/mL before "Fully Immunised" |
| Active needlestick exposure not escalated | Critical-risk flag visible on summary |
| Pregnancy + live vaccine | Pregnancy declaration in Step 8 blocks live vaccines |
| Stale schedule (JCVI / Green Book updates) | Schedule JSON timestamped; stale-data flag |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- UK Green Book.

## Clinical evidence base

- UKHSA Green Book chapters 6, 12, 14a, 14b, 18, 19, 28, 35.
- DHSC HCW clearance (2007).
- WHO IHR (2005) Annex 6.

## Patient-safety alerts

- Sharps injury pathway: cross-reference to UK *Eye of the Needle* annual
  report and UKHSA HBV/HCV/HIV post-exposure protocols.
- Outbreak response: integration with UKHSA national outbreak management
  system.

## Data protection

- Occupational health data is special-category under UK GDPR Art.9.
- Lawful basis: Art.9(2)(h) and Art.9(2)(b) (employment law obligations).
- Encryption at rest (AES-256) and in transit (TLS 1.3).
- Strict separation from line-management access per UK occupational health
  ethics guidance (Faculty of Occupational Medicine).

## See also

- [compliance-rules.md](compliance-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
