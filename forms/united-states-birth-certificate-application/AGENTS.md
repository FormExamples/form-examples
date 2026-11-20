# United States Birth Certificate Application: Agent Instructions

A US administrative form for requesting a certified copy of a birth certificate from a state or territory vital records office. Single continuous single-page wizard. The engine is a **completeness / validity / eligibility** engine, not a clinical score: it classifies the request as **ready-to-submit**, **incomplete**, or **ineligible-requester** and raises flagged issues. It is documentation support, not legal advice; the issuing office decides.

See [`index.md`](./index.md) for the design and [`spec/index.md`](./spec/index.md) for the living domain spec. Update the spec before changing code.

## Directory map

- `./index.md`, `./AGENTS.md`, `./plan.md`, `./tasks.md`, `./CHANGELOG.md`
- `./spec/` living spec; `./doc/` research and citations (CDC/NCHS, statutes, state agencies)
- `./sql/` PostgreSQL migrations (source of truth): `applicant`, `registrant`, the main application table, and the `_grade` / `_grade_rule` / `_grade_flag` triad
- `./xml/`, `./fhir/r5/`, `./protobuf/`, `./openapi/` generated; never hand-edit
- `./front-end-with-html/`, `./front-end-with-svelte/`, `./back-end-with-axum/`
- `./examples/` fixtures, `personas.json` (regression oracle), generated FHIR bundle

## Engine

- **HTML:** `js/rules.js` (STATE_RULES, DEFAULT_RULE, predicates), `js/grader.js` (`validateApplication`), `js/flags.js` (`detectFlaggedIssues`, split engine), `js/types.js`.
- **Svelte:** `src/lib/engine/` `birth-rules.ts`, `birth-grader.ts`, `flagged-issues.ts`, `types.ts`, `defaults.ts` (`createDefaultApplication`, kept out of the `$app/env` store), `utils.ts`, tests in `birth-grader.test.ts`. The two engines must agree; `examples/personas.json` pins the HTML one.
- **Algorithm:** `ineligibleRequester` first, then any gap, else ready. The state is `registrant.state`; unknown states use `DEFAULT_RULE` and raise `F-BIRTH-STATE-001`. See spec section 4 and the state table in spec section 5.
- **Changing a state rule:** edit both `rules.js` and `birth-rules.ts`, the spec table and `doc/index.md`, then `bin/test-personas united-states-birth-certificate-application --update` and review the diff.

## Conventions

`''` for unanswered text and enum fields, `null` for unanswered numeric, date, and time fields. camelCase in JS and TS, snake_case in SQL. Oxford `-ize` spelling in prose. The personas freeze the clock (`2026-09-03T12:00:00Z`) so the minimum-age test never rots.

## Verify

```sh
bin/test-form united-states-birth-certificate-application
bin/test-personas united-states-birth-certificate-application
bin/test-engines united-states-birth-certificate-application
bin/test-sql-apply united-states-birth-certificate-application
bin/test-examples-conformance united-states-birth-certificate-application
bin/test-e2e --html united-states-birth-certificate-application
bin/generate-llms-txt.py --check united-states-birth-certificate-application
bin/generate-form-skills.py --check united-states-birth-certificate-application
```
