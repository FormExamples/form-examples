# Structured Medication Review (SMR) — plan

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
2. **SQL migrations** — a parent `review` table (context, identification,
   problems, goals, monitoring, plan) plus a one-to-many `medicine` child table
   (name, indication, adherence, ACB points, high-risk class, monitoring, STOPP /
   START criteria); timestamps and UUIDv4 PKs. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `smr-rules.ts`, `smr-grader.ts`,
   `flagged-issues.ts` with Vitest tests covering the polypharmacy boundaries,
   the ACB boundary, the composite burden band, review-status completeness, and
   every flagged issue.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form). The medicines step is a repeating list.
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (review + medicine tables).
7. **Verify** — `bin/test-form structured-medication-review`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Documentation form with **partial scoring**: the numeric outputs (medicine
  count, ACB sum) and flags support the reviewer; they do not diagnose or
  prescribe.
- The medicines list is one-to-many. The wizard must remain one continuous
  single-page wizard even though the medicines step repeats.
- The composite burden band is a max-band rule over the polypharmacy band and the
  anticholinergic band — the worse one wins.
- `reviewStatus` gates on required-section completeness (spec §4); an incomplete
  review raises a low-priority flag because the burden indicator may understate
  risk.
- ACB points are entered per medicine (0–3 on the ACB scale) rather than looked
  up from a drug dictionary, keeping the engine pure and dictionary-free.
