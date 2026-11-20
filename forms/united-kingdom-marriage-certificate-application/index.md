# United Kingdom Marriage Certificate Application

A completeness and validity check for giving notice of marriage or civil
partnership in England and Wales and ordering a marriage certificate from the
General Register Office (GRO). A single continuous page collects the notice,
the ceremony, each party's identity, residence, previous-relationship and
immigration evidence, whether the parties are closely related, and the
certificate order. The engine classifies the application as **ready to submit**,
**incomplete**, **needs evidence or correction**, or **ineligible**, computes the
permitted ceremony window, and raises flagged issues. It gives no legal advice;
the register office decides each notice.

This is a **completeness and validity-classification** engine, not a clinical
score. Source rules and citations are in [`doc/index.md`](doc/index.md); the
contract is in [`spec/index.md`](spec/index.md).

## The application

Seven sections, one continuous page:

| Step | Section | What it records |
| --- | --- | --- |
| 1 | The notice | Marriage or civil partnership, notice date, registration district, whether both parties give notice together |
| 2 | The ceremony | Ceremony type, date, venue (and whether confirmed), witness count |
| 3 | First party | Name, date of birth, days resident in the district, nationality or immigration route, marital status, identity, proof of address, previous-relationship evidence, immigration evidence |
| 4 | Second party | The same fields for the second party |
| 5 | Relationship | Whether the parties are closely related |
| 6 | Marriage certificate order | GRO copies, service, index reference, note |
| 7 | Summary and validity | Live class and ceremony window; submit for the report |

## Classification

First matching class wins:

1. **Ineligible** — a party is under 18 on the ceremony date, a party is already
   married or in a civil partnership, or the parties are closely related.
2. **Incomplete** — a required field is missing, or certificate copies are
   requested without a GRO service.
3. **Needs evidence or correction** — residence under 7 days, a previous
   relationship not evidenced, immigration evidence missing, identity or proof of
   address not confirmed, notice under 29 days, ceremony after the 12-month
   expiry, fewer than two witnesses, venue not confirmed, or joint notice
   required but not given.
4. **Ready to submit** — none of the above.

The engine also returns the earliest permitted ceremony date (notice + 29 days),
the latest valid ceremony date (notice + 12 months), and whether an immigration
referral is indicated.

## Flagged issues

Eighteen flags across three priorities: high (party under 18, already married,
closely related, notice period too short, notice expires before the ceremony,
previous-relationship evidence missing, immigration referral, joint notice
required), medium (residence under 7 days, identity missing, proof of address
missing, venue not confirmed, witnesses insufficient, required fields missing),
and low (certificate service missing, certificate copies invalid, GRO index
reference missing, evidence-check fee reminder). See
[`spec/index.md`](spec/index.md) §5.

## Layers

SQL ([`sql/`](sql/)), generated XML, FHIR R5, protobuf and OpenAPI, a Lily HTML
front-end, a SvelteKit front-end, and a Rust Axum JSON API, with personas in
[`examples/personas.json`](examples/personas.json) as the engine's regression
oracle.

## Conventions

Empty string `''` for unanswered text and enum fields; `null` for unanswered
numeric and date fields; camelCase in JavaScript and TypeScript, snake_case in
SQL; UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at` on every
table.

## Compliance

This form is a documentation and completeness aid for a UK civil process, not a
medical device. It inherits the monorepo compliance baseline in the root
[`AGENTS.md`](../../AGENTS.md).

## References

See [`doc/index.md`](doc/index.md) for the GOV.UK and GRO sources.
