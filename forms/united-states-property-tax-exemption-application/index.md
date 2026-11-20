# United States Property Tax Exemption Application

A county or state application for a **residential property tax homestead
exemption** and related relief: senior, disability, disabled-veteran and
circuit-breaker relief, plus assessment-appeal basics. The applicant gives the
parcel number, ownership and occupancy as of the assessment date, the exemptions
claimed, household income, the proof documents, the filing date and a signed
declaration under penalty for a false statement.

The form is not a numeric score. Its engine is a **completeness and
eligibility** engine: it classifies the application as **Likely eligible**,
**Incomplete** or **Likely ineligible** and raises prioritized flags. Rules vary by
state, so the engine takes a two-letter `state` and encodes a `STATE_RULES` table
(CA, NY, TX, FL, IL, PA, OH, WA) with the filing deadline, senior age, income
limit and exemption amounts verified from official sources; any other state uses
a default rule and raises a "verify state rule" flag.

## Steps

1. **Applicant** - name, date of birth, age on the assessment date, mailing address.
2. **Property and occupancy** - state, county, parcel number, address, how title is held, owner and occupant on the assessment date, no second homestead.
3. **Exemptions claimed** - homestead, senior, disability, disabled veteran (with VA rating), circuit-breaker.
4. **Household income** - for the income-tested relief.
5. **Proof documents** - ownership, residency, age, income, disability.
6. **Filing and deadline** - assessment year, filing date, initial / renewal / late.
7. **Assessment appeal basics** - whether you want appeal guidance, notice-of-value date.
8. **Declaration** - penalty acknowledged, signed, date.
9. **Summary** - live class, deadline and late indication; submit for the report.

## Classes

| Class | Meaning |
| --- | --- |
| Likely eligible | complete, signed, on time, every encoded test passes |
| Incomplete | something is missing: identifiers, answers, a claim, proof, signature |
| Likely ineligible | a base requirement fails, the filing is late, or every claim fails its test |

## Disclaimer

Documentation support, not legal or tax advice. The county assessor or state
agency decides; state rules and figures change, so confirm them with the
assessor. A knowingly false statement can lead to back taxes, penalties and
prosecution.

See [`spec/index.md`](spec/index.md) for the behavior contract and
[`doc/index.md`](doc/index.md) for sources.
