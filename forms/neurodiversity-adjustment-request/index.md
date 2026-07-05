# Neurodiversity Adjustment Request

A UK–aligned **workplace reasonable-adjustments request for neurodiversity**
that a worker (or a manager on their behalf) completes to ask their employer for
adjustments at work. It records the worker's neurodivergent profile (conditions,
diagnosis status, whether they consider it a disability, and consent to share
details), the functional difficulties they experience mapped to the ACAS
functional areas, the specific adjustments requested across the ACAS adjustment
categories, any supporting evidence, and the current impact and urgency — then
computes a **four-axis grade** (Equality Act 2010 eligibility, impact / wellbeing
risk, request completeness, and handling priority) plus a set of
compliance-and-wellbeing flags. The output is a structured request that supports
the employer's duty to consider and make reasonable adjustments without
unreasonable delay.

This form is the **request** half of the request/response pair: where this form
captures *what a neurodivergent worker needs and why*, the sibling
[`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response)
form records the employer's decision, written confirmation, and review
arrangements. It is aligned with the ACAS guidance on
[reasonable adjustments for neurodiversity](https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity)
and the [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents)
duty to make reasonable adjustments.

> **Note on terminology.** This form uses the UK term *reasonable adjustments*
> (Equality Act 2010 / ACAS). The equivalent US term is *accommodation*.

## Scope and intended users

- **Setting:** any workplace — office, remote / hybrid, field, shift, or during a
  recruitment / assessment process.
- **Users:** neurodivergent workers, their line managers, HR advisers,
  diversity leads, and occupational-health practitioners who raise or support a
  request for adjustments.
- **Subjects:** workers who are, or identify as, neurodivergent (ADHD, autism,
  dyslexia, dyspraxia, dyscalculia, Tourette's, and others). A formal diagnosis
  is **not** required for the Equality Act duty to apply.

## Scoring system

The engine grades each request on **four independent axes**, each anchored to a
recognised source. Axes are orthogonal: a request can strongly engage the
Equality Act duty yet still be incomplete, and a low-eligibility request can
still be urgent on wellbeing grounds.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Eligibility** | Equality Act 2010 disability test (substantial + long-term adverse effect) applied to the neurodivergent profile | likely-covered / possibly-covered / unclear |
| **B. Impact / wellbeing** | Impact and absence-risk escalation rules | ok / caution / high-risk |
| **C. Completeness** | Mandatory-field checklist (conditions, difficulties, requested adjustments, tasks affected, consent) | 0–100 % complete (+ missing fields) |
| **D. Priority** | Impact and absence-risk escalation rules | routine / soon / urgent (+ target timeframe) |

A worker **at risk of sickness absence or burnout**, or reporting **severe**
current impact, drives the impact axis and **auto-escalates** the priority tier.
Choose the least-urgent band only when no rule fires.

### ACAS functional areas → requested adjustments

| Functional difficulty | Typical adjustment category | Example adjustments (ACAS) |
| --- | --- | --- |
| Concentration / focus | Working environment; equipment | Quiet workspace, noise-cancelling headphones / ear defenders, fidget toys, standing desk, regular breaks |
| Reading / written communication | Equipment / technology; communication | Screen reader, speech-to-text software, instructions broken into clear steps, coloured document backgrounds |
| Organisation / time management | Communication; support | Visual planners with deadlines, regular check-ins, work broken into smaller tasks |
| Sensory overload | Working environment; policy | Private / quiet space, noise-cancelling headphones, screen filters, softer-material uniform / dress-code change |
| Balance / coordination | Equipment; working environment | Specialist keyboard / mouse, clutter-free organised workspace, clear directional signage |
| Fatigue / burnout | Working arrangements | Flexible hours, planned breaks, phased return, remote / hybrid working |

## Wizard steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Worker & role | name, job title, department, employment type, work pattern & location, start date |
| 2 | Handler | manager / HR contact name, role, contact; who is making the request |
| 3 | Neurodivergent profile | conditions, diagnosis status, considers-disability, substantial + long-term impact, disclosure consent |
| 4 | Functional difficulties | concentration, written communication, organisation/time, sensory overload, balance/coordination, social communication, memory, burnout; tasks & situations affected; strengths |
| 5 | Requested adjustments | working environment, equipment / technology, working arrangements, communication, support / mentoring, recruitment process, policy / dress; free-text detail |
| 6 | Evidence & support | supporting-evidence type, occupational health, Access to Work |
| 7 | Impact & urgency | current impact, at-risk-of-absence, requested urgency |
| 8 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Compliance and wellbeing flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **disability-duty-engaged** — the Equality Act 2010 duty to make reasonable
  adjustments is likely engaged; handle as a formal request.
- **burnout-risk** — the worker is at risk of sickness absence or burnout without
  adjustments; act promptly.
- **no-consent-to-share** — the worker has not consented to share details with HR
  / occupational health; handle sensitively and seek consent.
- **missing-adjustments** — no specific adjustments have been requested.
- **missing-difficulties** — no functional difficulties have been identified.
- **access-to-work-recommended** — signpost the worker to the government Access
  to Work scheme.
- **occupational-health-recommended** — consider an occupational-health referral
  to identify or confirm adjustments.
- **other** — any other concern.

## Output

- **HTML report preview** and downloadable **PDF** request.
- **FHIR R5 Bundle** (ServiceRequest + supporting resources) exportable for
  integration with occupational-health / HR systems.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## References

- ACAS — Reasonable adjustments for neurodiversity.
  <https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity>
- ACAS — Reasonable adjustments (guide and request / confirmation / review
  templates). <https://www.acas.org.uk/reasonable-adjustments>
- Equality Act 2010 — duty to make reasonable adjustments.
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- Gov.uk — Access to Work scheme.
  <https://www.gov.uk/access-to-work>
- Gov.uk — Definition of disability under the Equality Act 2010.
  <https://www.gov.uk/definition-of-disability-under-equality-act-2010>

## Compliance

- Equality Act 2010 — duty to make reasonable adjustments for disabled workers.
- ACAS Code of Practice and reasonable-adjustments guidance.
- UK GDPR / Data Protection Act 2018 — neurodivergence details are special
  category (health) data; process with consent and a lawful basis.
- ISO/IEC/IEEE 26514:2022.

## Verify

```sh
bin/test-form neurodiversity-adjustment-request
```
