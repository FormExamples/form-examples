# UK Self-Certification (SC2) — Scope Boundary

The UK form **SC2** is an employee self-certification for sickness
absence of up to seven calendar days (including weekends, bank
holidays, and non-working days). It is completed by the employee
without medical involvement.

**Return to Work is out of scope for SC2.** This form is *only*
issued by a clinician. The relationship is:

```
day 1 ── absence starts ─────────────────────────────────────────────────►
        │                       │                       │
        │ ◄─── SC2 covers ───►  │ ◄── Med 3 / RTW form covers ─►
        │   employee self-cert  │   clinician statement
        │   (up to 7 days)      │   (no upper limit, reviewed)
```

## Decision rule

A new Return to Work record is *not* required when:

- The absence is ≤ 7 calendar days and the employer accepts an SC2.
- The employee has already self-certified and is returning to full
  duties on day 8 or earlier.

A new Return to Work record **is** required when:

- The absence has lasted 8 calendar days or more.
- The employer's policy requires a medical clearance letter
  regardless of length (some safety-critical industries — aviation,
  rail, healthcare, lifeguarding, emergency response).
- The employee is returning to **modified** duties (any
  "may be fit for work" pathway).
- The patient holds a **safety-critical role** and the diagnosis
  could plausibly impair fitness for that role.

## Cross-reference field

When an SC2 has been filed before a Med 3, the Return to Work record
stores the SC2 reference in `return_to_work.prior_self_certification_reference`.
A future enhancement may import the SC2 directly from an employer
HR system.

## See also

- HMRC. *Statutory Sick Pay (SSP) — Form SC2.*
  <https://www.gov.uk/government/publications/statutory-sick-pay-employees-statement-of-sickness-sc2>
