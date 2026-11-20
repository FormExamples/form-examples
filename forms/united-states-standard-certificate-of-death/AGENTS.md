# US Standard Certificate of Death: Agent Instructions

Documentation-support instrument for the NCHS 2003 Standard Certificate of Death
as completed by the funeral director and the medical certifier. The engine is a
**completeness and validity-classification** engine, not a numeric score: it
classifies the certificate as `valid`, `incomplete`, or
`refer-to-medical-examiner-or-coroner`, derives the underlying cause, and raises
prioritized flags. Not legal advice; the registering state agency decides.

See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md). Update the spec before changing code.

## Directory map

- `spec/` living spec; `doc/` sources and state-rule verification table
- `sql/` source of truth; `xml/`, `fhir/`, `protobuf/`, `openapi/` generated, never hand-edit
- `front-end-with-html/` (`js/{types,rules,grader,flags}.js`), `front-end-with-svelte/` (`src/lib/engine/*.ts`), `back-end-with-axum/`
- `examples/` fixtures and `personas.json`

## Validation engine

- **Input:** `DeathCertificate` with sections `jurisdiction`, `decedent`, `death`, `certifier`, `partI`, `partII`, `manner`, `injury`, `referral`, `funeral`, `copies`.
- **Output:** `validateCertificate(d)` returns `{ validityClass, underlyingCause, referralIndicated }` (the Svelte port adds `flaggedIssues` and `timestamp`); `detectFlaggedIssues(d)` returns the flags.
- **Precedence:** referral, then incomplete, then valid (spec section 4).
- **Split engine:** personas pin flags with `flagsArgs: ["state"]`.
- **STATE_RULES:** change a value only with a primary source; keep `verified` honest; mirror in the Svelte port, `doc/index.md` and the spec.

## Conventions

`''` for unanswered text and enums, `null` for unanswered numbers, dates and times; camelCase in JS/TS, snake_case in SQL; UUIDv4 keys; `created_at`/`updated_at`/`deleted_at`; Oxford `-ize` spelling; generated artifacts never hand-edited.

## Verify

```sh
bin/test-form united-states-standard-certificate-of-death
bin/test-personas united-states-standard-certificate-of-death
bin/test-engines united-states-standard-certificate-of-death
bin/test-examples-conformance united-states-standard-certificate-of-death
bin/test-e2e --html united-states-standard-certificate-of-death
```
