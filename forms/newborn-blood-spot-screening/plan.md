# Newborn Blood Spot Screening — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-07-02): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single screening table in `sql/`: sample-taker and
   setting, baby identification, consent, sample event, sample quality, nine
   condition-result columns, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `bloodspot-rules.ts`,
   `bloodspot-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   result class, referral precedence, day 5–8 window boundaries, sample-adequacy
   / avoidable-repeat detection, and the invalid carrier-on-non-SCD case.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form newborn-blood-spot-screening`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Result classification, not numeric scoring: each of the nine conditions has an
  independent result class, and the overall outcome is derived by precedence.
- `referral-required` dominates: a single `suspected` condition sets the overall
  outcome to `referral-required` and emits an urgent referral to that condition's
  specialist service, regardless of the other eight.
- `carrier` is valid only for sickle cell (SCD); recorded on any other condition
  it is a data-validity error (flagged, treated as `pending` for the outcome).
- Sample quality is orthogonal to the results: adequacy, the day 5–8 timing
  window, and avoidable-repeat detection each raise their own flags and do not
  change a condition result.
- `ageAtSampleDays` is derived from `sampleDate − dateOfBirth` (day of birth =
  day 0) but stored for audit; the engine recomputes it for the window check.
- Six of the nine conditions are inherited metabolic diseases sharing one
  referral target (inherited metabolic disease centre); SCD, CF, and CHT each
  route to their own service.
</content>
