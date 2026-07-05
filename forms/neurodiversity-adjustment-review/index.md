# Neurodiversity Adjustment Review

A UK–aligned **workplace reasonable-adjustments review for neurodiversity** that
a manager or HR contact completes with the worker to check whether the agreed
adjustments are still working. It is the **third form in the ACAS cycle** —
after the [`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request)
(what the worker needs) and the
[`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response)
(what the employer agreed), this form records *how the agreed adjustments are
working in practice and what should change*. It captures the per-category
effectiveness of the adjustments in place, the worker's feedback and outcomes,
any changes arising, and the next review date — then computes a **four-axis
grade** (overall effectiveness, wellbeing risk, review completeness, and
next-step urgency) plus a set of review flags including an automatic
**adjustments-not-working alert**. The output is a structured review record.

This form follows the ACAS *reasonable-adjustments review* template and the
Equality Act 2010 principle that adjustments are not a one-off event: employers
and workers should try adjustments and **review them regularly** to make sure
they remain effective as work, roles, and needs change.

> **Note on terminology.** This form uses the UK term *reasonable adjustments*
> (Equality Act 2010 / ACAS). The equivalent US term is *accommodation*.

## Scope and intended users

- **Setting:** any workplace where adjustments have been agreed and are due a
  review.
- **Users:** line managers, HR advisers, diversity leads, and occupational-health
  practitioners who review adjustments with a worker.
- **Subjects:** any worker with agreed neurodiversity-related adjustments.

## Review semantics (not a request or a response)

A **request** asks *what does this worker need?*; a **response** records *what did
the employer agree?*; a **review** asks *are the agreed adjustments still working,
and what should change?*. Accordingly the source-of-truth table here is
`neurodiversity_adjustment_review`, the person completing it is the reviewer, and
the grade engine interprets effectiveness and outcomes rather than eligibility or
a decision.

## Interpretation grading

The engine grades each review on **four independent axes**. Axes are orthogonal:
adjustments can be broadly effective yet leave a dissatisfied worker, or be
complete yet reveal a failing adjustment that needs urgent action.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Effectiveness** | Per-category effectiveness mix | effective / partially-effective / ineffective / not-yet-assessed |
| **B. Wellbeing risk** | Worker satisfaction, wellbeing change, barriers, escalation | ok / caution / high-risk |
| **C. Completeness** | Mandatory-field checklist (effectiveness, worker feedback, satisfaction, next review) | 0–100 % complete |
| **D. Next-step urgency** | Failing-adjustment / escalation rules | none / review-scheduled / adjust-now / escalate (+ target timeframe) |

Any adjustment reported as **not-working**, a **dissatisfied** worker, **declining
wellbeing**, or an **escalation** drives the wellbeing-risk axis and the next-step
urgency, and raises the corresponding flag, regardless of the other axes.

### Per-category effectiveness

Each ACAS adjustment category in place is rated `working-well`, `partial`,
`not-working`, or `not-in-place`:

working environment · equipment / technology · working arrangements ·
communication · support / mentoring · recruitment process · policy / dress ·
other.

## Wizard steps

Completed in order on a single continuous single-page wizard (~6 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Review identification | reviewer, originating response reference, review status, method, review & next-review dates |
| 2 | Worker identification | employee reference, name, job title, department |
| 3 | Effectiveness | per-category effectiveness of the adjustments in place |
| 4 | Worker experience | worker feedback, satisfaction, wellbeing change, remaining barriers |
| 5 | Changes & next steps | changes needed + detail, updated adjustments, occupational-health re-referral, next review date |
| 6 | Sign-off | escalation, notes; computed four-axis grade, flags, recommendation |

## Review flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **adjustments-not-working** — an agreed adjustment is no longer working;
  act promptly. Drives next-step urgency.
- **worker-dissatisfied** — the worker is not satisfied the adjustments meet
  their needs.
- **wellbeing-declined** — the worker's wellbeing has worsened since the
  adjustments were put in place.
- **changes-outstanding** — changes are needed but not yet detailed / actioned.
- **no-next-review** — no next review date has been set.
- **escalation** — the matter has been escalated.
- **incomplete-review** — mandatory review sections missing.
- **other** — any other concern.

## Output

- **HTML report preview** and downloadable **PDF** review record.
- **FHIR R5 Bundle** exportable for integration with occupational-health / HR
  systems.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## References

- ACAS — Reasonable adjustments for neurodiversity.
  <https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity>
- ACAS — Reasonable adjustments (guide and request / confirmation / review
  templates). <https://www.acas.org.uk/reasonable-adjustments>
- Equality Act 2010 — duty to make reasonable adjustments.
  <https://www.legislation.gov.uk/ukpga/2010/15/contents>
- Gov.uk — Access to Work scheme. <https://www.gov.uk/access-to-work>

## Compliance

- Equality Act 2010 — duty to make reasonable adjustments for disabled workers.
- ACAS Code of Practice and reasonable-adjustments guidance.
- UK GDPR / Data Protection Act 2018 — neurodivergence details are special
  category (health) data; process with consent and a lawful basis.
- ISO/IEC/IEEE 26514:2022.

## Verify

```sh
bin/test-form neurodiversity-adjustment-review
```
