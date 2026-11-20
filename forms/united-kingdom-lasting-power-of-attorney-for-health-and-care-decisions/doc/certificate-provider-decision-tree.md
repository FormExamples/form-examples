# Certificate Provider Eligibility — Decision Tree

Source: **Lasting Powers of Attorney, Enduring Powers of Attorney and
Public Guardian Regulations 2007** (SI 2007/1253) Schedule 1 Part 2.

A certificate provider certifies that the donor understands the LPA and
is not under undue pressure. Without a valid certificate provider, the
LPA cannot be registered.

## The eligibility flow

```
Q1. Is the candidate a family member of the donor or any attorney?
    (Spouse, civil partner, child, parent, sibling, in-law, step-relative, cohabitee.)
    → YES → INELIGIBLE  (R-MCA-CP-FAM)
    → NO  → Q2

Q2. Is the candidate a business partner or employee of the donor
    or any attorney?
    → YES → INELIGIBLE  (R-MCA-CP-EMP)
    → NO  → Q3

Q3. Is the candidate themselves an attorney named in this LPA?
    → YES → INELIGIBLE  (R-MCA-CP-ATT)
    → NO  → Q4

Q4. Choose the route.

  Route A — skill-based:
    Is the candidate currently registered in one of the following
    professions?
      • Solicitor or barrister (SRA / BSB)
      • Medical practitioner (GMC) — including GP and consultant
      • Registered Nurse (NMC)
      • Registered Social Worker (Social Work England / Care Council Wales)
      • Independent Mental Capacity Advocate (IMCA)
      • Registered Psychologist (HCPC)
      • Other registered healthcare professional (HCPC)
    → YES → ELIGIBLE via Route A
    → NO  → Route B

  Route B — knowledge-based:
    Has the candidate known the donor personally for ≥ 2 years?
    → YES → ELIGIBLE via Route B  (R-MCA-CP-ROUTE)
    → NO  → INELIGIBLE
```

## Choosing between routes

The Office of the Public Guardian's LP12 practice note recommends the
skill-based route where a professional relationship exists (solicitor,
GP) and the knowledge-based route otherwise. The knowledge-based route
requires the certificate provider to make a *substantive* judgement that
the donor understands the LPA; it should not be selected casually.

## Field captured

| Field | When required | Encodes |
| --- | --- | --- |
| `certificate_provider.route` | always | `skill-based` or `knowledge-based` |
| `certificate_provider.profession` | route = skill-based | profession code |
| `certificate_provider.profession_registration_number` | route = skill-based | SRA / GMC / NMC / HCPC number |
| `certificate_provider.years_known_donor` | route = knowledge-based | numeric, must be ≥ 2 |
| `certificate_provider.declared_not_family` | always | self-declaration |
| `certificate_provider.declared_not_employee` | always | self-declaration |
| `certificate_provider.declared_not_attorney` | always | self-declaration |

## What the validity engine does

- `R-MCA-CP-PRESENT` — fatal if no certificate provider linked to the LPA.
- `R-MCA-CP-FAM`, `R-MCA-CP-EMP`, `R-MCA-CP-ATT` — fatal if any
  self-declaration is `'no'`.
- `R-MCA-CP-ROUTE` — fatal if route is not satisfied.
- `R-MCA-CP-REGISTRATION` — high (correctable) if a skill-based route
  has no registration number recorded.

## Common pitfalls

- **The GP who is also a friend** — must choose one route. If the friend
  relationship pre-dates the professional one and the GP intends to act
  in a personal capacity, knowledge-based is the safer choice.
- **A solicitor who drafted the LPA** — eligible *unless* their firm
  derives a fee from being named as an attorney (then `R-MCA-CP-EMP`
  fires).
- **"Known personally" vs. "known professionally"** — knowledge-based
  requires a personal relationship of ≥ 2 years. A GP who has been the
  donor's GP for 5 years but does not know them outside the surgery
  should use the skill-based route.
- **Family-by-marriage** — in-laws and step-relatives count as family
  for the purposes of `R-MCA-CP-FAM`.

## Audit

When a certificate provider self-declares ineligibility (any of the
`declared_not_*` columns set to `'no'`), the LPA is invalidated and the
case-manager dashboard surfaces the row. The OPG also retains the right
to reject an LPA on certificate-provider grounds even after submission.
