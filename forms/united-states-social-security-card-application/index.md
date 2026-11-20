# United States Social Security Card Application (Form SS-5)

A single-page, step-by-step questionnaire for Form SS-5, the application for an
original, replacement, or corrected Social Security card. It checks the form and
the evidence the applicant plans to bring against the Social Security
Administration (SSA) rules, classifies the application as **Ready to submit**,
**Incomplete**, **Evidence missing**, or **Not eligible**, and raises prioritized
flagged issues. It is documentation support, not legal advice, and SSA decides
every application. The Social Security number is never collected.

## Scope and intended users

Applicants, parents and guardians, and the preparers who help them (schools,
shelters, caseworkers). The rules are federal, so a state-of-residence field is
kept for the record only.

## Classification model

| Class | Meaning |
| --- | --- |
| Ready to submit | Required items are present and the evidence matches the SS-5 rules |
| Incomplete | Required form items are blank, the route is wrong for the age, or a parent or guardian must sign |
| Evidence missing | The form is complete but identity, age, citizenship or status, or name-change evidence is missing, expired, or not original |
| Not eligible | The person has died, or a replacement limit (3 per calendar year, 10 per lifetime) is reached with no supported exception |

Not eligible takes precedence, then incomplete, then evidence missing.

## Assessment steps

| Step | Section | Content |
| --- | --- | --- |
| 1 | Request | Original, replacement, or correction; channel; replacement counts and exceptions; name change |
| 2 | Applicant | SS-5 items 1 to 11, 13, 14, 16, 17; state of residence |
| 3 | Evidence | Identity, age, citizenship or status, name change, originals |
| 4 | Signer | Relationship (item 18), signer identity, signature (item 19) |
| 5 | Tell SSA | Death-related items |
| 6 | Summary | Live class and evidence gaps |

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered number and date fields.
- camelCase in JavaScript and TypeScript; snake_case in SQL.
- One continuous single-page wizard.

## Compliance

Documentation support, not legal advice; SSA decides. See
[`doc/index.md`](doc/index.md) for the sources and the verification status of
each rule.

## References

- [SSA Form SS-5](https://www.ssa.gov/forms/ss-5.pdf)
- [20 CFR 422.103](https://www.law.cornell.edu/cfr/text/20/422.103)
- [20 CFR 422.107](https://www.law.cornell.edu/cfr/text/20/422.107)
- [SSA POMS RM 10205.400](https://secure.ssa.gov/poms.nsf/lnx/0110205400)

## Verify

```sh
bin/test-form united-states-social-security-card-application
```
