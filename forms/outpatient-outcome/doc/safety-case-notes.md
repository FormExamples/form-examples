# Safety case notes — outpatient outcome

## Risk pathway — *Worsened* / *Died* clinical sub-grade

A *Worsened* or *Died* clinical sub-grade triggers a documented
review of the encounter. If the worsening is attributed to the
encounter, the case is reportable under the **Learn from patient
safety events (LFPSE) service** and the consultant's clinical
governance pathway.

- NHS England. *Learn from patient safety events service.*
  <https://www.england.nhs.uk/patient-safety/learn-from-patient-safety-events-service/>
- NHS England. *Patient Safety Incident Response Framework.*
  <https://www.england.nhs.uk/patient-safety/patient-safety-incident-response-framework/>

## Risk pathway — very poor PREM

A *Very Poor* PREM sub-grade with a free-text comment may indicate a
service or behavioural complaint and should be routed to the
practice manager per the *Local Authority Social Services and
National Health Service Complaints (England) Regulations 2009*.

- *Complaints Regulations 2009.*
  <https://www.legislation.gov.uk/uksi/2009/309/contents/made>

## PROM scoring caveats

- EQ-5D-5L: use the value set appropriate for the patient's
  jurisdiction (England, Scotland, Northern Ireland and Wales use the
  Devlin 2018 England value set unless specified).
- PROMIS Global Health: convert raw to T-score via the HealthMeasures
  scoring table; do not arithmetic-average raw items.
- Some PROM instruments are licence-restricted for commercial use —
  EQ-5D-5L requires a EuroQol licence; the form's wording is
  paraphrased and is **not** the licensed instrument.

## False-positive PROM improvement

Recall-bias and regression-to-the-mean inflate apparent post-
encounter improvement. The form mitigates by:

- recording both pre- and post-encounter EQ-5D-5L scores explicitly,
- using the unsigned MID threshold rather than a percentage
  improvement,
- recording the Global Rating of Change *with* the EQ-5D-5L delta
  (concordance increases confidence; discordance is flagged).

## Data protection

- Lawful basis: UK GDPR Article 6(1)(e) public task / Article
  9(2)(h) provision of health care.
- Free-text comments are personal data; do not include identifiable
  third parties without consent.
- Retention per the *NHS Records Management Code of Practice*.

## Licence boundary

See `licensing.md` (already in the doc directory) for the per-
instrument licence position. Recap:

- EQ-5D-5L — EuroQol licence required for commercial / non-research
  use.
- FFT — Open Government Licence v3.0.
- PROMIS Global Health — NIH public domain.
- NHS Attendance Outcome — Open Government Licence v3.0.
