# Bowel Cancer Screening with Faecal Immunochemical Test (FIT) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification, eligibility and invitation, kit return and adequacy, FIT
   result (faecal Hb µg/g, threshold applied), symptom flag, timestamps; UUIDv4
   PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `fit-rules.ts`,
   `fit-grader.ts`, `flagged-issues.ts` with Vitest tests covering the threshold
   boundary (119 / 120 / 121), each result class, non-return, spoilt kit, and
   the symptomatic override.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form bowel-cancer-screening-with-faecal-immunochemical-test`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- The engine is a **classification** (not additive scoring) engine: a
  priority-ordered decision producing a result class and a management action.
- `thresholdApplied` is a stored field defaulting to **120 µg Hb/g** (screening).
  Setting it to **10** reproduces the NICE DG56 symptomatic behaviour without
  code changes.
- `symptomaticPathway` is orthogonal to the numeric result: a symptomatic
  participant is referred urgently even when FIT is negative.
- Kit not returned and inadequate-sample cases both resolve to a **repeat-kit**
  action but raise distinct flags.
- Must remain one continuous single-page wizard (7 steps).
