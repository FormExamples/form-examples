# Safety case notes — Oral and Maxillofacial Surgery Waiting List Card

## Risk pathway — long waiters and harm

NHS England requires a documented *clinical harm review* for any
patient waiting more than 52 weeks. The harm-review approach is set
out in the *Clinical Validation of Long Waits* guidance.

- NHS England. *Elective care transformation — clinical validation
  of long waits.*
  <https://www.england.nhs.uk/elective-care-transformation/>
- NHS England. *Harm review guidance for patients waiting for
  elective care.* (Published as part of the elective recovery
  programme; refer to the current version on the elective-care site.)

The form's `long-wait` Waiting Time Status fires at > 52 weeks since
clock-start and triggers a high-priority *52-week long waiter* flag.

## P1 escalation

For a P1 patient (emergency or urgent surgery), the operational
constraint is 24 or 72 hours from decision-to-operate. The form's
*Priority-1 escalation* flag fires when an appointment is more than
7 days away — this is a backstop, not a target; the operational unit
must escalate any P1 with no booked appointment within 24 hours.

## Did Not Attend (DNA) policy

The RTT Rules Suite requires that DNA clock stops are recorded only
where:

- the appointment letter was demonstrably received, **and**
- the patient was given the opportunity to rebook, **and**
- DNA is not the result of an Access barrier (per the Equality Act
  2010 / Accessible Information Standard).

The card does not auto-stop the clock on a DNA; that is an
operational PAS function.

## Equality Act 2010

Direct or indirect discrimination on protected characteristics is
unlawful. The Long Wait flag should drive a *health-inequality
review* of any sub-cohort that disproportionately accumulates breach
flags.

- *Equality Act 2010.*
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- NHS England. *Core20PLUS5 — reducing healthcare inequalities.*
  <https://www.england.nhs.uk/about/equality/equality-hub/national-healthcare-inequalities-improvement-programme/core20plus5/>

## Data protection

- Lawful basis (UK GDPR): Article 6(1)(e) public task; Article
  9(2)(h) provision of health care.
- *NHS Records Management Code of Practice.*
  <https://www.nhsx.nhs.uk/information-governance/guidance/records-management-code/>
- Retention: align with the retention period for the parent
  outpatient record; the card itself is *transient* but the
  underlying RTT pathway data is retained per HES retention policy.

## Patient choice and pauses

Patient-initiated pauses to the RTT clock are valid only in defined
circumstances per the Rules Suite. The card surfaces the *current*
clock-state but does not automatically pause; pause and resume are
operational PAS functions.
