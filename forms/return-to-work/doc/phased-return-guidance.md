# Phased Return Guidance

A *phased return* is the most common adjustment recommended on a fit
note. The employee returns to work on reduced hours or reduced
duties and steps up to full hours over a defined period. The
template below is taken from Acas and NHS Employers.

## Eligibility

Phased return is appropriate when:

- The clinician judges that the employee can perform some duties.
- A controlled increase in workload supports recovery (most common
  in mental-health, musculoskeletal, post-surgical, and oncology
  contexts).
- The employer can practically accommodate reduced hours for the
  agreed period (typically up to 4 weeks; up to 12 weeks for major
  surgery or cancer recovery).

Phased return is **not** appropriate when:

- The employee is still acutely unwell (fitness statement should be
  `not-fit`).
- The role cannot be performed on reduced duties (e.g.
  safety-critical roles where partial fitness is unsafe).
- The employer has explicitly declined adjustments and no
  alternative role is available (employee remains on `not-fit`).

## Standard ramp templates

### 2-week ramp (mild illness, post-viral recovery)

| Week | Hours per week | Days per week |
| --- | --- | --- |
| 1 | 50 % | reduced (3 of 5) |
| 2 | 75 % | normal |
| 3 + | 100 % | normal |

### 4-week ramp (post-surgical, moderate mental health)

| Week | Hours per week | Days per week |
| --- | --- | --- |
| 1 | 25 % | 2 of 5 |
| 2 | 50 % | 3 of 5 |
| 3 | 75 % | 4 of 5 |
| 4 | 100 % | normal |

### 8-week ramp (major surgery, cancer recovery)

| Week | Hours per week | Days per week |
| --- | --- | --- |
| 1-2 | 20 % | 2 of 5, short days |
| 3-4 | 40 % | 3 of 5, short days |
| 5-6 | 60 % | normal |
| 7-8 | 80 % | normal |
| 9 + | 100 % | normal |

### 12-week ramp (severe mental health, complex post-treatment)

Bespoke per case. Mandatory occupational-health review at week 4
and week 8.

## Data captured

The form captures the per-week ramp in the
`return_to_work.phased_return_schedule_json` column as an ordered
list of `{week, hours_per_week, days_per_week, notes}` entries.
The target full-hours date is `return_to_work.phased_return_target_date`.

## Return-to-work meeting

Independent of phased return, Acas recommends a *return-to-work
meeting* on the first day back. The form captures the meeting status
in `return_to_work.return_to_work_meeting_scheduled`.

## See also

- Acas. *Phased return to work after illness.*
- NHS Employers. *Supporting staff to return to work after long-term
  sickness absence.*
- NICE NG146. *Workplace health: long-term sickness absence and
  capability to work.*
