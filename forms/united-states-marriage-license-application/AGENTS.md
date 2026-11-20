# United States Marriage License Application — Agent Instructions

Documentation-support form for a United States marriage license and the certified
marriage certificate. Read [`spec/index.md`](spec/index.md) first; it is the contract.
This is **not legal advice**; the issuing county clerk or a court decides.

## Directory map

| Path | Role |
| --- | --- |
| `spec/index.md` | living domain spec: algorithm, state table, flags |
| `doc/index.md` | research notes and citations |
| `sql/` | source of truth; `applicant`, `county_clerk`, main table, grade triad |
| `front-end-with-html/js/{types,rules,grader,flags}.js` | engine (`rules.js` holds `STATE_RULES`) |
| `front-end-with-svelte/src/lib/engine/` | TypeScript port with vitest tests |
| `back-end-with-axum/` | Rust JSON API |
| `examples/personas.json` | 15 personas pinning every class and flag except F-USMLA-020 |

## Validation engine

`validateApplication(state)` returns `{ applicationClass, earliestCeremonyDate,
licenseExpiryDate, stateRuleKnown }`; `detectFlaggedIssues(state)` returns the
flags. It is a split engine (the flags are not part of the grade). Keep the HTML
and Svelte engines in lockstep; when a state rule changes, change `STATE_RULES` in
both, `spec/index.md` section 4, and the personas, then run
`bin/test-personas united-states-marriage-license-application --update` and review the diff.

## Classes

`not-eligible` > `incomplete` > `ready-to-apply` (first match wins).

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric and date fields.
- Never store a Social Security number; only its status.
- Verify every state value against the clerk or statute before changing it, and cite the source in `doc/index.md`.
- Oxford `-ize` spelling in prose.

## Compliance

Documentation support only. See [`spec/index.md`](spec/index.md) section 9.

## Verify

```sh
bin/test-form united-states-marriage-license-application
bin/test-personas united-states-marriage-license-application
bin/test-engines united-states-marriage-license-application
bin/test-examples-conformance united-states-marriage-license-application
bin/test-e2e --html united-states-marriage-license-application
```
