# Methodology reference — workplace climate assessment

A workplace climate assessment measures employees' shared perceptions
of the work environment — culture, leadership, fairness, psychological
safety, equality, diversity, and inclusion. It differs from a
satisfaction or engagement survey by focusing on the environment
itself rather than individual job experience.

## Theoretical grounding

### Schneider's organizational climate

The construct of *organizational climate* originates with **Benjamin
Schneider** (1975). Climate is defined as shared perceptions of
policies, practices, and procedures, both formal and informal.

- Schneider, B. (1975). Organizational climates: An essay. *Personnel
  Psychology*, 28(4): 447-479.
  doi:10.1111/j.1744-6570.1975.tb01386.x

### Psychological safety

Amy Edmondson's *psychological safety* — "a shared belief held by
members of a team that the team is safe for interpersonal risk taking"
— is the most-cited individual subscale.

- Edmondson, A. (1999). Psychological safety and learning behavior in
  work teams. *Administrative Science Quarterly*, 44(2): 350-383.
  doi:10.2307/2666999
- Seven-item psychological safety scale published in Edmondson 1999;
  the Google Aristotle Project (2015) refined and popularized the
  construct.

### Equality, diversity, and inclusion (EDI) climate

UK practice draws on the **Equality Act 2010** definition of protected
characteristics (age, disability, gender reassignment, marriage and
civil partnership, pregnancy and maternity, race, religion or belief,
sex, sexual orientation).

- Equality Act 2010 (c. 15), s.4.
  <https://www.legislation.gov.uk/ukpga/2010/15/section/4>

EDI climate items are typically drawn from validated scales such as:

- Mor Barak, M. E. (1998). The inclusion-exclusion continuum scale.
  *Journal of Applied Behavioral Science*, 34(4): 423-447.
- Nishii, L. H. (2013). The benefits of climate for inclusion for
  gender-diverse groups. *Academy of Management Journal*, 56(6):
  1754-1774. doi:10.5465/amj.2009.0823

## Subscales used in this implementation

The implementation captures climate across these subscales:

1. **Psychological safety** (Edmondson 7-item scale).
2. **Procedural justice** (Colquitt 2001 — procedural justice scale).
3. **Distributive justice** (Colquitt 2001 — distributive justice scale).
4. **Inclusion climate** (Mor Barak / Nishii items).
5. **Voice climate** (Morrison & Phelps 1999) — whether employees feel
   they can raise concerns.
6. **Leader-member exchange / supervisor support** (LMX-7, Graen &
   Uhl-Bien 1995).
7. **Free-text climate description**.

References for scales:

- Colquitt, J. A. (2001). On the dimensionality of organizational
  justice: A construct validation of a measure. *Journal of Applied
  Psychology*, 86(3): 386-400. doi:10.1037/0021-9010.86.3.386
- Morrison, E. W. & Phelps, C. C. (1999). Taking charge at work.
  *Academy of Management Journal*, 42(4): 403-419.
- Graen, G. B. & Uhl-Bien, M. (1995). Relationship-based approach to
  leadership: development of leader-member exchange (LMX) theory.
  *Leadership Quarterly*, 6(2): 219-247.

## Response scale and analysis

- 7-point Likert (1 = strongly disagree; 7 = strongly agree).
- Cohort aggregation with minimum cohort size 10 (consistent with the
  employee-satisfaction-survey form).
- 95 % confidence intervals reported alongside cohort means.

## Cadence

Climate surveys are typically annual or semi-annual. The
implementation persists prior cycles for longitudinal trend reporting.

## References

- Schneider, B. (1975). Organizational climates: An essay.
  doi:10.1111/j.1744-6570.1975.tb01386.x
- Edmondson, A. (1999). Psychological safety and learning behavior.
  doi:10.2307/2666999
- Colquitt, J. A. (2001). Dimensionality of organizational justice.
  doi:10.1037/0021-9010.86.3.386
- Nishii, L. H. (2013). Climate for inclusion.
  doi:10.5465/amj.2009.0823
- Equality Act 2010.
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- CIPD — Inclusion and diversity factsheet.
  <https://www.cipd.org/uk/knowledge/factsheets/diversity-factsheet/>
