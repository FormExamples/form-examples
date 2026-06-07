# Clinical Safety Case — Placeholders

This form is organ-donation decision-support software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety
Officer process (**DCB0129** for manufacturers, **DCB0160** for
deploying organisations) and the Human Tissue Authority's regulatory
oversight.

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A clinician-administered organ-donation assessment that records donor
> type and registration, medical history, organ function, infectious
> disease and immunological screening, surgical and (where relevant)
> psychosocial assessment, and ethical / legal documentation. It
> computes an indicative suitability (Suitable / Conditionally suitable
> / Unsuitable) and a risk band, and emits flags for absolute and
> expanded-criteria factors per NHSBT, WHO, EDQM and BTS guidance.

## Intended users

NHSBT Specialist Nurses — Organ Donation (SN-OD), transplant clinicians,
multidisciplinary transplant teams (kidney / liver / cardiothoracic /
pancreas), and Independent Assessors as defined by the Human Tissue Act.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Donor with absolute contraindication marked Suitable | Engine rule bug | Vitest unit tests on `donation-grader`; explicit absolute-contraindication catalogue with version pin |
| H-02 | Infection screen result mis-entered | Free-text data entry error | Step 5 has structured fields per pathogen with positive / negative / pending; rules fire only on confirmed positives |
| H-03 | Donor consent missing | Consent section skipped | Engine blocks submission if Step 9 consent fields are incomplete |
| H-04 | Living-donor psychosocial concern not surfaced | Step 8 free-text only | Step 8 has structured concern checklist; MDT review flag if any concern selected |
| H-05 | Wrong patient — donor / recipient confusion | Identifier entered incorrectly | Demographics step confirms name + DOB; donor type field is mandatory and prominent |
| H-06 | Stale donor screen | Hours-old serology used post-transfusion | Each field carries a sample date; rule fires if serology > recommended window for organ type |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Clinician with vision / motor impairment | Component library follows WCAG 2.2 AA |
| H-09 | Evidence drift | NHSBT POL revisions, WHO updates | Policy catalogue in `suitability-grading-rules.md` reviewed quarterly |
| H-10 | Deemed-consent assumption error | Patient's wishes not recorded against the Organ Donor Register | Step 9 requires explicit ODR-check field |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa to IIb**. The
software supports clinician decisions that drive organ acceptance and
recipient eligibility. Final decisions rest with the named transplant
clinician / MDT and with NHSBT clinical policies.

## Verification evidence

- `donation-grader.test.ts` Vitest unit tests on every absolute
  contraindication and expanded-criteria branch.
- `bin/test-form organ-donation-assessment` structural tests.
- Manual review against NHSBT policy library examples and BTS Living
  Donor Kidney Transplantation guideline.

## Post-market surveillance

Deploying trust to:

- Audit any "Unsuitable" result that was overridden by clinician.
- Audit MDT-review flags to confirm a documented MDT decision exists.
- Report any patient harm via the local incident reporting system, the
  DCB0129 post-market surveillance channel, and NHSBT serious adverse
  event reporting (SAEAR).
