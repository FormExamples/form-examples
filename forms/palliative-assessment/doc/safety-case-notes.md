# Clinical Safety Case — Placeholders

This form is palliative-care decision-support software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety
Officer process (**DCB0129** for manufacturers, **DCB0160** for
deploying organizations).

This document is a **placeholder** intended to be populated during a
trust / hospice deployment. It is not a substitute for a formal safety
case.

## Intended purpose (DCB0129)

> A patient-, carer- or clinician-completed palliative-care assessment
> that records the ESAS-r symptom inventory, performance status,
> goals-of-care and advance-care-planning documentation, current
> medication and symptom-control plan, and psychosocial / spiritual
> concerns. It computes an ESAS-r total and band, surfaces any single
> symptom ≥ 7, and emits flags aligned to NICE NG31 / NG142.

## Intended users

Palliative-care consultants, palliative-care clinical nurse specialists,
hospice clinicians, oncologists, generalist clinicians providing
end-of-life care, and trained carer users (under clinical supervision).

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Individual high-burden symptom missed | Reviewer fixates on total | Engine raises a per-symptom flag at ≥ 7 independent of total |
| H-02 | Carer-reported scores mistaken for patient-reported | Provenance field skipped | Step 3 has mandatory provenance selector; report carries provenance |
| H-03 | ACP document overlooked | Step 5 left blank | If absent, engine flags "Consider discussing advance care planning" |
| H-04 | Stale assessment used | Hours-old ESAS used after deterioration | Each completion is timestamped |
| H-05 | Opioid-prescribing risk | Symptom plan reviewed superficially | Step 6 prompts for opioid dose, route, breakthrough plan, and renal-function consideration; rule fires if opioid present and renal function impaired |
| H-06 | Mis-identified patient | NHS number entered incorrectly | Demographics step confirms name + DOB + NHS |
| H-07 | Data loss | Browser crash | LocalStorage autosave (future enhancement) |
| H-08 | Accessibility failure | Patient with fatigue, frailty or cognitive impairment cannot complete | Component library follows WCAG 2.2 AA; carer-completion mode acceptable |
| H-09 | Cultural / spiritual concerns not surfaced | Step 7 left blank | Step 7 has explicit prompts for cultural, religious and spiritual needs |
| H-10 | Evidence drift | NICE NG31 / NG142 / ESAS-r thresholds updated | Rule catalogue in `esas-grading-rules.md` reviewed annually |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
symptom-control escalation, hospice referral, and ACP discussions.

## Verification evidence

- `esas-grader.test.ts` Vitest unit tests on every banding cut-off and
  the any-symptom-≥-7 rule.
- `bin/test-form palliative-assessment` structural tests.
- Manual review against Selby 2010 worked examples.

## Post-market surveillance

Deploying trust / hospice to:

- Audit individual-symptom ≥ 7 flags to confirm a documented
  symptom-control response.
- Audit "no ACP documented" flags to confirm an ACP conversation has
  been initiated or its decline recorded.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
