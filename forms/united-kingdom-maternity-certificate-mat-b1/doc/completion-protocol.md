# Completion protocol — MAT B1

## When to issue

- Earliest: **20 weeks before** the expected week of confinement (EWC).
- Latest: practitioners may also issue after the birth, certifying the
  actual date of confinement.

## Who may issue

- A **registered medical practitioner** (GMC register).
- A **registered midwife** (NMC register).

Other clinicians (e.g. health visitors, maternity-support workers,
sonographers) are **not** authorized to issue a MAT B1.

## What to record

| Field | Notes |
| ----- | ----- |
| Patient's full name | as registered with the practitioner |
| Expected week of confinement (EWC) | Sunday-to-Saturday week containing the expected date of delivery; current HMRC stationery records a single expected date |
| Actual date of confinement | only when issued post-delivery |
| Date of issue | not before 20 weeks pre-EWC |
| Practitioner's name | block letters |
| Practitioner's professional register number | GMC or NMC PIN |
| Practitioner's address | usually the practice or maternity unit address |
| Signature | wet-ink on paper; cryptographic signature in this digital implementation |

The digital implementation also captures:

- NHS number (optional but recommended for patient matching).
- Pregnancy episode identifier.
- Soft-delete metadata.

## Issuing rules

- **One MAT B1 per pregnancy**. A replacement may be issued if the
  original is lost; the replacement should be clearly marked
  "Duplicate".
- The EWC must not be altered after issue except in the same handwriting
  / authenticated digital amendment with a date and signature.
- A MAT B1 issued before 20 weeks pre-EWC is **invalid** and the employer
  or DWP is entitled to refuse it.

## Submitting MAT B1 to an employer

The employee must give the MAT B1 to their employer **at least 21 days
before** they want their statutory maternity pay to start, or as soon as
reasonably practicable (Statutory Maternity Pay (General) Regulations
1986, regulation 22).

## Submitting MAT B1 to DWP

Employees not entitled to SMP submit the MAT B1 with form MA1 to the
Department for Work and Pensions. Maternity Allowance can be claimed
from the 26th week of pregnancy.

- MA1 claim form and guidance: <https://www.gov.uk/maternity-allowance>

## Related certificates

- **MAT B1 (Welsh)** — bilingual version.
- **SC3 / SC4** — Statutory Paternity Pay / shared parental leave
  declarations (separate forms).
- **Med 3 (fit note)** — separate Statement of Fitness for Work; **not**
  a substitute for MAT B1.

## Common errors flagged in this implementation

1. EWC date earlier than today (cannot certify a past confinement as
   "expected").
2. Issue date before 20 weeks pre-EWC.
3. Practitioner registration number not in GMC or NMC format.
4. Two unduplicated MAT B1s for the same pregnancy episode.
