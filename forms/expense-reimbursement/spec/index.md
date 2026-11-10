# Expense Reimbursement — spec

Living domain spec. Update this before changing code.

## Purpose

A worker who spent their own money on a work-related expense asks to be repaid.
The form captures the claim and its line items, grades it against employer
policy, and routes it to the right approver.

## Policy defaults (configurable per employer)

| Rule ID | Axis | Fires when |
| --- | --- | --- |
| R-COMP-RECEIPT-01 | compliance | a line over £10 has no receipt and no missing-receipt reason |
| R-COMP-STALE-01 | compliance | a line's expense date is more than 90 days before the claim date |
| R-COMP-PERSONAL-01 | compliance | a line is alcohol or a personal item (never reimbursable) |
| R-COMP-APPROVAL-01 | compliance | a line over £50 lacks prior approval |
| R-COMP-WORK-01 | compliance | the "wholly for work" declaration is not ticked |
| R-COMPL-FIELDS-01 | completeness | a mandatory field is empty |
| R-APPR-LINE-01 | approval | total ≤ £100 → line manager |
| R-APPR-BUDGET-01 | approval | £100 < total ≤ £500 → budget holder |
| R-APPR-FINANCE-01 | approval | total > £500 or any high-priority flag → finance review |

Flag categories: see `sql/08_create_table_expense_reimbursement_grade_flag.sql`.

## Open questions

- Mileage rate: default to HMRC 45p/mile for the first 10,000 miles; confirm.
- Multi-currency: line amounts convert to the claim currency using
  `exchange_rate_to_claim_currency`; who supplies the rate?
