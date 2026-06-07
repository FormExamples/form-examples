# Clinical Safety Case — Placeholders

This form is clinical-decision-support software for pressure-ulcer risk
and integumentary findings and, under UK regulation, falls within scope
of the NHS Digital Clinical Safety Officer process (**DCB0129** for
manufacturers, **DCB0160** for deploying organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A clinician-administered integumentary record that captures a
> head-to-toe skin, hair and nail examination, computes a Braden Scale
> total and risk band, and emits a pressure-ulcer-prevention and
> tissue-viability flag set. It supports but does not replace clinical
> judgement.

## Intended users

Registered nurses, tissue viability nurses, ward clinicians, and
community nursing staff in NHS and equivalent regulated settings.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect Braden band displayed | Engine rule bug | Vitest unit tests on `integumentary-grader`; thresholds taken from Braden 2001 |
| H-02 | High-risk patient not flagged | Total sub-scale missing | If any sub-scale missing, band is "Incomplete" and a "complete assessment" flag is raised |
| H-03 | Pressure-ulcer stage mis-recorded | Confusion between Stage 2 and deep tissue injury | Field labels mirror NPIAP / EPUAP 2019 verbatim |
| H-04 | Stale assessment used | Hours-old Braden score used after a clinical change | Each assessment is timestamped; report carries the completion date |
| H-05 | Skin-cancer red flag missed | Lesion checkbox not surfaced | Step 3 / 6 surface NICE NG12 features; summary banner if any red flag |
| H-06 | Mis-identified patient | Identifier entered incorrectly | Demographics step shows printed name for confirmation |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Clinician with motor / vision impairment | Component library follows WCAG 2.2 AA |
| H-09 | Evidence drift | NPIAP / EPUAP / Braden cut-offs updated | Rule catalogue in `braden-scale-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
pressure-ulcer prevention plans and tissue-viability referrals.

## Verification evidence

- `integumentary-grader.test.ts` Vitest unit tests covering all Braden
  banding cut-offs, wound staging branches, and incomplete-sub-scale
  edge cases.
- `bin/test-form integumentary-assessment` structural tests.
- Manual review against Bergstrom 1987 worked examples.

## Post-market surveillance

Deploying trust to:

- Audit Braden score ≤ 12 results that did not trigger a tissue-viability
  referral within the trust's local SLA.
- Audit any wound staged ≥ 3 that did not trigger a referral.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
