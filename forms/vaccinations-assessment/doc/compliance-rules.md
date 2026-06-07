# Immunisation compliance scoring rules

## Instrument

The form classifies a patient's immunisation status against the **UK
Routine Immunisation Schedule** as published in the *Immunisation against
infectious disease* handbook ("the **Green Book**") maintained by the UK
Health Security Agency (UKHSA), formerly Public Health England (PHE).

- UK Health Security Agency. *Immunisation against infectious disease* (the
  Green Book). London: UKHSA, ongoing.
  <https://www.gov.uk/government/collections/immunisation-against-infectious-disease-the-green-book>
- UK Health Security Agency. *The complete routine immunisation schedule
  from spring 2024*.
  <https://www.gov.uk/government/publications/the-complete-routine-immunisation-schedule>

## Categories

| Category | Definition |
| --- | --- |
| Compliant | All age-appropriate routine vaccinations administered on or before their due date; no overdue doses |
| Partial | One or more routine doses overdue; a catch-up schedule is generated per Green Book chapter 11 |
| Non-compliant | Multiple routine vaccines missing or declined; clinician follow-up and parental discussion required (per JCVI/NHS guidance) |

## UK schedule highlights (Spring 2024 schedule)

The form encodes the following routine schedule from the *Complete Routine
Immunisation Schedule from Spring 2024*:

| Age | Vaccines |
| --- | --- |
| 8 weeks | 6-in-1 (DTaP/IPV/Hib/HepB), Rotavirus, MenB |
| 12 weeks | 6-in-1, PCV13, Rotavirus |
| 16 weeks | 6-in-1, MenB |
| 1 year | Hib/MenC, PCV13 booster, MMR, MenB booster |
| 2-3 years (annually) | Live attenuated influenza (LAIV) |
| 3 years 4 months | DTaP/IPV pre-school booster, MMR second dose |
| 12-13 years | HPV |
| 14 years | Td/IPV teenage booster, MenACWY |
| 65+ years | PPV23, annual influenza, RSV (new 2024), shingles (Shingrix from 65) |
| Pregnancy | Pertussis (from 16 weeks), influenza, RSV (new 2024) |

(Schedule subject to JCVI updates; the form pulls the live schedule
JSON from the UKHSA endpoint at runtime if available.)

## Travel vaccinations (Step 5)

The form references:

- UKHSA *Travel Health Pro* (NaTHNaC):
  <https://travelhealthpro.org.uk/>
- WHO *International Travel and Health*:
  <https://www.who.int/teams/control-of-neglected-tropical-diseases/yaws/diagnosis-and-treatment/international-travel-and-health>
- Yellow fever (IHR Annex 6) — see also the
  `international-certificate-of-vaccination-or-prophylaxis` form.

## Occupational vaccinations (Step 6)

The form references:

- UK Department of Health and Social Care. *Health clearance for
  tuberculosis, hepatitis B, hepatitis C and HIV: new healthcare workers*.
  London: DHSC, 2007.
  <https://www.gov.uk/government/publications/health-clearance-for-tuberculosis-hepatitis-b-hepatitis-c-and-hiv-new-healthcare-workers>
- UKHSA Green Book Chapter 12 (Immunisation of healthcare and laboratory
  staff).

## Contraindications (Step 7)

Absolute contraindications per Green Book chapter 6:

- Confirmed anaphylactic reaction to a previous dose of the same vaccine.
- Confirmed anaphylactic reaction to any component of the vaccine.
- Live vaccines: severe immunosuppression, pregnancy (most live vaccines).

The form's contraindication-screen flags any of the above and routes to
specialist immunology.

## Flagged-issue triggers

- Any routine dose overdue by ≥30 days → catch-up flag (Green Book ch. 11).
- Declined MMR → information leaflet flag and JCVI MMR catch-up offer.
- Severe egg allergy + influenza vaccine → egg-free LAIV / IIV alternative
  flag per Green Book chapter 19.
- HCW seronegative for HepB after primary course → non-responder protocol
  (Green Book ch. 18).
- Yellow fever for traveller >60 → senior clinician confirmation per WHO
  position paper.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
