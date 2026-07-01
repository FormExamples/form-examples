# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — plan table in `sql/`: the eight section groups
   (personal details, summary of health, preferences, clinical recommendations,
   CPR recommendation, ceilings of treatment, capacity and involvement,
   clinician sign-off) plus timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Validation engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `plan-validator.ts`, `flagged-issues.ts` with Vitest tests covering each
   mandatory rule (pass and fail), the conditional capacity rule, completeness
   arithmetic, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/plans/` list + `/plans/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form
   recommended-summary-plan-for-emergency-care-and-treatment`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- This is a **documentation / completeness** form, not a scored assessment. The
  engine returns `{ status, completenessPercent, firedRules, flags }`; there is
  no numeric clinical score. `status` is `complete` only when all eight
  mandatory rules pass.
- The capacity rule (R7) is **conditional**: proxy / consultee involvement is
  required only when the person is recorded as lacking capacity (Mental Capacity
  Act 2005). Tests must cover both branches.
- The CPR recommendation is the single most safety-critical field; a missing
  recommendation, and a do-not-attempt recommendation without documented
  discussion, are separate high-priority flags.
- Keep it one continuous single-page wizard (eight section steps + a summary
  step); no multi-page forms.
