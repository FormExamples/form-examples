# United Kingdom Birth Registration

Prepare to register a birth in England and Wales (GOV.UK "Register a birth")
and order the birth certificate from the General Register Office (GRO). The form
is a single continuous single-page wizard that collects the child, the mother,
the second parent and the basis for recording them, the informant and identity
evidence, and the certificate order. Its engine is a **completeness and
validity** engine, not a clinical score: it classifies the application as
**ready to submit**, **incomplete**, **needs additional evidence**, or **out of
scope**, and raises flagged issues for the statutory deadline, the informant,
the unmarried-father rules, and the required evidence.

## Scope and intended users

Parents, and the other qualified informants, preparing to attend a register
office; and registrars or applicant-support staff reviewing applications on the
dashboard. The tool never registers a birth: the registrar checks the evidence
and makes the entry in the register, which remains the legal record. A
stillbirth, and a birth in Scotland, Northern Ireland or abroad, are
**out of scope** because they are registered under different rules.

## Sections and readiness model

| Class | Meaning |
| --- | --- |
| `out-of-scope` | A stillbirth, or a birth outside England and Wales. Takes precedence. |
| `incomplete` | A required item is missing, or the dates are inconsistent. |
| `needs-additional-evidence` | Complete, but the informant is not qualified, the second parent has no valid basis or document, the identity evidence is insufficient, or registration is more than 12 months after the birth. |
| `ready-to-submit` | Complete, consistent, and supported by the evidence GOV.UK asks for. |

The grader also reports the whole days from birth to registration, whether that
is after the **42-day** statutory period, and the count of missing items. A late
registration of 43 to 365 days is flagged but does not by itself block
`ready-to-submit`.

## Assessment steps

| Step | Section | Content |
| --- | --- | --- |
| 1 | The child | Names, sex, date and time of birth, place and country of birth, single or multiple birth, stillbirth |
| 2 | The mother | Name, maiden surname, date and place of birth, occupation, address |
| 3 | Parentage | Parents' relationship, marriage date, second parent, basis, document in hand, licensed-clinic treatment |
| 4 | Informant | Informant, whether the parents are unable to register, registration route and date, identity documents, red book |
| 5 | Certificate order | Number, service level, delivery address, payment, note |
| 6 | Summary | Live readiness class, days since birth, missing-item count |

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric, date and time fields.
- camelCase in JavaScript and TypeScript; snake_case in SQL.
- One continuous single-page wizard; no multi-page form.

## Compliance

This is an administrative completeness check and is **not legal advice**. See
[`spec/index.md`](./spec/index.md) section 9 for the regulatory position and
[`doc/index.md`](./doc/index.md) for the rule-by-rule source mapping.

## Statutory references

- [GOV.UK: Register a birth](https://www.gov.uk/register-birth) — the 42-day period in England, Wales and Northern Ireland; where to register (local register office, or the hospital); the information the registrar asks for; what to bring (red book, proof of identity, proof of paternity if attending alone).
- [GOV.UK: Who can register a birth](https://www.gov.uk/register-birth/who-can-register-a-birth) — parents register; married or civil-partner parents (either may register alone); unmarried parents (register together, signed statutory declaration of parentage, or a court document giving parental responsibility); same-sex female couples; same-sex male couples (parental order); other qualified informants (someone present at the birth, someone responsible for the child, hospital administrative staff) when the parents cannot.
- [GOV.UK: Proving your identity (register a birth)](https://www.gov.uk/register-birth/proving-your-identity) — one accepted original document (passport, photocard driving licence, UK birth or adoption certificate, biometric immigration document, travel documents, EU identity card, proof-of-age card) or two from the secondary list (utility bill but not a mobile phone bill, council tax, bank statement, benefit or tax letter, P45 or P60, marriage certificate, NHS or HMRC letter, and others).
- [GOV.UK: Order a copy of a birth, death, marriage or civil partnership certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate) — General Register Office (GRO) orders for England and Wales: 12.50 pounds a standard certificate, 38.50 pounds for the priority service (next working day when ordered by 4pm), an extra 3.50 pounds a search without a GRO index reference, card payment.
- [GOV.UK: Register a birth abroad](https://www.gov.uk/register-birth-abroad) — a birth outside the UK is registered under that country's rules; optional UK registration.
- Births and Deaths Registration Act 1953 and the Registration of Births and Deaths Regulations 1987 — the statutory basis for the 42-day period, qualified informants, and the register entry. Section numbers are deliberately not cited here; check the Acts on legislation.gov.uk before relying on a specific provision.
- *Human Fertilisation and Embryology Act 2008* — the legal parenthood rules for a female second parent and for parental orders.

## Verify

```sh
bin/test-form united-kingdom-birth-registration
```
