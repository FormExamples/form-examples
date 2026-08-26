# NHS Referral to Treatment (RTT) — Rules Suite

The Waiting Time Status engine in this form is grounded in the NHS
England *Referral to Treatment (RTT) consultant-led waiting times
Rules Suite*, which defines the 18-week elective standard and the
clock-start / clock-stop rules.

- NHS England. *Referral to Treatment (RTT) waiting times.*
  Index: <https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/>
- NHS England. *Recording and Reporting Referral to Treatment (RTT)
  Waiting Times for Consultant-led Elective Care — Rules Suite.*
  Current version PDF (updated October 2023):
  <https://www.england.nhs.uk/wp-content/uploads/2023/10/PRN00713-recording-and-reporting-rtt-rules-suite-v17.pdf>

## Clock start

The RTT clock starts when *any* of the following occurs:

- A referral letter is received from a GP, optometrist, GP-with-
  specialist-interest, or community dental service to a consultant
  service.
- A self-referral is accepted through a recognized pathway.
- A consultant-to-consultant referral that meets the criteria.
- The patient is added to a waiting list following a decision-to-
  treat at outpatient.

The form's `referralDate` field captures the clock-start date.

## Clock stop

The RTT clock stops when:

- First definitive treatment is delivered, **or**
- The patient is added to an active monitoring list, **or**
- The patient declines treatment, **or**
- The patient is discharged without further treatment, **or**
- The patient does not attend (DNA) under the *Did Not Attend* rules
  with appropriate documentation.

## 18-week standard

Under the NHS Constitution, **92%** of patients on an incomplete RTT
pathway must wait no longer than 18 weeks. The 18-week reference is
the *Within Target* boundary in the Waiting Time Status engine for
priority P4.

- NHS Constitution. *Operating standards.*
  <https://www.gov.uk/government/publications/the-nhs-constitution-for-england>

## 52-week long waiters

The *Elective Recovery Plan* (2022 / refreshed) commits to eliminating
waits over 52 weeks. A patient on the list at 52 weeks is a *long
waiter* requiring a documented harm review.

- NHS England. *Delivery plan for tackling the COVID-19 backlog of
  elective care.* February 2022.
  <https://www.england.nhs.uk/coronavirus/publication/delivery-plan-for-tackling-the-covid-19-backlog-of-elective-care/>
- NHS England. *Clinical validation of long waits.*
  Index: <https://www.england.nhs.uk/elective-care-transformation/>

## Patient choice and pauses

The RTT rules permit patient-choice pauses but require careful
recording. The form's `additionalNotes` field is the place to record
the reason for any deviation between the calculated and operational
clock.
