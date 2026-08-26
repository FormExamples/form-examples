# Regulatory Cross-walks

Cross-references from the Return to Work form to three UK statutory
regimes that may be triggered by the absence or the planned return.

## RIDDOR — Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013

RIDDOR places a duty on employers and certain other duty-holders to
report specified work-related accidents, diseases, and dangerous
occurrences to the Health and Safety Executive (HSE). The duty
falls on the **employer** but a clinician may be the first
professional to recognize that an absence has a workplace cause.

### Trigger

If `return_to_work.workplace_cause = 'yes'` and
`return_to_work.riddor_reference IS NULL`, the form fires the
*workplace cause without RIDDOR record* flag (high priority). The
clinician is prompted to either:

- Add a RIDDOR reference if one already exists (the employer has
  reported it).
- Advise the patient that they should report it to their employer
  so that the employer can file a RIDDOR report.

### Reportable categories

- Death or specified injury to a worker.
- Injuries causing more than 7 consecutive days of absence (the
  most common trigger from a fit note).
- Occupational diseases listed in Schedule 3 (carpal tunnel,
  cramp of the hand or forearm due to repetitive movements, hand-
  arm vibration syndrome, occupational asthma, occupational
  dermatitis, certain occupational cancers, hand-arm tendinitis or
  tenosynovitis, vibration white finger).
- Dangerous occurrences (Schedule 2).
- Gas incidents.

### See also

- HSE. *Reporting accidents and incidents at work (RIDDOR).*
  <https://www.hse.gov.uk/riddor/>

## DVLA — Driver and Vehicle Licensing Agency notifiable conditions

A patient who holds a Group 1 (cars / motorcycles) or Group 2 (HGV
/ PCV) driving licence must notify the DVLA of any medical
condition that may affect safe driving. Clinicians do not normally
notify the DVLA directly (except in safeguarding circumstances) but
must advise the patient of their duty to do so.

### Trigger

If the primary or secondary diagnosis falls within the DVLA
notifiable list, the form sets
`return_to_work.dvla_notification_required = 'yes'` and fires the
*DVLA notifiable condition* flag (high priority).

### Common notifiable conditions captured in this form

- Stroke or TIA (any).
- Epilepsy / seizure disorder.
- Severe mental-health condition affecting safe driving.
- Visual-field loss meeting DVLA criteria.
- Diabetes treated with insulin (Group 2 only — Group 1 only if
  hypoglycaemic awareness is reduced).
- Heart attack within the last 4 weeks (Group 1) / 6 weeks (Group 2).
- Sleep disorders (severe sleep apnoea with excessive daytime
  sleepiness).
- Severe anxiety or depression where medication causes
  drowsiness.

### See also

- DVLA. *Assessing fitness to drive — a guide for medical
  professionals.*
- The DVLA-related forms in this monorepo:
  - `forms/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/`
  - `forms/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/`
  - `forms/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/`

## Equality Act 2010 — Reasonable-adjustment duty

The Equality Act 2010 requires employers to make *reasonable
adjustments* where a disabled employee is placed at a substantial
disadvantage. A condition that has lasted, or is likely to last,
12 months or more is likely to meet the Act's definition of
disability.

### Trigger

The form does not adjudicate disability status — that is for the
employer's occupational-health team and ultimately an employment
tribunal. The form does, however, surface adjustments that are
candidates for the reasonable-adjustment duty:

- Phased return.
- Amended duties.
- Workplace adaptations (workstation review, ergonomic equipment).
- Altered hours.
- Restricted activities (no lifting, no driving, no machinery,
  no patient contact).

### Captured as

Every checked adjustment becomes a `return_to_work_restriction`
row with `kind`, `severity`, and an optional `notes` column.
Adjustments are also exported in the FHIR `CarePlan.activity`
array so that downstream systems can present them to the employer.

### See also

- Equality Act 2010.
- Acas. *Reasonable adjustments at work.*

## Pregnancy-related absence (MAT B1)

If the absence is pregnancy-related, the maternity certificate is
the **MAT B1** rather than the Med 3. The form captures a
`return_to_work.maternity_certificate_reference` field. See the
sibling form
`forms/united-kingdom-maternity-certificate-mat-b1/`.
