# Return to Work — static HTML dashboard

Plain-HTML review table for the occupational-health team to triage
recent Return to Work statements. No build step; open
`index.html` in a browser.

## Layout

| Column | Source |
| --- | --- |
| Patient | `patient.name` |
| Employer | `employer.name` |
| Clinician | `clinician.name` |
| Statement date | `return_to_work.assessment_date` |
| Fitness | `return_to_work.fitness_statement_final` |
| Restrictions | `return_to_work_grade.restriction_priority` |
| Flags | `return_to_work_grade.flag_count` |
| Valid until | `return_to_work.valid_until` |
| Review | `return_to_work.review_date` |

## Stack

- Plain HTML5 single file.
- Tailwind CSS 4 via CDN.
- Alpine.js 3.14.8 for filter / sort interactions.
- Vanilla `fetch()` against the Rust full-stack `GET /api/v1/return-to-work`
  endpoint, with a sample-data fallback for standalone preview.
