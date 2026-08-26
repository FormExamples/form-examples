# Hospital Performance Indicators — Spec

Living spec for `hospital-performance-indicators`. This is the
canonical, hand-maintained source of the 50 Balanced Scorecard
indicators. Front-end indicator catalogues
(`front-end-with-svelte/src/lib/config/indicators.ts`,
`front-end-with-html/js/indicators.js`) and the SQL seed data must
stay in sync with this list.

## Response model

Each indicator below is recorded independently as a decimal number
(or left unanswered), with an optional free-text note. The unit —
ratio, percentage, currency, day count, rate — is implied by the
indicator name; this form does not enforce a unit per field.

## Indicator catalogue

### 1. Finance Indicators

- `1.1` — Ratio of total revenue to total costs
- `1.2` — % Deductions of hospital
- `1.3` — Average hospitalization expenditures
- `1.4` — Average outpatient expenditures
- `1.5` — Average expenditures per bed per day
- `1.6` — Current cost per bed
- `1.7` — Ratio of capital expenditures to current costs
- `1.8` — Cost of drugs and materials, and personnel costs, as a percentage of total costs
- `1.9` — Total fixed cost per bed occupancy

### 2. Process Indicators

- `2.1` — Average length of stay
- `2.2` — Bed turnover interval
- `2.3` — Bed occupancy
- `2.4` — Bed turnover
- `2.5` — Mortality rate
- `2.6` — Cancelled operations
- `2.7` — % Repeated surgeries
- `2.8` — Discharge with personal satisfaction
- `2.9` — Hospital infection rate
- `2.10` — Clinical errors
- `2.11` — Readmission rate
- `2.12` — % Occupational accidents
- `2.13` — Pressure ulcers rate
- `2.14` — Medical errors
- `2.15` — Wrong-site surgery
- `2.16` — Leaving a foreign object during surgery
- `2.17` — Medication errors
- `2.18` — Wrong blood group / type transfusion error
- `2.19` — Patient falls rate
- `2.20` — Hospital accidents prevalence rate
- `2.21` — Sentinel event rate
- `2.22` — Needlestick and sharps injury rate
- `2.23` — Legal complaints against the hospital
- `2.24` — Doctors on-call at night
- `2.25` — Waiting time for admission to the operation room
- `2.26` — Mean length of stay in the emergency department
- `2.27` — Emergency Room (ER) waiting time
- `2.28` — Waiting time from triage to seeing the doctor

### 3. Learning and Growth Indicators

- `3.1` — Staff satisfaction rate
- `3.2` — Staff turnover
- `3.3` — Training expenditures per capita
- `3.4` — Key jobs with a trained substitute available
- `3.5` — Average hours of internet use
- `3.6` — Ratio of electronic medical record sick-leave days to total employees
- `3.7` — Employee absenteeism rate
- `3.8` — Rate of employee sick leave

### 4. Customer Indicators

- `4.1` — Facilities for families and visitors
- `4.2` — Patient satisfaction percentage
- `4.3` — Rate of patient complaints
- `4.4` — Other stakeholders satisfaction
- `4.5` — Social satisfaction

## Source

Transcribed from a hospital Balanced Scorecard indicator list
(Kaplan & Norton framework applied to hospital operations). Item
text is lightly normalized for readability (spelling/punctuation
corrections, expanded abbreviations) while preserving the original
indicator meaning. Two items in the source combined two distinct
concepts onto one line (`1.8`, the drugs/materials-cost and
personnel-cost indicator); this is preserved as a single indicator
rather than editorially split into two.
