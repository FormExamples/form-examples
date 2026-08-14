# Methodology reference — employee satisfaction survey

The employee satisfaction survey instrument captures perceptions of
working life across engagement, satisfaction, and well-being. This
implementation draws on widely-used, peer-reviewed scales rather than
inventing a bespoke scale.

## Published engagement / satisfaction scales referenced

### Gallup Q12

The Gallup Q12 is a 12-item engagement instrument developed at Gallup
in the 1990s and used in the longitudinal *State of the Global
Workplace* reporting. The 12 items measure expectations, materials,
recognition, growth, and belonging.

- Reference: Gallup — State of the Global Workplace (current annual
  report). <https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx>
- Harter, J. K., Schmidt, F. L., & Hayes, T. L. (2002) "Business-unit-
  level relationship between employee satisfaction, employee engagement,
  and business outcomes: A meta-analysis." *Journal of Applied
  Psychology* 87(2): 268–279. doi:10.1037/0021-9010.87.2.268

The Q12 is proprietary to Gallup. Implementations should reference Q12
but use the published item dimensions as a model rather than embedding
copyrighted text without licence.

### Utrecht Work Engagement Scale (UWES)

The UWES is a published academic scale developed by Wilmar Schaufeli
and Arnold Bakker. It exists in 17-, 9-, and 3-item versions and
measures three sub-dimensions: vigour, dedication, and absorption.

- Schaufeli, W. B., & Bakker, A. B. (2004) "Utrecht Work Engagement
  Scale (UWES): Preliminary manual." *Occupational Health Psychology
  Unit, Utrecht University*.
- Schaufeli, W. B., Bakker, A. B., & Salanova, M. (2006) "The
  measurement of work engagement with a short questionnaire: A
  cross-national study." *Educational and Psychological Measurement*
  66(4): 701–716. doi:10.1177/0013164405282471
- Scale and manual: <https://www.wilmarschaufeli.nl/tests/>

The UWES is free for non-commercial research and educational use under
the author's published licence.

### Minnesota Satisfaction Questionnaire (MSQ)

A long-standing satisfaction scale (Weiss, Dawis, England, & Lofquist,
1967) — 100-item long form, 20-item short form.

- Vocational Psychology Research, University of Minnesota.
  <http://vpr.psych.umn.edu/instruments/msq-minnesota-satisfaction-questionnaire>

### Job Diagnostic Survey (JDS)

Hackman & Oldham's instrument operationalizing the Job Characteristics
Model (skill variety, task identity, task significance, autonomy,
feedback).

- Hackman, J. R., & Oldham, G. R. (1975) "Development of the Job
  Diagnostic Survey." *Journal of Applied Psychology* 60(2): 159–170.
  doi:10.1037/h0076546

### eNPS (Employee Net Promoter Score)

Adapted from Reichheld's NPS for customers. Single item: "On a scale
of 0–10, how likely is it that you would recommend [organization] as a
place to work?" Score = % promoters (9–10) − % detractors (0–6).

- Reichheld, F. F. (2003) "The One Number You Need to Grow." *Harvard
  Business Review*, December 2003.
  <https://hbr.org/2003/12/the-one-number-you-need-to-grow>

## Choice for this implementation

The implementation captures a survey response set that includes:

- A short engagement scale (UWES-9 dimensions: vigour, dedication,
  absorption).
- Job-characteristics items from the Hackman/Oldham model.
- An eNPS item.
- Free-text comment fields.
- Optional demographics with explicit opt-in for analytics.

UWES-9 is preferred because it is academically validated and freely
licensed for non-commercial use. eNPS is included as a single
benchmark headline metric.

## Response scale

A standard 7-point Likert scale (1 = never / strongly disagree;
7 = always / strongly agree) is used to match the UWES manual.

## Confidentiality and anonymity

- Responses are anonymous by default; demographics are stored separately
  and only joined for aggregate analytics where the cohort size is ≥10.
- Free text is reviewed for personally identifying content before
  release into the analytics warehouse.

## References

- Schaufeli & Bakker (2003) UWES Manual:
  <https://www.wilmarschaufeli.nl/tests/>
- Harter, Schmidt, & Hayes (2002) Q12 meta-analysis:
  doi:10.1037/0021-9010.87.2.268
- Hackman & Oldham (1975) Job Diagnostic Survey:
  doi:10.1037/h0076546
- Reichheld (2003) NPS: HBR Dec 2003.
- CIPD — Employee engagement and motivation factsheet.
  <https://www.cipd.org/uk/knowledge/factsheets/engagement-factsheet/>
