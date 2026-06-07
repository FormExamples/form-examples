# Vaccination compliance and risk stratification rules

## Scope

This form tracks immunisation status for **healthcare workers** and
**patients in occupational, travel, or special-circumstance settings**.
Unlike the routine `vaccinations-assessment` form, it focuses on
**occupational risk** and **outbreak response** and stratifies the patient
into risk levels.

## Compliance category

| Category | Definition |
| --- | --- |
| Fully Immunised | All vaccinations required by the patient's role and circumstances complete and documented |
| Partially Immunised | One or more vaccinations incomplete or overdue |
| Non-Compliant | Required vaccinations missing, especially in high-risk roles |
| Contraindicated | Documented medical exemption with supporting evidence |

## Risk levels

| Level | Definition |
| --- | --- |
| Low | Fully immunised; no gaps; low-risk role and setting |
| Moderate | Partially immunised; non-critical gaps |
| High | Non-compliant in high-risk role (e.g. exposure-prone procedures, paediatric oncology, dialysis) |
| Critical | Active exposure (e.g. needlestick injury) without documented immunity |

## High-risk role definitions (UK)

Per UK Department of Health and Social Care *Health clearance for
tuberculosis, hepatitis B, hepatitis C and HIV: new healthcare workers*
(2007) and *Integrated guidance on health clearance of healthcare workers*
(2007):

- **Exposure-prone procedures (EPP)** — surgical, obstetric, dental, and
  some emergency procedures where the worker's gloved hands may contact
  sharp tissues or instruments inside a body cavity. Requires HepB, HepC
  and HIV clearance.
- **Direct patient care** — clinical contact roles requiring HepB, TB,
  MMR, VZV, and annual influenza.
- **Laboratory** — additional pathogen-specific vaccines per UKHSA Green
  Book chapter 12.

## UKHSA Green Book Chapter 12 — Immunisation of HCWs

Mandatory pre-employment screening:

- Hepatitis B (3-dose primary course + anti-HBs ≥10 mIU/mL post-vaccination).
- Tuberculosis (BCG status check or IGRA / Mantoux).
- Measles, mumps, rubella (MMR) — 2 doses or serology.
- Varicella (VZV) — history of chickenpox or serology / 2-dose VZV vaccine.
- Annual seasonal influenza.
- COVID-19 (status recorded, subject to current government policy).

## Travel vaccinations (Step 5)

References UKHSA *Travel Health Pro*:
<https://travelhealthpro.org.uk/>

Country-specific recommendations include yellow fever (where required for
entry per WHO IHR Annex 6), typhoid, hepatitis A, rabies, Japanese
encephalitis, tick-borne encephalitis, meningococcal ACWY (Hajj), polio
(IHR temporary recommendations).

## COVID-19 (Step 6)

Per UKHSA Green Book chapter 14a; JCVI advice on autumn/spring boosters.

## Influenza (Step 7)

Per UKHSA Green Book chapter 19 — annual updates; LAIV vs IIV per age,
egg allergy, immunosuppression.

## Serology and immunity testing (Step 9)

The form records:

- HepB anti-HBs (mIU/mL); ≥10 = responder; <10 after primary course =
  non-responder, follow Green Book ch.18 booster algorithm.
- HepC antibody; HCV PCR if reactive.
- HIV antigen/antibody combo test (4th-generation).
- Anti-HBc to confirm previous infection.
- Rubella IgG; Measles IgG; VZV IgG; HAV IgG (for staff in HAV-risk
  settings).
- Mantoux / IGRA for TB.

## Flagged-issue triggers

- HCW seronegative for HepB → non-responder protocol (Green Book ch.18).
- Active needlestick injury without HBV immunity → critical-risk flag;
  post-exposure prophylaxis pathway per UKHSA *Immunisation against
  infectious disease* ch. 18 and HIV PEP guidelines.
- No documented MMR/VZV immunity → restrict from contact with
  immunosuppressed patients until confirmed.
- TB IGRA positive → cross-reference to occupational health.
- Pregnancy → live-vaccine block per Green Book ch. 6.
- COVID-19 outbreak status (e.g. UKHSA outbreak alert) → autumn booster
  status check.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
