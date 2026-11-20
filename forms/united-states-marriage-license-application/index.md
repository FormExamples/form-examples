# United States Marriage License Application

A single-page, step-by-step questionnaire for applying for a United States
marriage license and, after the ceremony, the certified marriage certificate. It
records the issuing state and county, both applicants, eligibility (age and
consent, prior marriages, relationship, proxy), the license issuance and fee, and
the ceremony (officiant, witnesses, return of the signed license). It classifies
the application as **ready-to-apply**, **incomplete**, or **not-eligible**, works
out the earliest permitted ceremony date and the license expiry, and raises
prioritized flags (`F-USMLA-001` to `F-USMLA-024`).

**Documentation support, not legal advice.** There is no federal marriage license:
each state sets the rules and a county clerk issues the license. The issuing
agency or a court decides, and rules change.

## Classes

| Class | Meaning |
| --- | --- |
| `ready-to-apply` | nothing recorded bars the license and the details the clerk asks for are present |
| `incomplete` | required data, minor consent, ID, prior-marriage end date, appearance, or ceremony timing, witnesses, or officiant need attention |
| `not-eligible` | an applicant is under the minimum age with no permitted path, an applicant is still married, the applicants are related in a prohibited degree, or a proxy marriage the state does not allow |

`not-eligible` outranks `incomplete`.

## State rules

Ten states are encoded in `STATE_RULES` (CA, NY, TX, FL, IL, PA, OH, WA, GA, VA):
minimum age and minor path, waiting period and waivers, license validity,
witnesses, proxy marriage, and the signed-license return deadline. Any other
state uses the uniform default and raises a "verify the state rule" flag. See
[`spec/index.md`](spec/index.md) for the table and the sources.

Same-sex couples may marry in every state (*Obergefell v. Hodges*, 2015); sex or
gender never affects eligibility here.

## Artefacts

`sql/` (source of truth; `applicant`, `county_clerk`, the main application, and the
`_grade` / `_grade_rule` / `_grade_flag` triad), generated `xml/`, `fhir/`,
`protobuf/`, `openapi/`, the HTML and SvelteKit front-ends, and the Axum JSON API.
