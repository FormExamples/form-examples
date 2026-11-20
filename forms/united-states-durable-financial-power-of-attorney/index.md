# United States Durable Financial Power of Attorney

A United States **execution-readiness** checker for a durable power of attorney
for property and finances. A principal appoints an agent (and successors) to
manage money, real estate, investments, benefits, and taxes, and the authority
survives the principal's later incapacity. Law here is **state-variable**: the
[Uniform Power of Attorney Act (2006)](doc/upoaa-framework.md) (UPOAA) is the
baseline, and a `STATE_RULES` table encodes the execution formalities of
California, New York, Texas, Florida, Illinois, Pennsylvania, Ohio, and
Washington. Any other state falls back to the uniform default and raises a
"verify the state rule" flag.

The engine is a **completeness / validity / eligibility** engine, not a
clinical score. It classifies the filled form into one of three classes and
raises prioritized flagged issues.

> Documentation support, not legal advice. The statute of the governing state,
> the notary, and a court decide whether an instrument is valid. Have a lawyer
> licensed in the state review the final document.

## Scope and intended users

Principals, family caregivers, elder-law paralegals, and financial-institution
onboarding staff preparing a durable financial POA before signing. Companion to
the UK analogue
[`united-kingdom-lasting-power-of-attorney-for-financial-decisions`](../united-kingdom-lasting-power-of-attorney-for-financial-decisions/index.md)
(Mental Capacity Act 2005, OPG registration); the US instrument is not
registered with any agency and takes effect by signing.

Out of scope: health-care proxies and living wills, guardianship and
conservatorship petitions, trusts, and the contents of IRS Form 2848 itself.

## Validity classes

| Class | Meaning |
| --- | --- |
| `ready-to-execute` | Core facts are present and no execution defect is detected against the governing state's rule. Signing may proceed (flags may still advise). |
| `incomplete` | A core item is unanswered (principal, state, agent, effectiveness, durability, capacity, notary plan, or any granted authority). Execution defects are not judged until it is complete. |
| `execution-risk` | An answered item contradicts the governing state's formalities or the Act: missing notarization or witnesses, an agent as witness, a springing power in Florida, hot powers without Florida initials, no durability language, capacity unconfirmed, an ineligible agent, or real-estate use without acknowledgment. Takes precedence over `incomplete`. |

## Sections

| Step | Section | Captures |
| --- | --- | --- |
| 1 | Principal | name, birth date, governing state, address, capacity |
| 2 | Instrument | durability language, immediate vs springing effectiveness, trigger, statutory notices |
| 3 | Agents | agent, eligibility, relationship, successor, co-agents, compensation |
| 4 | Authority | general grants (banking through tax) and the "hot powers" needing an express grant, gift limits, initials |
| 5 | Execution | notary and witness plan |
| 6 | Acceptance and use | real-estate recording, bank forms, IRS Form 2848 |
| 7 | Summary | live class and governing state rule; report |

## State rules (summary)

See [`doc/state-rules.md`](doc/state-rules.md) for citations and confidence.

| State | Notary | Witnesses | Springing | Notes |
| --- | --- | --- | --- | --- |
| CA | notary or witnesses | 2 if no notary | allowed | Prob. Code 4121, 4264 hot powers |
| NY | required | 2 (notary may be one) | allowed | agent signature acknowledged; GOL 5-1501B |
| TX | required | none | allowed | express durability statement |
| FL | required | 2 | prohibited | initial each hot power (709.2202) |
| IL | required | 1 (not the notary) | allowed | |
| PA | required | 2 (not the notary) | allowed | agent acknowledgment before acting |
| OH | recommended | none | allowed | UPOAA; acknowledgment needed for real estate |
| WA | required | none | allowed | UPOAA |

## Conventions

`''` for unanswered text and enum fields; `null` for unanswered numeric and date
fields. camelCase in JS and TS, snake_case in SQL.

## Compliance

Administrative documentation aid; not a medical device. See the repository
baseline in [`/AGENTS.md`](../../AGENTS.md).

## References

- Uniform Law Commission, *Uniform Power of Attorney Act (2006)*.
- Statutes and IRS sources listed in [`doc/state-rules.md`](doc/state-rules.md) and [`doc/irs-form-2848.md`](doc/irs-form-2848.md).

## Verify

```sh
bin/test-form united-states-durable-financial-power-of-attorney
```
