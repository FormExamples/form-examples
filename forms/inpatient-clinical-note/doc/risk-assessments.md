# Mandatory inpatient risk assessments

Step 9 of the wizard. Each assessment is carried as a **status and band
summary**, not as a full instrument: where this monorepo already models the
instrument in full, the note links to it rather than duplicating the scoring.

## VTE — venous thromboembolism

NICE NG89, *Venous thromboembolism in over 16s: reducing the risk of
hospital-acquired deep vein thrombosis or pulmonary embolism* (2018). Every
inpatient must have a VTE risk assessment on admission and be reassessed when
their clinical condition changes.

Fields: `vte_status` (`done` / `not-done` / `not-applicable`),
`vte_prophylaxis` (`pharmacological` / `mechanical` / `both` / `none` /
`contraindicated`), `vte_assessed_at`, `vte_notes`.

`vte_status == 'not-done'` fires the high-priority `vte-not-assessed` flag, and
`vte_status` is the sole predicate for the `risk-assessments` completeness
component — the other assessments on this step are recommended rather than
required, because NG89 is the only one that is mandated for every inpatient on
every admission.

Full instruments elsewhere in the monorepo:
[`caprini-venous-thromboembolism-risk-assessment`](../../caprini-venous-thromboembolism-risk-assessment),
[`padua-venous-thromboembolism-risk-assessment`](../../padua-venous-thromboembolism-risk-assessment).

## Falls

NICE CG161, *Falls in older people: assessing the risk and prevention* (2013,
updated 2019). Inpatients aged 65 and over, and those aged 50–64 judged at
higher risk, should have a multifactorial falls assessment.

Fields: `falls_risk` (`low` / `moderate` / `high` / `not-assessed`),
`falls_interventions`.

Related form: [`fall-risk-assessment`](../../fall-risk-assessment).

## Pressure ulcers

NICE CG179, *Pressure ulcers: prevention and management* (2014). Assess on
admission and reassess if the patient's condition changes.

Fields: `pressure_ulcer_risk` (`low` / `medium` / `high` / `not-assessed`),
`skin_integrity` (`intact` / `at-risk` / `damaged`), `pressure_ulcer_grade`
(`none` / `1` / `2` / `3` / `4` / `unstageable` / `deep-tissue-injury`),
`pressure_ulcer_sites`.

Related form:
[`waterlow-pressure-ulcer-risk-assessment`](../../waterlow-pressure-ulcer-risk-assessment).

## Delirium

NICE CG103, *Delirium: prevention, diagnosis and management* (2010, updated
2023). Assess for delirium on admission in anyone at risk, and reassess on any
change in behaviour or cognition.

Fields: `delirium_screen` (`negative` / `possible-delirium` /
`probable-delirium` / `cognitive-impairment` / `not-assessed`),
`delirium_4at_score` (0–12), `delirium_notes`.

The 4AT band is carried as a summary; the full four-item instrument lives in
[`four-a-test-for-delirium`](../../four-a-test-for-delirium). See spec §9 for
the open question about whether to embed the items here too.

Related form: [`confusion-assessment-method`](../../confusion-assessment-method).

## Nutrition

BAPEN Malnutrition Universal Screening Tool (MUST), and NICE CG32 *Nutrition
support for adults* (2006, updated 2017). Screen on admission and weekly
thereafter.

Fields: `nutrition_screen` (`low-risk` / `medium-risk` / `high-risk` /
`not-assessed`), `must_score` (0–6), `nutrition_plan`.

Related form: [`nutrition-assessment`](../../nutrition-assessment).

## Infection control

Fields: `infection_status` (`none` / `suspected` / `confirmed`),
`isolation_status` (`none` / `source` / `protective` / `cohort`),
`organism`, `infection_precautions`.

Recorded because isolation status materially affects ward placement, transfer,
and discharge planning, and because it must travel with a transfer note.

## Safeguarding

Fields: `safeguarding_concern` (`yes` / `no`), `safeguarding_notes`,
`safeguarding_referral_made` (`yes` / `no`).

A safeguarding concern never auto-escalates the acuity band — safeguarding is a
separate statutory pathway, not a physiological deterioration — but it is
rendered prominently in the report.

Related forms: [`child-safeguarding-referral`](../../child-safeguarding-referral).

## Antimicrobial stewardship

NICE NG15, *Antimicrobial stewardship* (2015). Antimicrobials should carry an
indication, a duration or review date, and a documented review at 48–72 hours.

Fields: `antimicrobial_review_status` (`not-applicable` / `due` / `done` /
`overdue`), `antimicrobial_review_at`. `overdue` fires the medium-priority
`antimicrobial-review-overdue` flag.
