# Assessment protocol — workplace safety

The assessment record follows HSE's published five-step risk-assessment
method, mapped to the Management of Health and Safety at Work
Regulations 1999 (SI 1999/3242) regulation 3.

Authoritative source: HSE — *Managing for health and safety* (HSG65)
and *Risk assessment: a brief guide*.
<https://www.hse.gov.uk/pubns/books/hsg65.htm>

## Step 1 — identify the hazards

The assessment record captures hazards by category:

- physical (slips, trips, falls; working at height; vehicles; machinery);
- ergonomic (manual handling, display screen equipment);
- chemical / biological (COSHH substances; legionella);
- electrical;
- fire;
- noise and vibration;
- ionizing and non-ionizing radiation;
- psychosocial (workplace stress — cross-referenced to the workplace-
  stress-assessment form);
- security and violence;
- lone working;
- new and expectant mothers (specific risk-assessment under SI 1999/
  3242 reg. 16).

Reference vocabulary: HSE *Causation of accidents* taxonomy.

## Step 2 — decide who might be harmed and how

Per-hazard, the implementation captures the person groups at risk
(employees, contractors, agency workers, visitors, members of the
public) and any vulnerable groups specifically:

- young persons (under 18) — SI 1999/3242 reg. 19;
- new and expectant mothers — SI 1999/3242 reg. 16;
- disabled workers — Equality Act 2010 reasonable adjustments;
- lone workers — HSE INDG73.

## Step 3 — evaluate the risks and decide on controls

Risk is recorded as **likelihood × severity**, each on a 1-5 scale,
producing a risk score 1-25. The implementation also records the
**hierarchy of control** applied, per HSE guidance and the
EU Framework Directive 89/391/EEC art. 6:

1. **Elimination** of the hazard.
2. **Substitution** with a less hazardous alternative.
3. **Engineering controls** (e.g. guards, ventilation).
4. **Administrative controls** (e.g. safe systems of work, training).
5. **Personal Protective Equipment (PPE)**.

PPE is the last resort, per the General Principles of Prevention in
Schedule 1 of SI 1999/3242.

## Step 4 — record the significant findings

The assessment record persists, per hazard:

- description;
- person groups at risk;
- existing controls;
- residual risk score;
- additional controls required (action items);
- owner;
- target completion date;
- review date.

The record carries `created_at`, `updated_at`, `deleted_at` timestamps
and an append-only audit log.

## Step 5 — review

Reviews are triggered by:

- the calendar (annually as a minimum, or per HSE-recommended cadence
  for the hazard);
- an incident or near-miss;
- a change in process, equipment, premises, or people;
- legislative change.

The implementation enforces an annual review window and surfaces
overdue reviews on the dashboard.

## Specific assessment sub-types

The implementation supports embedded sub-assessments for:

- **DSE workstation assessment** (DSE Regulations 1992).
- **Manual handling assessment** (MAC tool — HSE).
- **COSHH assessment**.
- **Fire risk assessment** (Regulatory Reform (Fire Safety) Order 2005).
- **New and expectant mother assessment**.
- **Young person assessment**.

## Incident, accident, near-miss recording

Linked to the assessment is an incident register supporting RIDDOR
reportability assessment per incident:

- incident type;
- date / time / location;
- persons affected;
- injury type and severity;
- equipment involved;
- immediate cause;
- root cause;
- corrective actions;
- whether RIDDOR-reportable;
- F2508 reference number where reported.

## References

- HSE — Risk management.
  <https://www.hse.gov.uk/simple-health-safety/risk/index.htm>
- HSE — HSG65 *Managing for health and safety*.
  <https://www.hse.gov.uk/pubns/books/hsg65.htm>
- HSE — INDG73 *Working alone*.
  <https://www.hse.gov.uk/pubns/indg73.htm>
- HSE — Manual handling assessment charts (MAC tool).
  <https://www.hse.gov.uk/msd/mac/>
- Council Directive 89/391/EEC — Framework Directive on the
  introduction of measures to encourage improvements in the safety
  and health of workers at work.
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:31989L0391>
