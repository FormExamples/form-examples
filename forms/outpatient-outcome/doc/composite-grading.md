# OOCG — composite grading

The Outpatient Outcome Composite Grade (OOCG) combines four sub-
grades into an overall grade A–E using a *worst-of* aggregation rule.

## Aggregation algorithm

```
overall = max(clinical, prom, prem, operational)   # where E > D > C > B > A
```

The worst-of rule is the same aggregation used in many clinical
composite outcome scores (e.g. ASA grade, NEWS2 escalation
thresholds). It is intentionally conservative.

## Sub-grade derivation

### Clinical sub-grade

| Letter | Clinician-rated outcome |
| --- | --- |
| A | Resolved |
| B | Improved |
| C | Unchanged |
| D | Worsened |
| E | Died |

### PROM sub-grade

The PROM sub-grade is computed from three sub-instruments. The form's
implementation uses the worst-of:

| Letter | Threshold criterion |
| --- | --- |
| A | EQ-5D-5L utility change ≥ MID; GRC = +3; PROMIS GPH change ≥ MID positive |
| B | EQ-5D-5L utility change > 0 but < MID; GRC = +2 |
| C | No clinically meaningful change in any PROM |
| D | EQ-5D-5L utility change < 0; GRC = −2 or worse |
| E | EQ-5D-5L utility change exceeds clinically significant worsening; GRC = −3 |

The *Minimal Important Difference* (MID) values used:

- EQ-5D-5L utility MID: ~0.074 (Walters & Brazier 2005; varies by
  condition).
  - Walters SJ, Brazier JE. *Comparison of the minimally important
    difference for two health state utility measures: EQ-5D and SF-6D.*
    Qual Life Res 2005; 14(6): 1523–1532. PMID: 16110932.
    <https://link.springer.com/article/10.1007/s11136-004-7713-0>
- PROMIS Global Health T-score MID: ~3 points (HealthMeasures
  guidance).
  <https://www.healthmeasures.net/score-and-interpret/interpret-scores/promis>

### PREM sub-grade

| Letter | FFT response |
| --- | --- |
| A | Very Good |
| B | Good |
| C | Neither good nor poor |
| D | Poor |
| E | Very Poor |

### Operational sub-grade

| Letter | Driver |
| --- | --- |
| A | Attended on first appointment; modality matches request; wait < target |
| B | Attended; wait at target |
| C | Attended after reschedule; wait moderately over target |
| D | DNA followed by rebook; wait substantially over target |
| E | Cancelled by provider; multiple DNAs; wait > breach threshold |

## Recording and exchange

- The overall OOCG is recorded in FHIR as an `Observation` with a
  local code system; the four sub-grades are sub-observations
  (`hasMember`). The HL7 base `Observation` resource is the canonical
  container. <http://hl7.org/fhir/observation.html>
- PROM and PREM responses are recorded in `QuestionnaireResponse`
  with the relevant LOINC questionnaire codes where available.
  EQ-5D-5L has a LOINC code; PROMIS items have LOINC codes through
  the NLM PROMIS LOINC mapping.
  <https://loinc.org/promis/>
