# United Kingdom death registration (England and Wales) — Agent Instructions

The registrar-side and family-side process after a medical certificate of cause of
death: register the death in England and Wales within 5 days with a qualified
informant, then the burial or cremation certificate, Tell Us Once, and certified
copies. A single continuous single-page wizard. The engine is a **completeness and
validity** engine — not a score: it classifies the registration as **ready to
register**, **incomplete**, **referred to coroner - pending**, or **registered**,
derives the 5-day deadline status, and raises flagged issues.

See [`index.md`](./index.md) for the design and [`spec/index.md`](./spec/index.md)
for the living domain spec. The doctor-completed certificate is a different form,
[`medical-certificate-of-cause-of-death`](../medical-certificate-of-cause-of-death/);
do not duplicate its content here.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md`, `./tasks.md` — roadmap and task tracking
- `./doc/` — GOV.UK and statutory sources
- `./sql/` — PostgreSQL schema (source of truth): `patient` (the deceased),
  `informant`, the main table, and the grade / rule / flag triad
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` — generated representations
- `./front-end-with-html/` — HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust Axum JSON API
- `./examples/` — fixtures and `personas.json`

## Validation engine

Files (HTML): `js/types.js`, `js/rules.js`, `js/grader.js`, `js/flags.js`; (Svelte):
`src/lib/engine/{types,registration-rules,registration-grader,flagged-issues,utils}.ts`.

- `validateRegistration(state)` returns `registrationClass`, `deadlineStatus`,
  `daysSinceConfirmation`, `informantQualified`, `blockingRules`.
- `detectFlaggedIssues(state)` returns the sorted flags.
- The engine is pure and never reads the clock: `registration.asOfDate` is the
  assessment date (the wizards default it to today).

## Registration classes

First match wins: coroner referral pending, then incomplete (any blocking rule),
then registered (registration date set), else ready to register.

## Flagged issues

18 flags in `spec/index.md` §5: deadline (overdue, due soon, late), jurisdiction,
coroner (pending, released), MCCD missing, medical examiner, informant,
particulars, appointment, documents, green form, disposal undecided, Tell Us Once,
copies, GRO index, priority service.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric and date.
- camelCase in JS/TS and serde JSON; snake_case in SQL and Rust internals.
- UUIDv4 primary keys; timestamps on every table.
- Generated artefacts are never hand-edited.
- Oxford `-ize` spelling in prose (`bin/oxford-spelling-sweep --check`).

## Statutory grounding

- Births and Deaths Registration Act 1953 (registration; section 16 qualified
  informants).
- Coroners and Justice Act 2009 (coroner involvement).
- GOV.UK: Register a death; Order a copy of a death certificate; When a death is
  reported to a coroner; Tell Us Once.

## Compliance

Administrative readiness checker for a civil-registration process; makes no clinical
decision and is not legal advice. Inherits the monorepo baseline (MDCG 2019-11
Rev.1, UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, MHRA Software
and AI as a Medical Device).

## Verify

```sh
bin/test-form united-kingdom-death-registration
bin/test-personas united-kingdom-death-registration
bin/test-engines united-kingdom-death-registration
bin/test-examples-conformance united-kingdom-death-registration
```
