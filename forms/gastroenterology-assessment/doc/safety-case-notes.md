# Clinical Safety Case — Placeholders

This form is patient-facing GI symptom-triage software and, under UK
regulation, falls within scope of the NHS Digital Clinical Safety Officer
process (**DCB0129** for manufacturers, **DCB0160** for deploying
organisations).

This document is a **placeholder** intended to be populated during a
trust deployment. It is not a substitute for a formal safety case.

## Intended purpose (DCB0129)

> A patient-facing gastroenterology questionnaire that records upper-GI,
> lower-GI, hepatic and pancreatic symptoms, computes a composite
> severity (Low / Moderate / High / Critical), and emits red-flag alerts
> aligned to NICE NG12 and BSG / ACG guidance. It supports but does not
> replace clinical assessment by a registered clinician.

## Intended users

Patients with GI symptoms (self-report or with carer assistance), and
the GP / GI clinicians who review the report.

## Hazard log (top-level)

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Critical red flag missed | Patient does not understand "melaena" or "dysphagia" wording | Plain-English help text on each alarm question |
| H-02 | Incorrect severity displayed | Engine rule bug | Vitest unit tests on `gi-grader` covering each ALARMS letter |
| H-03 | Composite computed despite missing alarm checklist | Bypass of mandatory field | Engine returns "Incomplete" if alarm checklist not finished |
| H-04 | Stale assessment used for triage | Hours-old report relied on after symptom change | Each completion is timestamped |
| H-05 | Mis-identified patient | NHS / personal identifier entered incorrectly | Demographics step shows printed name back for confirmation |
| H-06 | Data loss | Browser crash before submit | LocalStorage autosave (future enhancement) |
| H-07 | Accessibility failure | Patient with vision / cognitive impairment cannot complete | Component library follows WCAG 2.2 AA; carer-completion mode acceptable |
| H-08 | Evidence drift | NICE FIT or 2-week-wait thresholds updated | Rule catalogue in `symptom-grading-rules.md` reviewed annually |
| H-09 | False reassurance | Low severity reported despite serious illness | Report explicitly states it is not a diagnosis and recommends GP review |

## Risk level

Indicative MDCG 2019-11 classification: **Class IIa**. Output drives
referral decisions and informs triage urgency. Final clinical decision
rests with a registered clinician.

## Verification evidence

- `gi-grader.test.ts` Vitest unit tests on every red-flag rule and
  composite mapping.
- `bin/test-form gastroenterology-assessment` structural tests.
- Manual review against NICE NG12 worked examples for dysphagia,
  haematemesis, and palpable mass.

## Post-market surveillance

Deploying trust to:

- Audit any Critical or High severity that did not lead to a documented
  clinician review within the trust's local SLA.
- Audit any FIT-positive flag that did not trigger a colorectal referral.
- Report any patient harm via the local incident reporting system and
  the DCB0129 post-market surveillance channel.
