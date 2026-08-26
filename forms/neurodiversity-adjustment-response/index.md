# Neurodiversity Adjustment Response

A UK–aligned **workplace reasonable-adjustments response for neurodiversity**
that an employer (line manager, HR adviser, or occupational-health lead)
completes in answer to a request for adjustments. It is the **response /
confirmation counterpart** to
[`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request):
where the request captures *what a neurodivergent worker needs and why*, this
form records *what the employer has decided, what has been agreed, and how it
will be reviewed*. It records the overall decision and its rationale, which
adjustments were agreed (and any alternatives offered), the trial period and
review date, support / resources / responsibilities, and any escalation — then
computes a **four-axis grade** (outcome classification, legal / discrimination
risk, response completeness, and follow-up / review urgency) plus a set of
compliance-and-risk flags including an automatic **discrimination-risk alert**.
The output is a structured confirmation-and-review record.

This form is the **response** half of the request/response pair. It combines the
ACAS *reasonable-adjustment confirmation* and *review* templates into one
continuous record, and is aligned with ACAS reasonable-adjustments guidance and
the [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents)
duty to make reasonable adjustments.

> **Note on terminology.** This form uses the UK term *reasonable adjustments*
> (Equality Act 2010 / ACAS). The equivalent US term is *accommodation*.

## Scope and intended users

- **Setting:** any workplace where a worker has requested adjustments — office,
  remote / hybrid, field, shift, or during recruitment.
- **Users:** line managers, HR advisers, diversity leads, and occupational-health
  practitioners who assess a request and author the employer's reply.
- **Subjects:** any worker who has requested neurodiversity-related adjustments.

## Response semantics (not a request)

A **request** form is prospective and asks *what does this worker need, and how
urgently?*. A **response** form is retrospective and records *what did the
employer decide, and what happens next?*. Accordingly the source-of-truth table
here is `neurodiversity_adjustment_response`, the responding person is the reply
**author / decision-maker** (not the requester), and the grade engine interprets
the decision — and its legal risk — rather than triaging a request.

## Interpretation grading

The engine grades each response on **four independent axes**, each anchored to a
recognized source. Axes are orthogonal: a complete, well-structured response can
still carry high legal risk if it declines adjustments a worker is likely
entitled to.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Outcome classification** | Overall decision | fully-agreed / partially-agreed / alternative-offered / declined / deferred |
| **B. Legal / discrimination risk** | Reasonableness / Equality Act failure-to-adjust rules | ok / caution / high-risk |
| **C. Response completeness** | Mandatory-section checklist (decision, rationale, agreed detail, review, contact, effective date) | 0–100 % complete |
| **D. Follow-up / review urgency** | Review-and-escalation rules | none / review-scheduled / urgent-review / escalation-needed (+ target timeframe) |

Declining adjustments for a worker **likely covered by the Equality Act 2010**
without an adequate reasonableness justification or alternatives **auto-escalates**
Axis B to *high-risk* and raises the `discrimination-risk` flag regardless of the
other axes. Choose the least-alarming band only when no rule fires.

### The reasonableness test

Where any adjustment is declined, the response records a `decline_reason_category`
reflecting the factors an employment tribunal weighs when deciding whether an
adjustment was reasonable:

`not-reasonable`, `disproportionate-cost`, `health-and-safety`,
`operational-impact`, `alternative-provided`, `insufficient-information`.

A decline with no rationale, or with no alternative where one is feasible, is the
principal driver of the legal-risk axis.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Response identification | responding manager / HR, originating request reference, response status, handling method, assessed & responded dates |
| 2 | Worker identification | employee reference, name, job title, department |
| 3 | Decision | overall decision, decision rationale, decline-reason category |
| 4 | Adjustments agreed | working environment, equipment, working arrangements, communication, support, recruitment, policy; agreed detail; alternatives offered |
| 5 | Trial & review | trial period + length, review scheduled + review date, effective date |
| 6 | Support & responsibilities | occupational health, Access to Work, support resources, responsibilities, point of contact |
| 7 | Sign-off | escalation, notes; computed four-axis grade, flags, recommendation |

## Compliance and risk flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **discrimination-risk** — adjustments declined for a worker likely covered by
  the Equality Act 2010 without adequate justification or alternatives;
  failure-to-make-reasonable-adjustments risk. Auto-escalates follow-up urgency.
- **undue-delay** — the response was issued long after the request; the duty is
  to act without unreasonable delay.
- **no-review-scheduled** — adjustments agreed but no review date set.
- **no-trial-defined** — trial adjustments without a defined trial period.
- **grievance-escalation** — the matter has been escalated (dispute, grievance,
  or appeal).
- **missing-rationale** — a decision (especially a decline) with no rationale.
- **incomplete-response** — mandatory response sections missing.
- **other** — any other concern.

## Output

- **HTML report preview** and downloadable **PDF** confirmation-and-review letter.
- **FHIR R5 Bundle** (Communication / Task + supporting resources) exportable for
  integration with occupational-health / HR systems.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## References

- ACAS — Reasonable adjustments for neurodiversity.
  <https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity>
- ACAS — Reasonable adjustments (guide and confirmation / review templates).
  <https://www.acas.org.uk/reasonable-adjustments>
- Equality Act 2010 — duty to make reasonable adjustments.
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- Gov.uk — Access to Work scheme.
  <https://www.gov.uk/access-to-work>
- Gov.uk — Reasonable adjustments for workers with disabilities or health
  conditions. <https://www.gov.uk/reasonable-adjustments-for-disabled-workers>

## Compliance

- Equality Act 2010 — duty to make reasonable adjustments for disabled workers.
- ACAS Code of Practice and reasonable-adjustments guidance.
- UK GDPR / Data Protection Act 2018 — neurodivergence details are special
  category (health) data; process with consent and a lawful basis.
- ISO/IEC/IEEE 26514:2022.

## Verify

```sh
bin/test-form neurodiversity-adjustment-response
```
