# Medical Fit Note

A single-page, step-by-step form for a clinician to assess, sign and approve a
fit note (Statement of Fitness for Work) for an employee taking sick leave.
It follows the UK fit note model: the clinician advises that the employee is
either **not fit for work** or **may be fit for work** with adjustments, for a
stated period.

## Wizard steps

| Step | Title               | Collects                                                              |
| ---- | ------------------- | --------------------------------------------------------------------- |
| 1    | Employee            | Name, birth date, NHS number, employer, job title                     |
| 2    | Assessment          | Date and method (face-to-face, video, telephone, records review)     |
| 3    | Condition           | Primary and additional diagnoses, functional effects                  |
| 4    | Fitness advice      | Not fit for work, or may be fit for work                              |
| 5    | Adjustments         | Phased return, altered hours, amended duties, workplace adaptations   |
| 6    | Period              | From / to dates or duration, reassessment needed                      |
| 7    | Consent and sign-off | Employee consent to share, clinician declaration, signature           |
| 8    | Report              | Approval status, rules fired, flags                                   |

## Approval rules

The approval status is `approved` when every required item is present and
valid, `needs-completion` when something fixable is missing, and `blocked`
when the note cannot be issued as written.

| Rule | Condition                                                                   | Effect               |
| ---- | --------------------------------------------------------------------------- | -------------------- |
| R-01 | No assessment date or method                                                | needs-completion     |
| R-02 | No primary diagnosis                                                        | needs-completion     |
| R-03 | No fitness advice chosen                                                    | blocked              |
| R-04 | Period missing, or `to` before `from`                                       | blocked              |
| R-05 | "May be fit" with no adjustment selected                                    | needs-completion     |
| R-06 | Clinician declaration not ticked                                            | blocked              |
| R-07 | Clinician has no registration body and number                               | blocked              |
| R-08 | Period over 90 days with no reassessment                                    | needs-completion     |
| R-09 | Period starts more than 14 days before the assessment date (backdating)     | needs-completion     |

The worst effect wins: blocked over needs-completion over approved.

## Compliance

- [DWP: Fit note guidance for healthcare professionals](https://www.gov.uk/government/publications/fit-note-guidance-for-gps-and-hospital-doctors)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- The baseline in [`/AGENTS.md`](../../AGENTS.md)

This form records clinical advice; it does not replace the statutory fit note
issued through a clinical system.
