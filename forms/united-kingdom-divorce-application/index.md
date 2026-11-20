# United Kingdom Divorce Application

A completeness and time-gate checker for applying for a **divorce** (or the
**dissolution of a civil partnership**) in England and Wales under the
no-fault regime of the Divorce, Dissolution and Separation Act 2020. It follows
a case through its three stages: the **application** (form D8 or online), the
**conditional order** (form D84, formerly the decree nisi) and the **final
order** (form D36, formerly the decree absolute), which is what ends the
marriage and produces the divorce paperwork.

The form is not a numeric score. Its engine is a **completeness and validity**
engine: it tests the time gate for the stage being checked, checks that the
required information and documents are present, tests the England and Wales
jurisdiction grounds, and classifies the application as **Ready to apply**,
**Incomplete**, or **Not eligible yet**. It then raises flagged issues for
jurisdiction, the marriage certificate and translation, the service address,
children arrangements and the financial order reminder.

It gives no legal advice. The court decides every application.

## Scope and intended users

- **Setting:** a person preparing their own application, a solicitor or legal
  adviser, or a court officer checking an application before it is sent.
- **Jurisdiction:** England and Wales only. Scotland and Northern Ireland have
  different processes.
- **In scope:** divorce and civil-partnership dissolution, sole or joint
  application, and the three stages above.
- **Out of scope:** judicial separation and nullity, financial remedy
  proceedings themselves, the content of children orders, and legal advice.

## Stage gates

| Stage | Form | Gate | Earliest date |
| --- | --- | --- | --- |
| Application | D8 or online | Married for at least one year | first anniversary of the marriage |
| Conditional order | D84 | 20 weeks (140 days) after the application is issued | issue date + 140 days |
| Final order | D36 | 6 weeks and 1 day (43 days) after the conditional order | conditional order date + 43 days |

A final order applied for more than 12 months after the conditional order needs
the delay explained to the court. Where no stage gate has been reached the
class is **Not eligible yet**, which takes precedence over completeness.

## Application classes

- **Ready to apply:** the gate is met and the required information is present.
- **Incomplete:** a required answer, a document (original marriage certificate
  or certified copy, certified translation, name-change proof), a usable
  service address, a jurisdiction ground, or a fee is missing or unmet.
- **Not eligible yet:** the time gate for the stage has not opened; the earliest
  date is reported.

## Flagged issues

Raised independently of the class: one-year rule, reflection period and
final-order wait (timing); relationship not recognized or breakdown not stated;
joint application despite domestic-abuse risk; jurisdiction not met; marriage
certificate missing; certified translation missing; service address unusable;
acknowledgement of service not returned; children arrangements not agreed;
financial order reminder (high at the final-order stage, because the final order
can remove financial claims); fee outstanding; name-change proof; final-order
delay of more than 12 months.

## Assessment steps

1. Application type and stage (divorce or dissolution, sole or joint, stage,
   date of the check, domestic-abuse risk)
2. Marriage and certificate (date, place, recognition, breakdown, certificate,
   translation, name change)
3. Jurisdiction (habitual residence and domicile)
4. The parties and service address
5. Children
6. Money, property and the fee
7. Progress and dates (issue date, acknowledgement, conditional order date)
8. Summary and readiness

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric and date fields.
- The check is deterministic: every time gate is tested against the date of the
  check (`asOfDate`), never the wall clock.
- camelCase in JavaScript and TypeScript, snake_case in SQL.

## Compliance

This is a documentation and completeness aid for an administrative legal
process, not a medical device. It inherits the monorepo baseline and gives no
legal advice.

## Legal and procedural references

See [`doc/index.md`](doc/index.md) for the cited rules: GOV.UK divorce guidance,
the Matrimonial Causes Act 1973 as amended by the Divorce, Dissolution and
Separation Act 2020, the Civil Partnership Act 2004, the Domicile and
Matrimonial Proceedings Act 1973 section 5, and the Family Procedure Rules 2010.

## Verify

```sh
bin/test-form united-kingdom-divorce-application
bin/test-personas united-kingdom-divorce-application
```
