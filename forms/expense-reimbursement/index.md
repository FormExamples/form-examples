# Expense Reimbursement

A **workplace expense reimbursement claim** that a worker (for example a
clinician) completes after spending their own money on a work-related expense
and wanting to be repaid. It records who is claiming and who approves, each
expense line (date, category, merchant, amount, VAT, how it was paid, receipt),
the business purpose, how the worker wants to be repaid, and the worker's
declarations — then computes a **three-axis grade** (policy compliance, claim
completeness, and the approval tier the claim needs) plus a set of
fraud-prevention and policy flags. The output is a structured claim that an
approver can accept, query, escalate or reject.

This is an administrative form, not a clinical assessment: the person is a
**worker** (not a patient) and the handler is a **manager** or finance contact
(not a clinician). It covers expenses a worker pays personally — for example a
train ticket to a training course, a stethoscope, a professional registration
fee, or a taxi home after a late shift — not expenses the employer pays directly.

## Scope and intended users

- **Setting:** any employer, with clinical staff as the motivating case (travel
  between sites, equipment, registration and licensing fees, courses, uniform).
- **Users:** workers who paid out of pocket, their line managers or budget
  holders, and finance staff who process repayment.
- **Not covered:** employer-paid expenses (corporate card, purchase order),
  payroll tax treatment, and tax advice.

## Scoring system

The engine grades each claim on **three independent axes**. The thresholds below
are configurable defaults, not law; each employer's policy governs.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Policy compliance** | Per-line rules: receipt present, expense not stale, within category limit, wholly for work, prior approval where required | compliant / needs-review / likely-ineligible |
| **B. Completeness** | Mandatory-field checklist (period, purpose, every line's date/category/amount, repayment method, declarations) | 0–100 % complete (+ missing fields) |
| **C. Approval tier** | Claim total and flagged lines | line-manager / budget-holder / finance-review |

Default policy thresholds (see `spec/index.md`): receipts required for every line
over £10; claims should be submitted within 90 days of the expense; totals up to
£100 go to the line manager, up to £500 to the budget holder, above that to
finance; alcohol and personal items are never reimbursable.

A **recommendation** follows from the axes: approve, request more information,
escalate, or reject.

## Flags

Independent of the axes, the engine raises flags such as `missing-receipt`,
`duplicate-suspected` (same date, merchant and amount on two lines),
`over-limit`, `stale-expense`, `no-prior-approval`, `no-declaration`,
`foreign-currency` and `alcohol-or-personal`, each with a priority and a
suggested action.

## Data model

`sql/` is the source of truth: `worker`, `manager`, `expense_reimbursement` (the
claim), `expense_reimbursement_item` (one row per receipt) and the
`expense_reimbursement_grade` / `_grade_rule` / `_grade_flag` triad.

## References

- [HMRC — Expenses and benefits for employers](https://www.gov.uk/guidance/expenses-and-benefits-a-guide)
- [HMRC — Approved mileage allowance payments](https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax-free-mileage-allowances)
