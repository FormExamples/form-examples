# Mental Capacity Act 2005 — section mapping

How each statutory section of the **Mental Capacity Act 2005** (E&W) is
realized in this form's schema, validity engine, and UI.

## Sections in scope

| MCA 2005 section | What it covers | Realized in |
| --- | --- | --- |
| s.1 — Principles | the five MCA principles | `doc/safety-case-notes.md` for context; not directly encoded |
| s.2 — People who lack capacity | definition of capacity | non-rule flag `donor-capacity-concern` |
| s.3 — Inability to make decisions | the test for incapacity | informational; outside this form's automated scope |
| s.4 — Best interests | attorneys must act in best interests | guidance text on Steps 7 and 8 of the wizard |
| **s.9** — Lasting powers of attorney | creation of an LPA | `donor` table; `lpa` table; rules `R-MCA-S9-AGE`, `R-MCA-S10-CAP`, `R-MCA-INSTR-LAW` |
| **s.10** — Appointment of donees | attorneys / replacements | `attorney`, `replacement_attorney` tables; rules `R-MCA-ATT-AGE`, `R-MCA-ATT-CAP`, `R-MCA-ATT-DISTINCT`, `R-MCA-REPL-AGE` |
| **s.11** — Restrictions on personal welfare LPAs | only operative once donor lacks capacity; LST requires explicit opt-in | `lpa_lst_choice` table; rule `R-MCA-LST-CHOICE` |
| s.12 — Scope of LPAs — gifts | restrictions on gifts | n/a for H&W LPAs |
| **s.13** — Revocation | revocation of LPA on bankruptcy etc. | `lpa.status` enum value `revoked` |
| **s.14** — Protection of donee and others | protection of attorney acting in good faith | guidance only; not encoded |
| **s.22** — Powers of court | court power to determine validity | informational |
| **s.23** — Powers of court — operation | court power to direct attorneys | informational |
| **s.24–26** — Advance decisions | ADRT statutory basis; LPA interaction | rule `R-MCA-INSTR-ADRT`; non-rule flag `adrt-conflict` |
| s.40–43 — Independent Mental Capacity Advocate (IMCA) | IMCA scope | certificate-provider eligibility (IMCA is a valid skill-based route) |

## Schedule 1 — Lasting Powers of Attorney: Formalities

Schedule 1 of the MCA 2005, together with the **Lasting Powers of Attorney,
Enduring Powers of Attorney and Public Guardian Regulations 2007** (SI
2007/1253) as amended, prescribes:

- the LP1H form content
- the prescribed information that must accompany the donor's signature
- the certificate-provider eligibility criteria
- the statutory sign-order: donor → certificate provider → attorneys

These statutory formalities map to:

- `lpa.form_version` — version of the LP1H template
- `lpa_signature` table — signatures and sign-order enforcement
- `certificate_provider` table — eligibility data and self-declarations
- rules `R-MCA-CP-*`, `R-MCA-ORDER-*`, `R-MCA-WIT-*`

## What this form does NOT encode

- **Capacity assessments under MCA s.2** — the form *flags* a capacity
  concern but does not run a structured capacity assessment. A separate
  *Capacity Assessment* form is a future enhancement.
- **Court of Protection proceedings** — the form does not draft
  applications under Court of Protection Rules 2017.
- **Property and Financial Affairs LPAs** (LP1F) — that is a separate
  statutory instrument with a separate form and different rules
  (bankruptcy bar applies, can be used before loss of capacity, etc.).
- **Enduring Powers of Attorney** — pre-2007 instruments still in force
  but not creatable.

## Cross-reference: Code of Practice

The **Mental Capacity Act 2005 Code of Practice** (2007, draft revision
2022) supplements the statute. The form's user-facing helper text quotes
the Code where it clarifies a rule:

- Chapter 4 — Best interests
- Chapter 7 — Lasting powers of attorney
- Chapter 9 — Advance decisions to refuse treatment
- Chapter 10 — Independent Mental Capacity Advocates
