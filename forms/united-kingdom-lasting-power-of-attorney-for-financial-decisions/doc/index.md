# UK LPA for Financial Decisions — Reference Material

Reference documentation for the LP1F lasting power of attorney form. The
parent `../index.md` carries the design overview and the 15-step wizard
table; this directory carries the deeper legal, structural, and
procedural notes that support the validation engine and the front-end
help text.

## Contents

### [`lp1f-form-structure.md`](./lp1f-form-structure.md)

Field-by-field map of LP1F sections 1–15 and the LPC continuation
sheets 1–4. Every captured field is listed with its type, whether it is
required, its validation rule, and the cross-reference into the LP12
Guide (parts A1–A11, B1–B5, C, D). Used as the authoritative source for
the SQL schema, the TypeScript `Lpa` type, and the on-screen help
copy.

### [`mca-2005-framework.md`](./mca-2005-framework.md)

Mental Capacity Act 2005 legal background: the five statutory
principles (ss. 1–4), the two-stage test for capacity (s. 2 + s. 3),
how LPAs sit within Part 1 of the Act, the statutory eligibility
restrictions on attorneys / certificate providers / witnesses, and the
role of the Public Guardian and the Court of Protection. The framework
behind every "why" hint shown next to a fired rule.

### [`lpa-validation-rules.md`](./lpa-validation-rules.md)

The authoritative rule table for the validation engine. Lists every
statutory blocker and every additional flag with: rule name, plain-
English predicate, statutory or regulatory citation, priority, and the
remediation hint that should be rendered to the user. Blockers come
first (any one fires => `critical`); flag rules follow grouped by
priority (`high` > `moderate` > `low`).

### [`opg-registration-workflow.md`](./opg-registration-workflow.md)

What happens after the deed is signed: who can apply, the LP3 notice-
of-intention period, the four-week statutory waiting period, the
current £82 application fee, the LPA120A reduced-fee criteria, expected
OPG processing time, objection grounds, what happens when an LPA is
rejected, and the correction / appeal route. Includes the postal
address for the OPG (PO Box 16185, Birmingham B2 2WH).

### [`glossary.md`](./glossary.md)

Alphabetised glossary of LPA terms used by the form, the validator, and
the on-screen help: applicant, attorney, best interests, certificate
provider, continuation sheet, Court of Protection, deputyship, donor,
enduring power of attorney (EPA), jointly, jointly and severally, LPA,
MCA, mental capacity, OPG, people to notify, Public Guardian,
registration, replacement attorney, trust corporation, witness, and
related vocabulary.

## See also

- [`../index.md`](../index.md) — project overview and 15-step wizard
- [`../AGENTS.md`](../AGENTS.md) — engine shape and conventions
- [`../plan.md`](../plan.md) — build roadmap
- [`../tasks.md`](../tasks.md) — task tracking
- [`../20260420-LPA-Finance-Complete-Pack/`](../20260420-LPA-Finance-Complete-Pack/)
  — source PDFs (LP1F, LP12, LP3, LPC, LPA120A)
