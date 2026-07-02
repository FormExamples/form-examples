# Child Safeguarding Referral — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations in `sql/`
plus the generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco
setup script); both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); and the `back-end-with-loco` Rust JSON API.
`CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — referral table(s) in `sql/`: referrer, child,
   family/household, concern, category, immediate-risk, consent, informed, and
   requested-action fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Grading engine** — `types.ts`, `utils.ts`, `safeguarding-rules.ts`,
   `referral-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   status, each urgency, the consent-basis rule, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form child-safeguarding-referral`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Three independent outputs from one referral: completeness `status`, `urgency`,
  and `flags[]`. There is no numeric score.
- Urgency is computed even when the referral is `incomplete`, so an incomplete
  form never hides immediate danger.
- The consent-basis rule is part of validity: consent given, or a lawful
  information-sharing basis recorded when consent is not given.
- The form never decides that a referral is *not* required, and never replaces
  an immediate 999 call — both remain human actions outside the engine.
- Safeguarding-sensitive: presenting evidence and disclosure text are free-text;
  no automated inference beyond the documented rules.
