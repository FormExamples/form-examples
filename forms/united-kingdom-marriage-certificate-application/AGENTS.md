# United Kingdom Marriage Certificate Application — Agent Instructions

A completeness and validity check for giving notice of marriage or civil
partnership in England and Wales and ordering a marriage certificate from the
General Register Office (GRO). Collects the notice, the ceremony, each party's
identity, residence, previous-relationship and immigration evidence, whether the
parties are closely related, and the certificate order via a single continuous
single-page wizard. The engine is a **completeness and validity-classification**
engine, not a score: it classifies the application as **ready-to-submit**,
**incomplete**, **needs-evidence**, or **ineligible**, and raises flagged issues.

See [`index.md`](./index.md) for the full design and the step table,
[`spec/index.md`](./spec/index.md) for the living domain spec, and
[`doc/index.md`](./doc/index.md) for the GOV.UK / GRO sources of every rule.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — statutory and guidance reference documentation (GOV.UK, GRO)
- `./sql/` — PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API

## Validation engine

- **Input shape:** `Application` — sections `notice`, `ceremony`, `partyOne`,
  `partyTwo`, `relationship`, `certificate`.
- **Output shape:**
  ```ts
  validateApplication(a: Application): {
    validityClass: 'ready-to-submit' | 'incomplete' | 'needs-evidence' | 'ineligible';
    earliestCeremonyDate: string | null;
    latestCeremonyDate: string | null;
    immigrationReferralIndicated: boolean;
    flaggedIssues: FlaggedIssue[];   // Svelte grader; HTML composes detectFlaggedIssues(state)
  }
  ```
- **Algorithm:** classification, not additive. Precedence: under 18, already
  married, or closely related -> `ineligible`; else a missing required field or
  certificate copies without a service -> `incomplete`; else any evidence,
  timing, witness or venue shortfall -> `needs-evidence`; else
  `ready-to-submit`. See spec §4. Dates are ISO strings with no clock.
- **HTML engine files** (`front-end-with-html/js/`): `types.js`, `rules.js`
  (predicates and date helpers), `grader.js`, `flags.js`.
- **Svelte engine files** (`front-end-with-svelte/src/lib/engine/`): `types.ts`,
  `utils.ts`, `marriage-rules.ts`, `marriage-grader.ts`, `flagged-issues.ts`.
- **Tests:** `marriage-grader.test.ts` covers each class, the precedence, the
  29-day, 12-month and age-18 boundaries, joint notice and the EU Settlement
  Scheme exception, and checks the Svelte port against every persona in
  `examples/personas.json` (the HTML engine's oracle).

## Validity classes

- **Ready to submit** — eligible, complete, evidenced, and inside the ceremony
  window. The register office still decides the notice.
- **Incomplete** — a required field is missing, or certificate copies are
  requested without a GRO service.
- **Needs evidence or correction** — residence under 7 days, previous
  relationship not evidenced, immigration evidence missing, identity or proof of
  address not confirmed, notice under 29 days, ceremony after the 12-month
  expiry, fewer than two witnesses, venue not confirmed, or joint notice not
  given when required.
- **Ineligible** — under 18, already married or civil-partnered, or closely
  related.

## Flagged issues

Eighteen flags computed independently of the class (see spec §5): high (party
under 18, already married, closely related, notice period too short, notice
expires before ceremony, previous-relationship evidence missing, immigration
referral, joint notice required), medium (residence, identity, proof of address,
venue, witnesses, required fields), low (certificate service, copies, GRO index
reference, evidence-check fee).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric and date fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.

## Statutory grounding

- GOV.UK, *Marriages and civil partnerships in England and Wales* (give notice,
  legal requirements, documents, plan your ceremony).
- GOV.UK / GRO, *Order a copy of a birth, death, marriage or civil partnership
  certificate*.
- Marriage Act 1949; Civil Partnership Act 2004; Marriage and Civil Partnership
  (Minimum Age) Act 2022; Immigration Act 2014 Part 4.

## Compliance

- Not a medical device; a completeness aid for a UK civil process. It inherits
  the monorepo baseline in the root `AGENTS.md`.
- It gives no legal advice; the register office decides each notice.

## Verify

```sh
bin/test-form united-kingdom-marriage-certificate-application
```
